const { spawn } = require('child_process');
const path = require('path');
const chokidar = require('chokidar');

const root = path.resolve(__dirname);
const watchedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.graphql', '.gql'];
const watchPaths = [path.join(root, 'src'), path.join(root, 'codegen.ts')];

let running = false;
let queued = false;

function shouldRegenerate(eventPath) {
  const relPath = path.relative(root, eventPath);
  if (relPath.startsWith('..') || relPath.startsWith(`..${path.sep}`)) {
    return false;
  }
  if (relPath === '' || relPath.startsWith('node_modules') || relPath.startsWith('.git') || relPath.startsWith('.next') || relPath.startsWith('src/graphql')) {
    return false;
  }
  return watchedExtensions.some((ext) => relPath.endsWith(ext));
}

function runCodegen() {
  if (running) {
    queued = true;
    return;
  }

  running = true;
  console.log('[Codegen] Running GraphQL Code Generator...');

  const child = spawn('yarn', ['generate'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('close', (code) => {
    running = false;

    if (code !== 0) {
      console.error(`[Codegen] generation failed with exit code ${code}`);
    } else {
      console.log('[Codegen] generation finished successfully.');
    }

    if (queued) {
      queued = false;
      runCodegen();
    }
  });
}

async function startWatcher() {
  console.log('[Codegen] Starting file watcher...');

  const watcher = chokidar.watch(watchPaths, {
    ignored: [
      /(^|[\/\\])\../,
      'node_modules/**',
      '.next/**',
      'src/graphql/**',
      'schema.graphql',
    ],
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 10,
    },
  });

  watcher.on('all', (event, eventPath) => {
    if (!shouldRegenerate(eventPath)) {
      return;
    }

    console.log(`[Codegen] ${event} ${path.relative(root, eventPath)} detected. Regenerating...`);
    runCodegen();
  });

  watcher.on('error', (error) => {
    console.error('[Codegen] watcher error:', error);
  });

  console.log('[Codegen] Watching for file changes.');
}

process.on('SIGINT', () => {
  process.exit(0);
});

runCodegen();
startWatcher().catch((error) => {
  console.error('[Codegen] Failed to start watcher:', error);
  process.exit(1);
});
