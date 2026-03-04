const axios = require('axios');
const env = require('../config/env');

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'PDMS-App',
    },
});

/**
 * Create a new private GitHub repository
 */
exports.createRepository = async (repoName, description = '') => {
    try {
        const response = await githubApi.post('/user/repos', {
            name: repoName,
            description: description || `Client project: ${repoName}`,
            private: true,
            auto_init: false,
        });
        console.log(`📦 GitHub repo created: ${response.data.html_url}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            throw new Error(`Repository "${repoName}" already exists on GitHub`);
        }
        throw new Error(`GitHub create repo failed: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Get all files from a template repository (recursive)
 */
exports.getTemplateFiles = async (templateRepo) => {
    try {
        const owner = env.GITHUB_OWNER;
        const files = [];

        const fetchTree = async (path = '') => {
            const url = `/repos/${owner}/${templateRepo}/contents/${path}`;
            const response = await githubApi.get(url);

            for (const item of response.data) {
                if (item.type === 'file') {
                    // Get file content
                    const fileResponse = await githubApi.get(item.url);
                    files.push({
                        path: item.path,
                        content: fileResponse.data.content, // base64 encoded
                        encoding: fileResponse.data.encoding,
                    });
                } else if (item.type === 'dir') {
                    await fetchTree(item.path);
                }
            }
        };

        await fetchTree();
        return files;
    } catch (error) {
        throw new Error(`Failed to fetch template files: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Push files to a repository using the Git Trees API (batch push)
 */
exports.pushFilesToRepo = async (repoName, files) => {
    try {
        const owner = env.GITHUB_OWNER;

        // Step 1: Create initial commit with a README to initialize the repo
        const initResponse = await githubApi.put(
            `/repos/${owner}/${repoName}/contents/README.md`,
            {
                message: 'Initial commit',
                content: Buffer.from(`# ${repoName}\nAuto-deployed by PDMS`).toString('base64'),
            }
        );

        const latestCommitSha = initResponse.data.commit.sha;

        // Step 2: Get the base tree
        const baseTreeResponse = await githubApi.get(
            `/repos/${owner}/${repoName}/git/trees/${latestCommitSha}`
        );

        // Step 3: Create blobs for each file
        const treeItems = [];
        for (const file of files) {
            const blobResponse = await githubApi.post(`/repos/${owner}/${repoName}/git/blobs`, {
                content: file.content,
                encoding: file.encoding || 'base64',
            });
            treeItems.push({
                path: file.path,
                mode: '100644',
                type: 'blob',
                sha: blobResponse.data.sha,
            });
        }

        // Step 4: Create new tree
        const newTreeResponse = await githubApi.post(`/repos/${owner}/${repoName}/git/trees`, {
            base_tree: baseTreeResponse.data.sha,
            tree: treeItems,
        });

        // Step 5: Create commit
        const commitResponse = await githubApi.post(`/repos/${owner}/${repoName}/git/commits`, {
            message: 'feat: initial project setup with theme configuration',
            tree: newTreeResponse.data.sha,
            parents: [latestCommitSha],
        });

        // Step 6: Update reference
        await githubApi.patch(`/repos/${owner}/${repoName}/git/refs/heads/main`, {
            sha: commitResponse.data.sha,
        });

        console.log(`📤 Files pushed to ${repoName}`);
        return { success: true, commitSha: commitResponse.data.sha };
    } catch (error) {
        throw new Error(`Failed to push files: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Delete a GitHub repository
 */
exports.deleteRepository = async (repoName) => {
    try {
        await githubApi.delete(`/repos/${env.GITHUB_OWNER}/${repoName}`);
        console.log(`🗑️ GitHub repo deleted: ${repoName}`);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete repo: ${error.response?.data?.message || error.message}`);
    }
};
