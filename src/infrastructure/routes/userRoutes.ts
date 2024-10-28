import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import UserService from '../../application/services/UserService';

const userRoutes = express.Router();
const userController = new UserController(new UserService());

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

// Define routes and map them to controller methods
userRoutes.get('/', errorHandler(userController.getAllUsers.bind(userController))); 
userRoutes.get('/:id', errorHandler(userController.getUserById.bind(userController))); 

export default userRoutes;
