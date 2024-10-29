import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Route 
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column()
    cost: number;

    @Column()
    traffic: number;

    constructor(id: number, name: string, cost: number, traffic: number) 
    {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.traffic = traffic;
    }
}
