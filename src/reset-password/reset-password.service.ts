import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPassword } from './reset-password.entity';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/user.entitiy';

@Injectable()
export class ResetPasswordService {

    constructor(
        @InjectRepository(ResetPassword)
        private repo: Repository<ResetPassword>,
        private authService: AuthService,

    ) { }

    async create(email: string): Promise<ResetPassword> {

        let token = uuidv4();
        const newReset = this.repo.create({ email, token: token });

        return await this.repo.save(newReset);
    }

    async findOne(condition): Promise<ResetPassword> {
        return await this.repo.findOne(condition);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
        let { token, password, password_confirm } = resetPasswordDto;

        if (password !== password_confirm) {
            throw new BadRequestException('passwords do not match');
        }

        const reset = await this.findOne({ token: token });

        const email = reset.email;

        const user = await this.authService.findOneBy({ email: email });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        return await this.authService.updateUser(user.id, { password: hashedPassword });

    }
}
