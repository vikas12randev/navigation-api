import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../domain/models/User';
import db from '../../database';

jest.mock('../../infrastructure/repositories/UserRepository'); 

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(async () => {
        await db.connect(); 
    });

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService();
        // Assign the mocked repository
        userService['userRepository'] = userRepository;
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    afterAll(async () => {
        await db.close(); 
    });

    test('should return user by ID', async () => {
        const mockUser = new User(1, 'Alice', [1, 2, 3], 4);
        userRepository.getUserById = jest.fn().mockResolvedValue(mockUser); 

        const user = await userService.getUserById(1);
        expect(user).toEqual(mockUser);
        expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });

    test('should return all users', async () => {
        const mockUsers = [
            new User(1, 'Alice', [1, 2, 3], 5),
            new User(2, 'Bob', [2, 3, 4], 4),
        ];
        userRepository.getAllUsers = jest.fn().mockResolvedValue(mockUsers); 

        const users = await userService.getAllUsers();
        expect(users).toEqual(mockUsers);
        expect(userRepository.getAllUsers).toHaveBeenCalled();
    });
});
