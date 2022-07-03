import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';

type TicketDocument = Ticket & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      return ret;
    },
  },
})
class Ticket {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'columns',
    required: true,
  })
  column: Types.ObjectId;

  @Prop({ type: String })
  description?: string;
}

const TicketSchema = SchemaFactory.createForClass(Ticket);

export { Ticket, TicketDocument, TicketSchema };
