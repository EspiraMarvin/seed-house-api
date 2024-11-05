import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SeedsModule } from './seeds/seeds.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { SmsModule } from './sms/sms.module';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    PrismaModule,
    UsersModule,
    SeedsModule,
    AuthModule,
    OrderModule,
    TransactionModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
