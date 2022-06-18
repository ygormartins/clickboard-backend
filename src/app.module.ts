import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { ColumnsModule } from './columns/columns.module';

@Module({
  imports: [ConfigModule, DatabaseModule, BoardsModule, ColumnsModule],
})
export class AppModule {}
