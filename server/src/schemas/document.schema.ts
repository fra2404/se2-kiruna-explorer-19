import { IDocument, IConnection } from '@interfaces/document.interface';
import { LinkTypeEnum } from '@utils/enums/link-type.enum';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import mongoose, { Document, Schema } from 'mongoose';

export type DocumentDocument = IDocument & Document;

const connectionSchema = new Schema<IConnection>(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    type: {
      type: String,
      enum: LinkTypeEnum,
      required: true,
    },
  },
  { _id: false },
);

const documentSchema = new Schema<DocumentDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    stakeholders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder',
        required: true,
      },
    ],
    scale: {
      type: String,
      required: true,
      enum: ScaleTypeEnum
    },
    architecturalScale: {
      type: String,  // 1:number format
      required: function () { return this.scale === 'ARCHITECTURAL'; }, // Only if scale is 'Architectural'
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Documenttype',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    connections: [connectionSchema],
    language: {
      type: String,
      required: false,
    },
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Media',
        required: false,
      },
    ],
    coordinates: {
      type: Schema.Types.ObjectId,
      ref: 'Coordinate',
      required: false,
    },
    summary: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);


export default mongoose.model<DocumentDocument>('Document', documentSchema);
