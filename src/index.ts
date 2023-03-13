import Hapi from '@hapi/hapi';

import routes from './routes';

// Initialize server
const server = Hapi.server({
  port: 3000,
});

// Configure cookie
server.state('accessToken', {
  isSecure: false,
});

// Configure routes
server.route(routes);

// Start server
(async () => {
  await server.start().catch((err) => console.log(err));
  console.log(`Listening on port ${server.info.port}`);
})();

// Handle errors
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
