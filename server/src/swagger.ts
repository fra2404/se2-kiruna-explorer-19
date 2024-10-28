import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation - KIRUNA Explorer',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Percorsi ai file contenenti le annotazioni Swagger
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};