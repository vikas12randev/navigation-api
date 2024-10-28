import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User 
{
    @PrimaryGeneratedColumn()
    // Auto-generated primary key
    id!: number; 

    @Column()
    // User's name
    name!: string; 

    // `simple-array` used for route IDs; change to `json` for databases that support it
    @Column("simple-array")
    allowedRoutes!: number[]; // Array of allowed route IDs

    // User's cost limit
    @Column()
    costLimit!: number; 

    // Constructor to initialize properties (without ID)
    constructor(id: number, name: string, allowedRoutes: number[], costLimit: number) 
    {
        this.id = id,
        this.name = name;
        this.allowedRoutes = allowedRoutes;
        this.costLimit = costLimit;
    }
}
