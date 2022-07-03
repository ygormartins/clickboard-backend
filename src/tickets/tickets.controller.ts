import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { paginated } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Query() query: PaginationDTO) {
    return paginated(
      query,
      (args: PaginationDTO) => this.ticketsService.getTickets(args),
      (args: PaginationDTO) => this.ticketsService.getTicketsCount(args),
    );
  }

  @Get(':id')
  findOne(@Param('id') ticketId: string) {
    return this.ticketsService.getTicket(ticketId);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  @Put(':id')
  update(
    @Param('id') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(ticketId, updateTicketDto);
  }

  @Delete(':id')
  delete(@Param('id') ticketId: string) {
    return this.ticketsService.deleteTicket(ticketId);
  }
}
