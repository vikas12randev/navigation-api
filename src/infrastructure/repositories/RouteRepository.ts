import { Route } from '../../domain/models/Route';
import AppDataSource from '../../database';

export class RouteRepository 
{
    /**
     * Retrieve all routes from the database.
     * @returns An array of routes.
     */
    public async findAll(): Promise<Route[]> 
    {
        const routeRepository = AppDataSource.getRepository(Route);
        return await routeRepository.find();
    }

    /**
     * Find a route by its ID.
     * @param routeId - The ID of the route to retrieve.
     * @returns The route object or null if not found.
     */
    public async findById(routeId: number): Promise<Route | null> 
    {
        const routeRepository = AppDataSource.getRepository(Route);
        return await routeRepository.findOneBy({ id: routeId });
    }
}
