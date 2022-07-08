import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private dbService: DatabaseService) {}

  async getTickets(query: PaginationDTO): Promise<Ticket[]> {
    const { filter, sort, skip, limit } = buildPaginationQuery(query);

    return this.dbService.ticket.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: sort,
      include: { assignedTo: true, tags: true },
    });
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    return this.dbService.ticket.findUnique({
      where: { id: ticketId },
      include: { column: true, assignedTo: true, tags: true },
    });
  }

  async getTicketsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.dbService.ticket.count({ where: filter });
  }

  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.dbService.ticket.create({
      data: {
        ...createTicketDto,
        assignedTo: {
          connect: createTicketDto.assignedTo?.map((userId) => ({
            id: userId,
          })),
        },
        tags: {
          connect: createTicketDto.tags?.map((tagId) => ({
            id: tagId,
          })),
        },
      },
    });
  }

  async updateTicket(
    ticketId: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.dbService.ticket.update({
      data: {
        ...updateTicketDto,
        assignedTo: {
          connect: updateTicketDto.assignedTo?.map((userId) => ({
            id: userId,
          })),
        },
        tags: {
          connect: updateTicketDto.tags?.map((tagId) => ({
            id: tagId,
          })),
        },
      },
      where: { id: ticketId },
    });
  }

  async deleteTicket(ticketId: string): Promise<Ticket> {
    return this.dbService.ticket.delete({ where: { id: ticketId } });
  }
}
