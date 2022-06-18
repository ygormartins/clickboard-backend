import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule, BoardsModule],
})
export class AppModule {}
