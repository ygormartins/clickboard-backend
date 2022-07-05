import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nanoid = require('nanoid-esm');

type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({ type: String })
  spaceId?: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ type: String })
  refreshToken?: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  this.spaceId = nanoid();

  next();
});

export { User, UserDocument, UserSchema };
