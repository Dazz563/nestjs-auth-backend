import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from 'src/auth/user.entitiy';

@Controller('reset-password')
export class ResetPasswordController {

    constructor(
        private resetPasswordService: ResetPasswordService,
        private mailerService: MailerService,
        private authService: AuthService,
    ) { }

    @Post('/forgot-password')
    async forgotPassword(@Body('email') email: string) {
        let result = await this.resetPasswordService.create(email);

        const url = `http://localhost:4200/reset-password/${result.token}`;

        await this.mailerService.sendMail({
            to: result.email,
            subject: 'reset your password',
            html: `Click <a href="${url}">here</a> to reset your password`
        })

        return {
            message: 'check your email',
        }
    }

    @Post()
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto,): Promise<Object> {

        await this.resetPasswordService.resetPassword(resetPasswordDto);

        return {
            message: 'success',
        }
    }
}
