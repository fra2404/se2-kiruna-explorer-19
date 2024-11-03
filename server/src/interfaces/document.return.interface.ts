import { ICoordinate } from '@interfaces/coordinate.interface';
import { DocTypeEnum } from "@utils/enums/doc-type.enum";
import { LinkTypeEnum } from "@utils/enums/link-type.enum";
import { IConnection } from './document.interface';
import { ObjectId } from "mongoose"


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
