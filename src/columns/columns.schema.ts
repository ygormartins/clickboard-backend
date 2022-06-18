import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';

type ColumnDocument = Column & Document;

@Schema({ timestamps: true })
class Column {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'boards',
    required: true,
  })
  board: Types.ObjectId;

  @Prop({ type: String })
  color?: string;
}

const ColumnSchema = SchemaFactory.createForClass(Column);

export { Column, ColumnDocument, ColumnSchema };
