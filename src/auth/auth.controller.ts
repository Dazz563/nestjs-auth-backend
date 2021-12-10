import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { get } from 'http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entitiy';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) { }

    @Get('/user')
    @UseInterceptors(AuthInterceptor)
    async whoAmI(@Req() request: Request) {
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        return await this.authService.findOneBy({ id: data['id'] });
    }

    @Post('/register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Post('/login')
    async login(
        @Body('email') email: string,
        @Body('password') passowrd: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<User> {
        const user = await this.authService.login(email, passowrd);
        const jwt = await this.jwtService.signAsync({
            id: user.id,
        });

        response.cookie('jwt', jwt, { httpOnly: true });

        return user;
    }

    @Post('/logout')
    @UseInterceptors(AuthInterceptor)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'success',
        }
    }
}
