import path from 'path';

import fastify from 'fastify';
import now from 'fastify-now';
import fastifyMultipart from 'fastify-multipart';
import fastifySwagger from 'fastify-swagger';

import { loadConfig, swaggerConfig } from '@lib/config';

import fastifyCors from 'fastify-cors';

loadConfig();

export async function createServer() {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });

  // TODO swagger is not really working
  server.register(fastifySwagger, swaggerConfig());
  server.register(fastifyCors, { origin: true });

  server.register(fastifyMultipart, { attachFieldsToBody: true });
  server.register(now, {
    routesFolder: path.join(__dirname, './routes'),
  });

  await server.ready();
  return server;
}

export async function startServer() {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    // process.exit(1);
  });

  const server = await createServer();
  await server.listen(+process.env.API_PORT, process.env.API_HOST);

  if (process.env.NODE_ENV === 'production') {
    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () =>
        server.close().then((err) => {
          console.log(`close application on ${signal}`);
          process.exit(err ? 1 : 0);
        }),
      );
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
