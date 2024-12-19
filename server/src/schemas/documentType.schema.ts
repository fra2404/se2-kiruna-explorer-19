import { IDocumentType } from '@interfaces/documentType.interface';
import mongoose, { Schema } from 'mongoose';

export type DocumentType = IDocumentType & Document;

const documentTypeSchema = new Schema<DocumentType>(
  {
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<DocumentType>('documentType', documentTypeSchema);
