const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const command = process.platform === 'win32' ? process.env.ComSpec : 'npm';
const args = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm run dev']
  : ['run', 'dev'];
const backend = spawn(command, args, {
  cwd: path.join(root, 'backend'),
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
backend.stdout.on('data', (chunk) => { output += chunk.toString(); });
backend.stderr.on('data', (chunk) => { output += chunk.toString(); });

function fail(message) {
  console.error(`FAIL: ${message}`);
  if (output.trim()) console.error(output.trim());
  backend.kill();
  process.exit(1);
}

async function waitForApi() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  fail('La API no respondió en http://localhost:3001.');
}

async function run() {
  const health = await waitForApi();
  if (!health.ok) fail('La API respondió sin ok=true.');

  const checkoutResponse = await fetch('http://localhost:3001/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: 'pro',
      businessName: 'Refugio de Prueba',
      email: 'prueba@example.com',
    }),
  });
  const checkout = await checkoutResponse.json();
  if (!checkoutResponse.ok || !checkout.ok || !checkout.checkoutUrl) {
    fail('El endpoint de checkout no creó una sesión válida.');
  }

  const distIndex = path.join(root, 'frontend', 'dist', 'index.html');
  if (!fs.existsSync(distIndex)) {
    fail('Falta frontend/dist/index.html. Ejecuta npm run build antes.');
  }

  console.log('PASS: API saludable');
  console.log(`PASS: Checkout disponible${checkout.demoMode ? ' en modo demo' : ''}`);
  console.log('PASS: Build del frontend encontrado');
  console.log('PRUEBA DE ORO: TODO OK');
  backend.kill();
}

run().catch((error) => fail(error.message));