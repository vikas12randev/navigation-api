import { Request, Response } from 'express';
import UserController from '../../infrastructure/controllers/UserController';
import { UserService } from '../../application/services/UserService';
import { User } from '../../domain/models/User';
import db from '../../database'; 

jest.mock('../../application/services/UserService');

describe('UserController', () => {
    let userService: jest.Mocked<UserService>;
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeAll(async () => {
        await db.connect(); 
    });

    beforeEach(() => {
        userService = new UserService() as jest.Mocked<UserService>;
        userController = new UserController(userService);
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    afterAll(async () => {
        await db.close(); 
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers: User[] = [
                new User(1, 'Alice', [1, 2], 6),
                new User(2, 'Bob', [2, 3], 5),
            ];

            userService.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(req as Request, res as Response);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle errors and respond with 500', async () => {
            userService.getAllUsers.mockRejectedValue(new Error('Service error'));

            await userController.getAllUsers(req as Request, res as Response);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    describe('getUserById', () => {
        it('should return a user when found', async () => {
            const userId = 1;
            req.params = { id: userId.toString() };
            const mockUser = new User(userId, 'Alice', [1, 2], 6);

            userService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(req as Request, res as Response);

            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 when user is not found', async () => {
            const userId = 2;
            req.params = { id: userId.toString() };

            userService.getUserById.mockResolvedValue(null);

            await userController.getUserById(req as Request, res as Response);

            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found');
        });

        it('should handle errors and respond with 500', async () => {
            const userId = 1;
            req.params = { id: userId.toString() };

            userService.getUserById.mockRejectedValue(new Error('Service error'));

            await userController.getUserById(req as Request, res as Response);

            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });
});
