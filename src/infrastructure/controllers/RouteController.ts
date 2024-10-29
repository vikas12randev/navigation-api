import { Request, Response } from 'express';
import { RouteService } from '../../application/services/RouteService';

export class RouteController 
{
    private routeService: RouteService;

    constructor(routeService: RouteService) {
        this.routeService = routeService; 
    }

    /**
     * @swagger
     * /routes:
     *   get:
     *     summary: Retrieve all available routes
     *     responses:
     *       200:
     *         description: A list of all routes
     *       500:
     *         description: Server error
     */
    public async getAllRoutes(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const routes = await this.routeService.findAllRoutes();
            res.json(routes);
        } 
        catch (error) 
        {
            console.error("Error fetching routes:", error);
            res.status(500).send('Server error');
        }
    }

    /**
     * @swagger
     * /routes/best:
     *   get:
     *     summary: Get the best route for the user based on their ID
     *     parameters:
     *       - name: userId
     *         in: query
     *         required: true
     *         description: The ID of the user to find the best route for
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: The best route for the user
     *       404:
     *         description: User not found or best route not found
     *       500:
     *         description: Server error
     */
    public async getBestRoute(req: Request, res: Response): Promise<void> 
    {
        // Use `parseInt` to convert the userId to an integer
        const userId = parseInt(req.query.userId as string, 10);

        // Check if userId is a valid number
        if (isNaN(userId)) 
        {
            // Return a bad request response
            res.status(400).send('Invalid user ID');
            return;
        }

        // Fetch the best route using the user ID
        const bestRoute = await this.routeService.getBestRoute(userId); 

        if (bestRoute) 
        {
            res.json(bestRoute);
        } 
        else 
        {
            res.status(404).send('User not found or best route not found');
        }
    }
}
