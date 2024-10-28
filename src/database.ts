import "reflect-metadata"; 
import { DataSource } from 'typeorm';
import { User } from './domain/models/User';
import { Route } from './domain/models/Route';

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'mydb.sqlite',
    synchronize: true, 
    entities: [User, Route], 
});

/**
 * Initialize the database connection.
 * @returns A promise that resolves when the connection is established.
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log("Database connection established.");
    } catch (error) {
        console.error("Error establishing database connection:", error);
        throw new Error("Could not establish database connection.");
    }
};

export default AppDataSource; 
