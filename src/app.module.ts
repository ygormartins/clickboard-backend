import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { ColumnsModule } from './columns/columns.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    BoardsModule,
    ColumnsModule,
    TicketsModule,
  ],
})
export class AppModule {}
