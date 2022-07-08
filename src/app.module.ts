import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TicketsModule } from './tickets/tickets.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    RedisModule,
    BoardsModule,
    ColumnsModule,
    TicketsModule,
  ],
})
export class AppModule {}
