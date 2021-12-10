import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {


    @IsNotEmpty()
    password: string;


    @IsNotEmpty()
    password_confirm: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}