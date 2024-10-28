import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { UserController } from './infrastructure/controllers/UserController';
import routeRoutes from './infrastructure/routes/routeRoutes'; 
import userRoutes from './infrastructure/routes/userRoutes';
import { initializeDatabase } from './database'; 
import cors from 'cors';
import UserRepository from './infrastructure/repositories/UserRepository';
import { RouteRepository } from './infrastructure/repositories/RouteRepository';
import { errorHandler } from './application/errorHandler';

const app = express();
const PORT = process.env.PORT || 5002;

// Swagger documentation setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Navigation API',
        version: '1.0.0',
        description: 'API documentation',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: 'Navigation API server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/infrastructure/controllers/*.ts'], 
};


const swaggerSpec = swaggerJSDoc(options);

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5002' }));
app.use(express.json()); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize the database connection
initializeDatabase()
    .then(async () => {
        const userRepository = new UserRepository();
        await userRepository.seedDatabase(); 
        
        // Define your routes after the database is initialized
        app.use('/users', userRoutes);
        app.use('/routes', routeRoutes);
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process with failure
    });

// Error handling middleware
app.use(errorHandler);

// Default export
export default app;
