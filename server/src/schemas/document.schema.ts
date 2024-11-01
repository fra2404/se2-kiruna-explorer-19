import { IDocument, IConnection } from '@interfaces/document.interface';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { LinkTypeEnum } from '@utils/enums/link-type.enum';
import mongoose, { Document, Schema } from 'mongoose';

export type DocumentDocument = IDocument & Document;

const connectionSchema = new Schema<IConnection>({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
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
});

const documentSchema = new Schema<DocumentDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        stakeholders: {
            type: String,
            required: true,
        },
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
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

documentSchema.index({ title: 1 });

export default mongoose.model<DocumentDocument>('Document', documentSchema);