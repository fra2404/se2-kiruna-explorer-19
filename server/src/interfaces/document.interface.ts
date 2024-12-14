import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { LinkTypeEnum } from '@utils/enums/link-type.enum';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import { ObjectId } from 'mongoose';

export interface IConnection {
  _id?: ObjectId;
  document: ObjectId;
  type: LinkTypeEnum;
}

export interface IDocumentFilters {
  stakeholders?: string[];
  scale?: ScaleTypeEnum;
  architecturalScale?: string; //Added due to changing in scale
  type?: string;
  date?: string;
  language?: string;
  coordinates?: string; 
}

export interface IDocument {
  title: string;
  stakeholders: ObjectId[];
  scale: ScaleTypeEnum;
  architecturalScale?: string;  //Added due to changing in scale
  type: ObjectId;
  date: string;
  connections?: IConnection[];
  language?: string;
  media?: ObjectId[];
  coordinates?: ObjectId;
  summary: string;

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
