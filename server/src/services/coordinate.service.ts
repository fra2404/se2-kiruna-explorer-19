import { Coordinate } from '../schemas/coordinate.schema';
import { ICoordinate } from '../interfaces/coordinate.interface';
import { CustomError } from '../utils/customError';
import { PositionError } from '../utils/errors';
import Document from '../schemas/document.schema';
import { ObjectId } from 'mongoose';

// Function to get a coordinate by its ID
export const getCoordinateById = async (
  id: string,
): Promise<ICoordinate | null> => {
  try {
    const coordinate = await Coordinate.findById(id);
    if (!coordinate) {
      return null;
    }
    return coordinate.toObject() as ICoordinate;
  } catch (error) {
    throw new CustomError('Internal Server Error', 500);
  }
};

export const addCoordinateService = async (
  coordinateData: ICoordinate,
): Promise<ICoordinate> => {
  try {
    const newCoordinate = new Coordinate(coordinateData);
    await newCoordinate.save();
    return newCoordinate.toObject() as ICoordinate;
  } catch (error) {
    throw new CustomError('Internal Server Error', 500);
  }
};

export const getAllCoordinates = async (): Promise<ICoordinate[]> => {
  try {
    const coordinates = await Coordinate.find();
    return coordinates.map(
      (coordinate) => coordinate.toObject() as ICoordinate,
    );
  } catch (error) {
    throw new PositionError();
  }
};

/* istanbul ignore next */
export const deleteCoordinatesByNames = async (
  names: string[],
): Promise<void> => {
  try {
    await Coordinate.deleteMany({ name: { $in: names } });
  } catch (error) {
    throw new CustomError('Internal Server Error', 500);
  }
};

export const deleteCoordinateById = async (id: string): Promise<boolean> => {

  const coordinate = await Coordinate.findById(id);

  if (!coordinate) {
    throw new PositionError();
  }

  // Check if the coordinate is linked to any document
  const document = await Document.findOne({ coordinates: coordinate._id });

  if (document) {
    throw new CustomError('Coordinate is linked to a document', 400);
  }

  await Coordinate.deleteOne({ _id: coordinate._id });

  return true;
};



export const checkCoordinateExistence = async (
  coordinateId: ObjectId | null
): Promise<void> => {
  if (coordinateId) {
    const existingCoordinate = await Coordinate.findById(coordinateId);
    if (!existingCoordinate) {
      throw new PositionError();
    }
  }
};

