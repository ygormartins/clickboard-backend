import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';

type BoardDocument = Board & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_0, ret) => {
      delete ret._id;
      return ret;
    },
  },
})
class Board {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, index: true })
  slug?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'columns' }] })
  columns?: Types.ObjectId[];

  @Prop({ type: String })
  description?: string;
}

const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.index({
  name: 'text',
});

BoardSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export { Board, BoardDocument, BoardSchema };
