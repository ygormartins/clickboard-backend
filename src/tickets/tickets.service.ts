import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from 'src/columns/columns.schema';
import { ColumnsService } from 'src/columns/columns.service';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './tickets.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
    @Inject(forwardRef(() => ColumnsService))
    private columnsService: ColumnsService,
  ) {}

  async getTickets(query: PaginationDTO): Promise<TicketDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.ticketModel
      .find(filter, project)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getTicket(ticketId: string): Promise<TicketDocument> {
    return this.ticketModel
      .findById(ticketId)
      .populate('column', '', Column.name);
  }

  async getTicketsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.ticketModel.count(filter);
  }

  async createTicket(createTicketDto: CreateTicketDto): Promise<any> {
    const newTicket = await this.ticketModel.create(createTicketDto);

    await this.columnsService.addTicketToColumn(
      createTicketDto.column,
      newTicket._id,
    );

    return newTicket;
  }

  async updateTicket(
    ticketId: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<any> {
    return this.ticketModel.updateOne({ _id: ticketId }, updateTicketDto);
  }

  async deleteTicket(ticketId: string): Promise<any> {
    const ticket = await this.ticketModel.findById(ticketId);

    if (!ticket) throw new NotFoundException("Ticket doesn't exist");

    const column = await this.columnsService.getColumn(String(ticket.column));

    if (column) {
      this.columnsService.removeTicketFromColumn(column._id, ticket._id);
    }

    return ticket.deleteOne();
  }
}
