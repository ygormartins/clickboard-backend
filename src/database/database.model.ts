import { Document, Model } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';

export type DatabaseModel<T> = Model<T> &
  MongooseDelete.SoftDeleteModel<T & Document>;
