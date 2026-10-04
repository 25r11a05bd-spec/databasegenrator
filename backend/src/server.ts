import app from './app';
import { ENV } from './config/env';

const server = app.listen(ENV.PORT, () => {
  console.log(`🚀 DB-Generator Backend running on port ${ENV.PORT}`);
  console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
