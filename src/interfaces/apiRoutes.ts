import { Router } from 'express';
import { UserController } from '../infrastructure/controllers/UserController';
import { RouteController } from '../infrastructure/controllers/RouteController';
import UserService from '../application/services/UserService';
import { RouteService } from '../application/services/RouteService';
import { RouteRepository } from '../infrastructure/repositories/RouteRepository';
import UserRepository from '../infrastructure/repositories/UserRepository';

const router = Router();

// User routes
router.get('/users', async (req, res) => 
{
    try 
    {
        await new UserController(new UserService()).getAllUsers(req, res);
    } 
    catch (error) 
    {
        console.error('Error in user route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/:id', async (req, res) => 
{
    try 
    {
        await new UserController(new UserService()).getUserById(req, res);
    } 
    catch (error) 
    {
        console.error('Error in user route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route routes
router.get('/routes', async (req, res) => 
{
    try 
    {
        await new RouteController(new RouteService(new RouteRepository(), new UserRepository())).getAllRoutes(req, res);
    } 
    catch (error) 
    {
        console.error('Error in route route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/routes/best', async (req, res) => 
{
    try 
    {
        await new RouteController(new RouteService(new RouteRepository(), new UserRepository())).getBestRoute(req, res);
    } 
    catch (error) 
    {
        console.error('Error in best route:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
