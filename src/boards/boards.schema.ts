import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';

type BoardDocument = Board & Document;

@Schema({ timestamps: true })
class Board {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'columns' }] })
  columns?: Types.ObjectId[];

  @Prop({ type: String })
  description?: string;
}

const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.index({
  name: 'text',
});

export { Board, BoardDocument, BoardSchema };
