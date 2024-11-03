import { DocTypeEnum } from "@utils/enums/doc-type.enum";
import { LinkTypeEnum } from "@utils/enums/link-type.enum";
import { ObjectId } from "mongoose";

export interface IConnection {
    _id?: ObjectId;
    document: ObjectId;
    type: LinkTypeEnum;
}

export interface IDocument {
    title: string;
    stakeholders: string;
    scale: string;
    type: DocTypeEnum;
    date: string;
    connections?: IConnection[];
    language?: string;
    media?: [ObjectId];
    coordinates?: ObjectId;
    summary: string;
}