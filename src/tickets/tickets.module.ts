import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './tickets.schema';
import { ColumnsModule } from 'src/columns/columns.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    forwardRef(() => ColumnsModule),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
