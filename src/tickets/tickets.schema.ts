import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/users.schema';

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

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'users' }] })
  assignedTo?: Types.ObjectId[];

  @Prop({ type: String })
  description?: string;
}

const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.pre('find', function (next) {
  this.populate('assignedTo', '', User.name);
  next();
});

export { Ticket, TicketDocument, TicketSchema };
