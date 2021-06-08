import path from 'path';
import envSchema from 'env-schema';
import S from 'fluent-json-schema';

export function loadConfig(): void {
  const result = require('dotenv').config({
    path: path.join(__dirname, `../../${process.env.NODE_ENV ?? 'development'}.env`),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  envSchema({
    data: result.parsed,
    schema: S.object()
      .prop('NODE_ENV', S.string().enum(['development', 'testing', 'production']).required())
      .prop('API_HOST', S.string().required())
      .prop('API_PORT', S.string().required()),
  });
}

export function swaggerConfig() {
  return {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Reporting tool documentation',
        description: 'Documentation for reporting tool',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      consumes: ['multipart/form-data'],
      produces: ['application/json'],
      staticCSP: true,
      transformStaticCSP: (header) => header,
      exposeRoute: true,
    },
  };
}
