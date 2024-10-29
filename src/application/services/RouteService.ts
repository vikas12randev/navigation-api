import { RouteRepository } from "../../infrastructure/repositories/RouteRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { Route } from "../../domain/models/Route";
import { User } from "../../domain/models/User";

export class RouteService 
{
    private routeRepository: RouteRepository;
    private userRepository: UserRepository;

    constructor(routeRepository: RouteRepository, userRepository: UserRepository) 
    {
        this.routeRepository = routeRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieve all available routes from the repository.
     * @returns A promise that resolves to an array of Route instances.
     */
    public async findAllRoutes(): Promise<Route[]> 
    {
        try 
        {
            return await this.routeRepository.findAll();
        } 
        catch (error) 
        {
            console.error("Error fetching all routes:", error);
            throw new Error("Could not retrieve routes.");
        }
    }

    /**
     * Get the best route for a user, based on their cost limit and allowed routes.
     * @param userId - The ID of the user to find a route for.
     * @returns A promise that resolves to the best available Route, or null if none are found.
     */
    public async getBestRoute(userId: number): Promise<Route | null> 
    {
        try 
        {
            const user = await this.userRepository.getUserById(userId);
    
            if (!user) 
            {
                console.warn(`User with ID ${userId} not found.`);
                return null;
            }
    
            const routes = await this.routeRepository.findAll();
    
            // Convert user.allowedRoutes to numbers (if it's retrieved as strings)
            const allowedRouteIds = user.allowedRoutes.map(id => Number(id));
    
            // Filter routes based on user's cost limit and allowed routes
            const affordableRoutes = routes.filter(
                route => route.cost <= user.costLimit && allowedRouteIds.includes(route.id)
            );
    
            // Return null if no affordable routes exist
            if (affordableRoutes.length === 0) return null;
    
            // Find the route with the lowest cost
            const bestRoute = affordableRoutes.reduce((prev, curr) => 
                (prev.cost < curr.cost ? prev : curr)
            );
    
            return bestRoute;
        } 
        catch (error) 
        {
            console.error("Error fetching best route:", error);
            throw new Error("Could not determine the best route.");
        }
    }    
}
