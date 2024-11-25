import { IDocument, IConnection } from '@interfaces/document.interface';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { StakeholderEnum } from '@utils/enums/stakeholder.enum';
import { LinkTypeEnum } from '@utils/enums/link-type.enum';
import mongoose, { Document, Schema } from 'mongoose';
import { isMapIterator } from 'util/types';

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
      type: String,
      required: true,
      enum: StakeholderEnum,
    },
  ],
    scale: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: DocTypeEnum,
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

documentSchema.index({ title: 1 });
documentSchema.index({ summary: 1 });
documentSchema.index({ title: 1, summary: 1 });

export default mongoose.model<DocumentDocument>('Document', documentSchema);
