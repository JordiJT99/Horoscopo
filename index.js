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

exports.nextjsFunc = onRequest(
  {
    region: 'us-central1', // or your preferred region
    memory: '1GiB',
    timeoutSeconds: 300,
  },
  async (req, res) => {
    await nextjsServer.prepare();
    return nextjsHandle(req, res);
  }
);
