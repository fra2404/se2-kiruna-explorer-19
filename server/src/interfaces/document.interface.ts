import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { StakeholderEnum } from '@utils/enums/stakeholder.enum';
import { LinkTypeEnum } from '@utils/enums/link-type.enum';
import { ObjectId } from 'mongoose';

export interface IConnection {
  _id?: ObjectId;
  document: ObjectId;
  type: LinkTypeEnum;
}

export interface IDocumentFilters {
  stakeholders?: StakeholderEnum;
  scale?: string;
  type?: DocTypeEnum;
  date?: string;
  language?: string;
}

export interface IDocument {
  title: string;
  stakeholders: StakeholderEnum;
  scale: string;
  type: DocTypeEnum;
  date: string;
  connections?: IConnection[];
  language?: string;
  media?: ObjectId[]; //changed By Mina
  coordinates?: ObjectId;
  summary: string;

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
