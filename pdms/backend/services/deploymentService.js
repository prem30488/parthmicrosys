const githubService = require('./githubService');
const vercelService = require('./vercelService');
const env = require('../config/env');

/**
 * Main deployment orchestrator
 * Handles the full pipeline: clone template → create repo → apply theme → push → deploy to Vercel
 *
 * @param {Object} product - Product document from MongoDB
 * @returns {Object} - { githubRepoUrl, vercelDeploymentUrl }
 */
exports.deployProduct = async (product) => {
    const { clientId, category, themeName } = product;
    const repoName = clientId;

    console.log(`\n====================================`);
    console.log(`🚀 Starting deployment for: ${clientId}`);
    console.log(`   Category: ${category}`);
    console.log(`   Theme: ${themeName}`);
    console.log(`====================================\n`);

    // Step 1: Determine template repo based on category
    const templateRepo =
        category === 'Ecommerce' ? env.GITHUB_TEMPLATE_ECOMMERCE : env.GITHUB_TEMPLATE_REALESTATE;

    console.log(`📋 Step 1: Using template repo: ${templateRepo}`);

    // Step 2: Get files from template repository
    console.log(`📥 Step 2: Fetching template files...`);
    let templateFiles = await githubService.getTemplateFiles(templateRepo);
    console.log(`   Found ${templateFiles.length} files`);

    // Step 3: Apply theme configuration
    console.log(`🎨 Step 3: Applying theme: ${themeName}`);
    templateFiles = applyThemeConfig(templateFiles, themeName, product);

    // Step 4: Create new GitHub repository
    console.log(`📦 Step 4: Creating GitHub repo: ${repoName}`);
    const repo = await githubService.createRepository(
        repoName,
        `${product.clientName} - ${category} project deployed by PDMS`
    );
    const githubRepoUrl = repo.html_url;

    // Step 5: Push files to new repository
    console.log(`📤 Step 5: Pushing files to repo...`);
    await githubService.pushFilesToRepo(repoName, templateFiles);

    // Step 6: Create Vercel project linked to GitHub repo
    console.log(`🔗 Step 6: Creating Vercel project...`);
    const vercelProject = await vercelService.createProject(repoName, repoName);

    // Step 7: Trigger deployment
    console.log(`🚀 Step 7: Triggering Vercel deployment...`);
    const deployment = await vercelService.triggerDeployment(repoName, repoName);

    // Step 8: Wait for deployment to be ready
    console.log(`⏳ Step 8: Waiting for deployment to be ready...`);
    const deploymentResult = await vercelService.waitForDeployment(deployment.id);

    const vercelDeploymentUrl = deploymentResult.url;

    console.log(`\n====================================`);
    console.log(`✅ Deployment complete!`);
    console.log(`   GitHub: ${githubRepoUrl}`);
    console.log(`   Vercel: ${vercelDeploymentUrl}`);
    console.log(`====================================\n`);

    return { githubRepoUrl, vercelDeploymentUrl };
};

/**
 * Apply theme configuration to template files
 * Modifies config/theme files to inject the selected theme
 */
function applyThemeConfig(files, themeName, product) {
    const themeConfig = getThemeConfig(themeName);

    return files.map((file) => {
        let content = file.content;
        let encoding = file.encoding;

        // Decode base64 content for processing
        if (encoding === 'base64') {
            content = Buffer.from(content, 'base64').toString('utf-8');
        }

        // Apply theme to common config files
        if (
            file.path.includes('theme.config') ||
            file.path.includes('theme.js') ||
            file.path.includes('tailwind.config') ||
            file.path.includes('config/theme')
        ) {
            content = injectThemeVariables(content, themeConfig);
        }

        // Update .env files with project-specific values
        if (file.path === '.env' || file.path === '.env.local' || file.path === '.env.example') {
            content = updateEnvFile(content, product, themeConfig);
        }

        // Update package.json name field
        if (file.path === 'package.json') {
            try {
                const pkg = JSON.parse(content);
                pkg.name = product.clientId.toLowerCase();
                pkg.description = `${product.clientName} - ${product.category} project`;
                content = JSON.stringify(pkg, null, 2);
            } catch (e) {
                // Not valid JSON, skip
            }
        }

        // Re-encode to base64
        return {
            ...file,
            content: Buffer.from(content, 'utf-8').toString('base64'),
            encoding: 'base64',
        };
    });
}

