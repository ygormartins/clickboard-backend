import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { Column, ColumnSchema } from './columns.schema';
import { BoardsModule } from 'src/boards/boards.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
    forwardRef(() => TicketsModule),
    forwardRef(() => BoardsModule),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
