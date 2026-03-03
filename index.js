const { onRequest } = require('firebase-functions/v2/https');
const next = require('next');

const nextjsDistDir = './.next';

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
});

const nextjsHandle = nextjsServer.getRequestHandler();

// Prepare once at cold start (global scope), not on every request
const prepared = nextjsServer.prepare();

exports.nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '2GiB',
    cpu: 1,
    timeoutSeconds: 300,
    minInstances: 0,
    maxInstances: 10,
    concurrency: 80,
  },
  async (req, res) => {
    await prepared;
    return nextjsHandle(req, res);
  }
);
