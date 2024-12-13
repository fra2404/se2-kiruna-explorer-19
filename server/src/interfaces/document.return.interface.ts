import { ICoordinate } from '@interfaces/coordinate.interface';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import { IConnection } from './document.interface';
import { IReturnMedia } from './media.return.interface';
import { IStakeholder } from './stakeholder.interface';

export interface IDocumentResponse {
  id: string;
  title: string;
  stakeholders?: IStakeholder[] | null;
  scale?: ScaleTypeEnum;
  architecturalScale?: string;  //Added due to changing in scale
  type: DocTypeEnum;
  date: string;
  summary: string;
  connections?: IConnection[];
  language?: string;
  media?: IReturnMedia[] | null;
  coordinates?: ICoordinate | null;
}
