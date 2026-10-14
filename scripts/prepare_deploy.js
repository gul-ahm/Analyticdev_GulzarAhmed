const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = 'analyticsdev-deploy-bundled-script';
const ROOT_DIR = process.cwd();

// Helper to copy directory recursive
function copyDir(src, dest) {
    fs.cpSync(src, dest, { recursive: true, force: true, dereference: true });
}

async function prepare() {
    console.log(`Preparing deployment folder: ${DEPLOY_DIR}...`);

    // 1. Clean previous
    if (fs.existsSync(DEPLOY_DIR)) {
        console.log('Cleaning old deployment folder...');
        fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DEPLOY_DIR);

    // 2. Copy Standalone (Base)
    const standaloneDir = path.join(ROOT_DIR, '.next', 'standalone');
    if (!fs.existsSync(standaloneDir)) {
        console.error('.next/standalone not found! Did you run "npm run build"?');
        process.exit(1);
    }
    console.log('Copying standalone build...');
    copyDir(standaloneDir, DEPLOY_DIR);

    // 2.1 PATCH: Inject "migrate:bundled" script into the deployed package.json
    // This allows the user to see it in cPanel UI
    const deployPkgPath = path.join(DEPLOY_DIR, 'package.json');
    if (fs.existsSync(deployPkgPath)) {
        const pkg = require(deployPkgPath);
        pkg.scripts = pkg.scripts || {};
        pkg.scripts['migrate:bundled'] = 'node scripts/migrate-db.bundled.js';
        fs.writeFileSync(deployPkgPath, JSON.stringify(pkg, null, 2));
        console.log('Injected "migrate:bundled" script into package.json');
    }

    // 3. Copy Static Assets (.next/static -> .next/static)
    const staticSrc = path.join(ROOT_DIR, '.next', 'static');
    const staticDest = path.join(DEPLOY_DIR, '.next', 'static');
    if (fs.existsSync(staticSrc)) {
        console.log('Copying .next/static...');
        copyDir(staticSrc, staticDest);
    }

    // 4. Copy Public Assets (public -> public)
    const publicSrc = path.join(ROOT_DIR, 'public');
    const publicDest = path.join(DEPLOY_DIR, 'public');
    if (fs.existsSync(publicSrc)) {
        console.log('Copying public folder...');
        copyDir(publicSrc, publicDest);
    }

    // 5. Copy Migrations & Scripts (for DB setup)
    console.log('Copying migrations and scripts...');
    copyDir(path.join(ROOT_DIR, 'migrations'), path.join(DEPLOY_DIR, 'migrations'));

    // Only copy specific scripts needed for migration
    const scriptsDest = path.join(DEPLOY_DIR, 'scripts');
    fs.mkdirSync(scriptsDest, { recursive: true });

    // CRITICAL: Use the bundled migration script (single file, no dependencies needed)
    const bundledMigration = path.join(ROOT_DIR, 'scripts', 'migrate-db.bundled.js');
    if (fs.existsSync(bundledMigration)) {
        console.log('Found bundled migration script. Copying...');
        fs.copyFileSync(bundledMigration, path.join(scriptsDest, 'migrate-db.bundled.js'));
    } else {
        console.warn('Bundled migration script not found! Falling back to raw script (might fail without node_modules).');
        fs.copyFileSync(path.join(ROOT_DIR, 'scripts', 'migrate-db.js'), path.join(scriptsDest, 'migrate-db.js'));
    }

    // 6. CLEANUP: No need to copy node_modules anymore because we are using bundled script.
    console.log('Skipping node_modules copy (using bundled migration script instead).');

    // 7. Create server_cpanel.js (Startup Wrapper)
    const cpanelWrapperContent = `
// server_cpanel.js - Wrapper for cPanel/LiteSpeed
const path = require('path');

// Ensure we look in local node_modules (if any exist from previous steps, though we are minimizing them now)
// For the main app, standalone build has what it needs.
module.paths.push(path.join(__dirname, 'node_modules'));

try {
    require('./server.js');
} catch (error) {
    console.error('[cPanel] Failed to start server:', error);
    process.exit(1);
}
    `.trim();
    fs.writeFileSync(path.join(DEPLOY_DIR, 'server_cpanel.js'), cpanelWrapperContent);

    // 8. Create README
    fs.writeFileSync(path.join(DEPLOY_DIR, 'README.txt'), `
DEPLOYMENT INSTRUCTIONS (Single File Migration)
===============================================

1. Upload "analyticsdev-deploy.tar.gz" to your server and extract it.
2. Create a .env file with your database credentials.
3. Set "Application startup file" to "server_cpanel.js".

Migration Step:
---------------
4. Run "node scripts/migrate-db.bundled.js" 
   (Note the .bundled.js extension - no dependencies needed!)

5. Start the app.
    `.trim());

    console.log(`Deployment package ready at: ${path.join(ROOT_DIR, DEPLOY_DIR)}`);
    console.log('You can now compression this folder to .tar.gz');
}

prepare().catch(console.error);
