// src/infrastructure/routes/routeRoutes.ts
import { Router, Request, Response } from 'express';
import { RouteController } from '../controllers/RouteController';
import { RouteService } from '../../application/services/RouteService';
import { RouteRepository } from '../repositories/RouteRepository';
import UserRepository from '../repositories/UserRepository';

const router = Router();
const routeController = new RouteController(new RouteService(new RouteRepository(), new UserRepository()));

// Middleware for error handling
const errorHandler = (controllerMethod: (req: Request, res: Response) => Promise<void>) => 
{
    return async (req: Request, res: Response): Promise<void> => 
    {
        try 
        {
            await controllerMethod(req, res);
        } 
        catch (error) 
        {
            console.error('Error handling request:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};

// Define the routes
router.get('/', errorHandler(routeController.getAllRoutes.bind(routeController))); 
router.get('/best', errorHandler(routeController.getBestRoute.bind(routeController))); 

export default router; // Export the router
