import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ResetPassword {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    token: string;
}