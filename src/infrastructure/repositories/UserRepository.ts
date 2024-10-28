import { User } from '../../domain/models/User';
import { Route } from '../../domain/models/Route'; 
import AppDataSource from '../../database';

export class UserRepository 
{
    /**
     * Clears the users and routes from the database.
     */
    async clearDatabase() 
    {
        const userRepository = AppDataSource.getRepository(User);
        const routeRepository = AppDataSource.getRepository(Route);

        try 
        {
            // Clear existing users and routes before seeding
            await userRepository.clear(); 
            await routeRepository.clear(); 

            console.log('Database has been cleared.');
        } 
        catch (error) 
        {
            console.error('Error clearing the database:', error);
        }
    }

    /**
     * Seeds the database with sample routes and users.
     */
    async seedDatabase() 
    {
        await this.clearDatabase(); // Clear the database before seeding
        
        const userRepository = AppDataSource.getRepository(User);
        const routeRepository = AppDataSource.getRepository(Route);

        // Sample routes without IDs; the database will auto-generate them
        const sampleRoutes = [
            { name: 'Route A', cost: 5, traffic: 30 },
            { name: 'Route B', cost: 3, traffic: 10 },
            { name: 'Route C', cost: 7, traffic: 50 },
            { name: 'Route D', cost: 2, traffic: 20 },
            { name: 'Route E', cost: 4, traffic: 40 },
        ];

        try 
        {
            // Save sample routes to the database
            // Save and get the routes with IDs
            const savedRoutes = await routeRepository.save(sampleRoutes); 

            // Map the saved routes to their IDs
            // Get IDs of saved routes
            const routeIds = savedRoutes.map(route => route.id); 

            // Sample users with the retrieved route IDs
            const sampleUsers = [
                { name: 'User1', allowedRoutes: [routeIds[0], routeIds[1], routeIds[2]], costLimit: 5 }, 
                { name: 'User2', allowedRoutes: [routeIds[1], routeIds[2], routeIds[3]], costLimit: 4 }, 
                { name: 'User3', allowedRoutes: [routeIds[0], routeIds[3], routeIds[4]], costLimit: 6 }, 
                { name: 'User4', allowedRoutes: [routeIds[0], routeIds[1]], costLimit: 3 }, 
                { name: 'User5', allowedRoutes: [routeIds[2], routeIds[3], routeIds[4]], costLimit: 7 }, 
            ];

            // Save sample users to the database
            for (const userData of sampleUsers) 
            {
                const user = userRepository.create(userData);
                await userRepository.save(user);
            }

            console.log('Sample routes and users have been seeded.');
        } 
        catch (error) 
        {
            console.error('Error seeding database:', error);
        }
    }

    /**
     * Retrieves all users from the database.
     * @returns An array of users.
     */
    async getAllUsers() 
    {
        const userRepository = AppDataSource.getRepository(User);

        try 
        {
            return await userRepository.find();
        } 
        catch (error) 
        {
            console.error('Error retrieving all users:', error);
            throw new Error('Unable to retrieve users.');
        }
    }

    /**
     * Retrieves a user by their ID.
     * @param userId - The ID of the user to retrieve.
     * @returns The user object or null if not found.
     */
    async getUserById(userId: number) 
    {
        const userRepository = AppDataSource.getRepository(User);

        try 
        {
            return await userRepository.findOneBy({ id: userId });
        } 
        catch (error) 
        {
            console.error(`Error retrieving user with ID ${userId}:`, error);
            throw new Error(`Unable to retrieve user with ID ${userId}.`); 
        }
    }
}

export default UserRepository;
