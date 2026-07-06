const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// pnpm monorepo: watch the full workspace and resolve from both roots
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Required for pnpm: Metro must follow symlinks into the .pnpm virtual store
// so that packages installed at the workspace root are visible to the bundler.
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
