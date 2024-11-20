export interface ICoordinate extends Document {
  id: string;
  type: 'Point' | 'Area';
  coordinates: number[] | number[][];
  name: string;
}
