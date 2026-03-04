const axios = require('axios');
const env = require('../config/env');

const vercelApi = axios.create({
    baseURL: 'https://api.vercel.com',
    headers: {
        Authorization: `Bearer ${env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

/**
 * Build query params for team scope
 */
const getTeamQuery = () => {
    return env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : '';
};

/**
 * Create a Vercel project linked to a GitHub repository
 */
exports.createProject = async (projectName, repoName) => {
    try {
        const response = await vercelApi.post(`/v10/projects${getTeamQuery()}`, {
            name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            framework: null,
            gitRepository: {
                type: 'github',
                repo: `${env.GITHUB_OWNER}/${repoName}`,
            },
            buildCommand: null,
            installCommand: null,
            outputDirectory: null,
        });

        console.log(`🔗 Vercel project created: ${response.data.name}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 409) {
            console.log(`⚠️ Vercel project already exists, fetching...`);
            return exports.getProject(projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
        }
        throw new Error(`Vercel create project failed: ${error.response?.data?.error?.message || error.message}`);
    }
};

/**
 * Get project details
 */
exports.getProject = async (projectName) => {
    try {
        const response = await vercelApi.get(
            `/v9/projects/${projectName}${getTeamQuery()}`
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get Vercel project: ${error.response?.data?.error?.message || error.message}`);
    }
};

/**
 * Trigger a new deployment by creating a deployment hook
 */
exports.triggerDeployment = async (projectName, repoName) => {
    try {
        // Create a deployment using the Vercel API
        const response = await vercelApi.post(`/v13/deployments${getTeamQuery()}`, {
            name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            project: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            gitSource: {
                type: 'github',
                org: env.GITHUB_OWNER,
                repo: repoName,
                ref: 'main',
            },
        });

        console.log(`🚀 Vercel deployment triggered: ${response.data.url}`);
        return response.data;
    } catch (error) {
        throw new Error(`Vercel deployment failed: ${error.response?.data?.error?.message || error.message}`);
    }
};

/**
 * Get deployment status and URL
 */
exports.getDeployment = async (deploymentId) => {
    try {
        const response = await vercelApi.get(
            `/v13/deployments/${deploymentId}${getTeamQuery()}`
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get deployment: ${error.response?.data?.error?.message || error.message}`);
    }
};

/**
 * Wait for deployment to be ready and return the production URL
 */
exports.waitForDeployment = async (deploymentId, maxWaitMs = 300000) => {
    const startTime = Date.now();
    const pollInterval = 5000;

    while (Date.now() - startTime < maxWaitMs) {
        const deployment = await exports.getDeployment(deploymentId);

        if (deployment.readyState === 'READY') {
            const productionUrl = `https://${deployment.url}`;
            console.log(`✅ Deployment ready: ${productionUrl}`);
            return {
                url: productionUrl,
                status: 'READY',
                deploymentId: deployment.id,
            };
        }

        if (deployment.readyState === 'ERROR') {
            throw new Error(`Deployment failed with state: ERROR`);
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Deployment timed out');
};

/**
 * Delete a Vercel project
 */
exports.deleteProject = async (projectName) => {
    try {
        await vercelApi.delete(
            `/v9/projects/${projectName}${getTeamQuery()}`
        );
        console.log(`🗑️ Vercel project deleted: ${projectName}`);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete Vercel project: ${error.response?.data?.error?.message || error.message}`);
    }
};
