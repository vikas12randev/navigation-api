import { RouteService } from '../../application/services/RouteService';
import { RouteRepository } from '../../infrastructure/repositories/RouteRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { Route } from '../../domain/models/Route';
import { User } from '../../domain/models/User';
import db from '../../database'; 

jest.mock('../../infrastructure/repositories/RouteRepository');
jest.mock('../../infrastructure/repositories/UserRepository');

describe('RouteService', () => {
    let routeService: RouteService;
    let routeRepository: jest.Mocked<RouteRepository>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(async () => {
        await db.connect(); 
    });

    beforeEach(() => {
        // Create mocked instances of the repositories
        routeRepository = new RouteRepository() as jest.Mocked<RouteRepository>;
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;

        // Pass the mocked repositories to the RouteService
        routeService = new RouteService(routeRepository, userRepository);
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    afterAll(async () => {
        await db.close(); 
    });

    test('should return all routes', async () => {
        const mockRoutes = [
            new Route(1, 'Route A', 5, 30),
            new Route(2, 'Route B', 3, 10),
        ];

        routeRepository.findAll.mockResolvedValue(mockRoutes); 

        const routes = await routeService.findAllRoutes();
        expect(routes).toEqual(mockRoutes);
        expect(routeRepository.findAll).toHaveBeenCalled(); 
    });

    test('should return best route for a valid user', async () => {
        const mockRoutes = [
            new Route(1, 'Route A', 5, 10), 
            new Route(2, 'Route B', 3, 20), 
        ];
        const user = new User(1, 'Alice', [1, 2], 6); 

        userRepository.getUserById.mockResolvedValue(user);
        routeRepository.findAll.mockResolvedValue(mockRoutes);

        const bestRoute = await routeService.getBestRoute(user.id);

        expect(bestRoute).toEqual(mockRoutes[1]);
        expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
        expect(routeRepository.findAll).toHaveBeenCalled();
    });

    test('should return null for a user that does not exist', async () => {
        const userId = 999; 

        userRepository.getUserById.mockResolvedValue(null); 

        const bestRoute = await routeService.getBestRoute(userId);
        expect(bestRoute).toBeNull(); 
        expect(userRepository.getUserById).toHaveBeenCalledWith(userId); 
    });

    test('should return null for a user with no affordable routes', async () => {
        const mockRoutes = [
            new Route(1, 'Route A', 10, 30), 
        ];
        const user = new User(1, 'Alice', [1], 5); 

        userRepository.getUserById.mockResolvedValue(user); 
        routeRepository.findAll.mockResolvedValue(mockRoutes); 

        const bestRoute = await routeService.getBestRoute(user.id);
        expect(bestRoute).toBeNull(); 
        expect(userRepository.getUserById).toHaveBeenCalledWith(user.id); 
    });
});
