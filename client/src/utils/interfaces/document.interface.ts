import { ObjectId } from 'mongoose';
import { IStakeholder } from './stakeholders.interface';
import { IDocumentType } from './documentTypes.interface';

export interface IDocument {
  id: string;
  title: string;
  stakeholders?: IStakeholder[];
  scale?: string;
  architecturalScale?: string;
  type: IDocumentType;
  date: string;
  summary: string;
  connections?: IConnection[];
  language?: string;
  media?: [
    {
      id: string;
      url: string;
      filename: string;
      type: string;
      mimetype: string;
      pages?: number;
    },
  ];
  coordinates?: ICoordinate | null;
}

interface IConnection {
  _id?: ObjectId;
  document: ObjectId;
  type: LinkTypeEnum;
}

export interface ICoordinate {
  id?: string;
  _id?: string;
  type: 'Point' | 'Polygon';
  coordinates: number[] | number[][];
  name: string;
}

enum LinkTypeEnum {
  Direct = 'DIRECT',
  Collateral = 'COLLATERAL',
  Projection = 'PROJECTION',
  Update = 'UPDATE',
}