/**
 * Get theme color variables based on theme name
 */
function getThemeConfig(themeName) {
    const themes = {
        Dark: {
            primaryColor: '#1a1a2e',
            secondaryColor: '#16213e',
            accentColor: '#0f3460',
            textColor: '#e0e0e0',
            bgColor: '#0a0a1a',
            mode: 'dark',
        },
        Light: {
            primaryColor: '#ffffff',
            secondaryColor: '#f8f9fa',
            accentColor: '#4361ee',
            textColor: '#212529',
            bgColor: '#ffffff',
            mode: 'light',
        },
        Blue: {
            primaryColor: '#1e3a5f',
            secondaryColor: '#2563eb',
            accentColor: '#3b82f6',
            textColor: '#f0f9ff',
            bgColor: '#0c1929',
            mode: 'dark',
        },
        Green: {
            primaryColor: '#064e3b',
            secondaryColor: '#059669',
            accentColor: '#10b981',
            textColor: '#ecfdf5',
            bgColor: '#022c22',
            mode: 'dark',
        },
        Purple: {
            primaryColor: '#3b0764',
            secondaryColor: '#7c3aed',
            accentColor: '#a78bfa',
            textColor: '#faf5ff',
            bgColor: '#1e0533',
            mode: 'dark',
        },
        Sunset: {
            primaryColor: '#7c2d12',
            secondaryColor: '#ea580c',
            accentColor: '#fb923c',
            textColor: '#fff7ed',
            bgColor: '#431407',
            mode: 'dark',
        },
    };

    return themes[themeName] || themes.Dark;
}

/**
 * Inject theme variables into config content
 */
function injectThemeVariables(content, themeConfig) {
    let result = content;
    result = result.replace(/PRIMARY_COLOR\s*[:=]\s*['"].*?['"]/g, `PRIMARY_COLOR: '${themeConfig.primaryColor}'`);
    result = result.replace(/SECONDARY_COLOR\s*[:=]\s*['"].*?['"]/g, `SECONDARY_COLOR: '${themeConfig.secondaryColor}'`);
    result = result.replace(/ACCENT_COLOR\s*[:=]\s*['"].*?['"]/g, `ACCENT_COLOR: '${themeConfig.accentColor}'`);
    result = result.replace(/TEXT_COLOR\s*[:=]\s*['"].*?['"]/g, `TEXT_COLOR: '${themeConfig.textColor}'`);
    result = result.replace(/BG_COLOR\s*[:=]\s*['"].*?['"]/g, `BG_COLOR: '${themeConfig.bgColor}'`);
    result = result.replace(/THEME_MODE\s*[:=]\s*['"].*?['"]/g, `THEME_MODE: '${themeConfig.mode}'`);
    return result;
}

/**
 * Update .env file content with project-specific values
 */
function updateEnvFile(content, product, themeConfig) {
    let result = content;
    result += `\n\n# PDMS Auto-Generated Config\n`;
    result += `NEXT_PUBLIC_THEME_MODE=${themeConfig.mode}\n`;
    result += `NEXT_PUBLIC_PRIMARY_COLOR=${themeConfig.primaryColor}\n`;
    result += `NEXT_PUBLIC_ACCENT_COLOR=${themeConfig.accentColor}\n`;
    result += `NEXT_PUBLIC_CLIENT_ID=${product.clientId}\n`;
    result += `NEXT_PUBLIC_CLIENT_NAME=${product.clientName}\n`;
    return result;
}
