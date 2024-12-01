import { ICoordinate } from '@interfaces/coordinate.interface';
import mongoose, { Schema, Document } from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type',
  collection: 'coordinates',
};

const coordinateSchema = new Schema<ICoordinate>(
  {
    type: {
      type: String,
      required: true,
      enum: ['Point', 'Area'],
    },
    coordinates: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  baseOptions,
);

const Coordinate = mongoose.model<ICoordinate>('Coordinate', coordinateSchema);

const pointSchema = new Schema({
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});

const polygonSchema = new Schema({
  coordinates: {
    type: [[Number]], //  [[longitude, latitude], ...]
    required: true,
  },
});

const Point = Coordinate.discriminator('Point', pointSchema);
const Polygon = Coordinate.discriminator('Polygon', polygonSchema);

export { Coordinate, Point, Polygon };
