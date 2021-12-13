import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entitiy';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }

    async createUser(createUserdto: CreateUserDto): Promise<User> {
        let { first_name, last_name, email, password, password_confirm } = createUserdto;

        try {
            if (password !== password_confirm) {
                throw new BadRequestException('passwords do not match');
            }

            const hashed = await bcrypt.hash(password, 12);

            const newUser: CreateUserDto = this.repo.create({
                first_name,
                last_name,
                email,
                password: hashed,
            })

            return await this.repo.save(newUser);
        }
        catch (error) {
            throw new BadRequestException('account with this email already exists');
        }

    }

    async findOneBy(condition: any): Promise<User> {
        return await this.repo.findOne(condition);
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.findOneBy({ email });

        if (!user) {
            throw new BadRequestException('email does not exist');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }


        return user;
    }

    async updateUser(id: number, attrs: Partial<CreateUserDto>): Promise<User> {
        const user = await this.findOneBy(id);

        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);

        return this.repo.save(user);
    }
}
