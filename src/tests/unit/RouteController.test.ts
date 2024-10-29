import { Request, Response } from 'express';
import { RouteController } from '../../infrastructure/controllers/RouteController';
import { RouteService } from '../../application/services/RouteService';
import db from '../../database'; 

describe('RouteController', () => {
    let routeController: RouteController;
    let mockRouteService: Partial<RouteService>;

    beforeAll(async () => {
        await db.connect();
    });

    beforeEach(() => {
        // Clear mocks and instantiate the controller before each test
        mockRouteService = {
            findAllRoutes: jest.fn(),
            getBestRoute: jest.fn(),
        };

        routeController = new RouteController(mockRouteService as RouteService);
    });

    afterEach(async () => {
        jest.clearAllMocks(); 
    });

    afterAll(async () => {
        await db.close(); 
    });

    describe('getAllRoutes', () => {
        it('should return all routes', async () => {
            const req = {} as Request; 
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(), 
            } as unknown as Response;

            // Mock the service method
            mockRouteService.findAllRoutes = jest.fn().mockResolvedValue([{ id: 1, name: 'Route A' }]);

            await routeController.getAllRoutes(req, res);

            expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Route A' }]);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const req = {} as Request; 
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(), 
            } as unknown as Response;

            // Mock the service method to throw an error
            mockRouteService.findAllRoutes = jest.fn().mockRejectedValue(new Error('Database error'));

            await routeController.getAllRoutes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server error'); 
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getBestRoute', () => {
        it('should return the best route for a valid user', async () => {
            const req = { query: { userId: '1' } } as unknown as Request; 
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(), 
            } as unknown as Response;

            mockRouteService.getBestRoute = jest.fn().mockResolvedValue({ id: 1, name: 'Best Route' });

            await routeController.getBestRoute(req, res);

            expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Best Route' });
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return a 404 if no route is found', async () => {
            const req = { query: { userId: '2' } } as unknown as Request;
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(), 
            } as unknown as Response;

            mockRouteService.getBestRoute = jest.fn().mockResolvedValue(null);

            await routeController.getBestRoute(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found or best route not found'); 
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should return 400 for invalid userId', async () => {
            const req = { query: { userId: 'invalid' } } as unknown as Request; 
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(), 
            } as unknown as Response;

            await routeController.getBestRoute(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid user ID'); 
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
