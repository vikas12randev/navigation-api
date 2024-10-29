import { DataSource } from 'typeorm';
import { User } from './domain/models/User'; 
import { Route } from './domain/models/Route'; 

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:', 
    synchronize: true, 
    entities: [User, Route], 
});

export default AppDataSource;
