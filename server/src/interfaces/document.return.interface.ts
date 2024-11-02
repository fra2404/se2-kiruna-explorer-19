import { ICoordinate } from '@interfaces/coordinate.interface';
import { DocTypeEnum } from "@utils/enums/doc-type.enum";
import { LinkTypeEnum } from "@utils/enums/link-type.enum";
import { ObjectId } from "mongoose"

export interface IConnection {
    _id?: ObjectId;
    document: ObjectId;
    type: LinkTypeEnum;
}

export interface IDocumentResponse {
    id: string; 
    title: string; 
    stakeholders?: string; 
    scale?: string; 
    type: DocTypeEnum; 
    date: string;
    connections?: IConnection[]; 
    language?: string; 
    media?:  [ObjectId]; 
    coordinates?: ICoordinate | null; 
    summary: string; 
}
