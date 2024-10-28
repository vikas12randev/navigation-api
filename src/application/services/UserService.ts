import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../domain/models/User';

export class UserService 
{
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) 
    {
        // Dependency injection to facilitate testing and make the service more modular
        this.userRepository = userRepository || new UserRepository();
    }

    /**
     * Retrieve a user by ID.
     * @param userId - The ID of the user to retrieve.
     * @returns A promise resolving to the User object or null if not found.
     */
    public async getUserById(userId: number): Promise<User | null> 
    {
        if (isNaN(userId) || userId <= 0) 
        {
            throw new Error('Invalid user ID');
        }

        const user = await this.userRepository.getUserById(userId);

        if (!user) 
        {
            console.warn(`User with ID ${userId} not found.`);
        }

        return user;
    }

    /**
     * Retrieve all users.
     * @returns A promise resolving to an array of User objects.
     */
    public async getAllUsers(): Promise<User[]> 
    {
        const users = await this.userRepository.getAllUsers();
        
        if (!users.length) 
        {
            console.warn('No users found in the database.');
        }

        return users;
    }
}

export default UserService;
