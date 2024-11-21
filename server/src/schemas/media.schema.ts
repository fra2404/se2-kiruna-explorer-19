import { IMedia } from '@interfaces/media.interface';
import mongoose, { Schema } from 'mongoose';

export type MediaDocument = IMedia & Document;

const mediaSchema = new Schema<MediaDocument>(
  {
    filename: {
      type: String,
      required: true,
    },
    relativeUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

mediaSchema.index({ filename: 1 });
export default mongoose.model<MediaDocument>('Media', mediaSchema);
