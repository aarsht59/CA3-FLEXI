/**
 * Standalone Native Node.ts Server for RentalWheels Backend
 * Run via: npx tsx backend/standaloneServer.ts
 * Listens on port 5000 (or PORT env var)
 */

import http from 'node:http';
import { handleNativeApiRequest } from './nativeServer.ts';
import { initDatabase, getDatabaseStatus } from './db.ts';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  // Initialize Database connection (MongoDB / fallback)
  const dbResult = await initDatabase();
  console.log(`\n=================================================`);
  console.log(`🚗 RentalWheels Native Node.ts Backend Server`);
  console.log(`=================================================`);
  console.log(`Status: ${dbResult.message}`);
  console.log(`Database Info:`, getDatabaseStatus());
  console.log(`=================================================`);

  const server = http.createServer(async (req, res) => {
    const handled = await handleNativeApiRequest(req, res);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found. Use /api/cars, /api/bookings, etc.' }));
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running natively at http://localhost:${PORT}`);
    console.log(`Ready for MongoDB Compass connection at mongodb://127.0.0.1:27017/rentalwheels\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start native Node.ts server:', err);
  process.exit(1);
});
