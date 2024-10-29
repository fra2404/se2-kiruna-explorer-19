import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import yaml from 'js-yaml';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation - KIRUNA Explorer',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth-token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Percorsi ai file contenenti le annotazioni Swagger
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  app.get('/api-docs/yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.send(yaml.dump(specs));
  });
};
