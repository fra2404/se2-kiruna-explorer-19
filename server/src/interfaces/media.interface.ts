import { ObjectId } from "mongoose";

export interface IMedia {
    filename: string;
    relativeUrl: string;
    type: string;
    mimetype: string;
    size: number;
    pages?: number;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
