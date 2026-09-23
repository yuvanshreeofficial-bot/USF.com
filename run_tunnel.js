const localtunnel = require('localtunnel');
const http = require('http');

const PORT = 3000;
let currentTunnel = null;
let pingInterval = null;

async function startTunnel() {
  try {
    if (currentTunnel) {
      try { currentTunnel.close(); } catch(e) {}
    }
    if (pingInterval) clearInterval(pingInterval);

    console.log('[TUNNEL] Connecting to localtunnel server...');
    currentTunnel = await localtunnel({ port: PORT });
    console.log('LIVE_SHARE_URL:', currentTunnel.url);

    currentTunnel.on('close', () => {
      console.log('[TUNNEL] Disconnected. Auto-reconnecting in 2s...');
      setTimeout(startTunnel, 2000);
    });

    currentTunnel.on('error', (err) => {
      console.error('[TUNNEL] Error:', err.message);
      setTimeout(startTunnel, 3000);
    });

    // Keep-alive heartbeat every 15s to keep connection warm and active
    pingInterval = setInterval(() => {
      if (currentTunnel && currentTunnel.url) {
        http.get('http://127.0.0.1:' + PORT + '/', () => {}).on('error', () => {});
      }
    }, 15000);

  } catch (err) {
    console.error('[TUNNEL] Initialization error:', err.message);
    setTimeout(startTunnel, 3000);
  }
}

startTunnel();
