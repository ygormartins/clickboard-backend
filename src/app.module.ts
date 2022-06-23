import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { ColumnsModule } from './columns/columns.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [ConfigModule, DatabaseModule, BoardsModule, ColumnsModule, TicketsModule],
})
export class AppModule {}
