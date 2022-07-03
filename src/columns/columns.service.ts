import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board } from 'src/boards/boards.schema';
import { BoardsService } from 'src/boards/boards.service';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { Ticket } from 'src/tickets/tickets.schema';
import { TicketsService } from 'src/tickets/tickets.service';
import { Column, ColumnDocument } from './columns.schema';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name)
    private columnModel: Model<ColumnDocument>,
    @Inject(forwardRef(() => BoardsService))
    private boardsService: BoardsService,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  async getColumns(query: PaginationDTO): Promise<ColumnDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.columnModel
      .find(filter, project)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getColumn(columnId: string): Promise<ColumnDocument> {
    return this.columnModel
      .findById(columnId)
      .populate('board', '', Board.name)
      .populate('tickets', '', Ticket.name);
  }

  async getColumnsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.columnModel.count(filter);
  }

  async addTicketToColumn(
    columnId: string,
    ticketId: Types.ObjectId,
  ): Promise<ColumnDocument> {
    const column = await this.columnModel.findById(columnId);

    column.tickets.push(ticketId);

    return column.save();
  }

  async removeTicketFromColumn(
    columnId: Types.ObjectId,
    ticketId: Types.ObjectId,
  ): Promise<ColumnDocument> {
    const column = await this.columnModel.findById(columnId);

    column.tickets = column.tickets.filter(
      (ticket) => String(ticket) != String(ticketId),
    );

    return column.save();
  }

  async createColumn(createColumnDto: CreateColumnDto): Promise<any> {
    const newColumn = await this.columnModel.create(createColumnDto);

    await this.boardsService.addColumnToBoard(
      createColumnDto.board,
      newColumn._id,
    );

    return newColumn;
  }

  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<any> {
    return this.columnModel.updateOne({ _id: columnId }, updateColumnDto);
  }

  async deleteColumn(columnId: string): Promise<any> {
    const column = await this.columnModel.findById(columnId);

    if (!column) throw new NotFoundException("Column doesn't exist");

    const ticketsList = [...(column?.tickets || [])];

    ticketsList.forEach((ticket) => {
      this.ticketsService.deleteTicket(String(ticket));
    });

    const board = await this.boardsService.getBoard(String(column.board));

    if (board) this.boardsService.removeColumFromBoard(board._id, column._id);

    return column.deleteOne();
  }
}
