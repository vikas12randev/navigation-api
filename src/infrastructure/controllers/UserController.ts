import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';

export class UserController 
{
    private userService: UserService;

    constructor(userService: UserService) 
    {
        this.userService = userService;
    }

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retrieve a list of users
     *     responses:
     *       200:
     *         description: A list of users
     */
    public async getAllUsers(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            // Assume this is an async method
            const users = await this.userService.getAllUsers(); 
            res.json(users);
        } 
        catch (error) 
        {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retrieve a user by ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to retrieve
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A user object
     *       404:
     *         description: User not found
     */
    public async getUserById(req: Request, res: Response): Promise<void> 
    {
        const userId = parseInt(req.params.id, 10);
        
        try 
        {
            // Assume this is an async method
            const user = await this.userService.getUserById(userId); 
            
            if (user) 
            {
                res.json(user);
            } 
            else 
            {
                res.status(404).send('User not found');
            }
        } 
        catch (error) 
        {
            console.error(`Error fetching user with ID ${userId}:`, error);
            res.status(500).send('Internal Server Error');
        }
    }
}

// Default export
// Ensure you have a default export here
export default UserController; 
