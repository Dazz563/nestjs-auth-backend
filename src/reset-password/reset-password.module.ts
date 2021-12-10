import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPassword } from './reset-password.entity';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPassword]),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025
      },
      defaults: {
        from: 'no-reply@localhost.com'
      }
    }),
    AuthModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule { }
