import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    public readonly id:number;

    @Column()
    public name:string;

    @Column()
    public price:number;

    @Column()
    public author:string;

    @Column()
    public avatar:string;
}