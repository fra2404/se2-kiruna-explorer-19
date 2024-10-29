
export interface ICoordinate extends Document {
    type: 'Point' | 'Area';
    coordinates: number[] | number[][];
    name: string;
}