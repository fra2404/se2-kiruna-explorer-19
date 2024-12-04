export interface ICoordinate extends Document {
  id: string;
  type: 'Point' | 'Polygon';
  coordinates: number[] | number[][];
  name: string;
}
