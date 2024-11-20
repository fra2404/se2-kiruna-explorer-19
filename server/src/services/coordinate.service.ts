import { Coordinate } from '../schemas/coordinate.schema';
import { ICoordinate } from '../interfaces/coordinate.interface';
import { CustomError } from '../utils/customError';
import { PositionError } from '../utils/errors';
import Document from '../schemas/document.schema';



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
    //console.error(`Error fetching coordinate with ID ${id}:`, error);
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
    //console.error('Error adding coordinate:', error);
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
    //console.error('Error fetching all coordinates:', error);
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
    //console.error(`Error deleting coordinates with names ${names}:`, error);
    throw new CustomError('Internal Server Error', 500);
  }
};


export const deleteCoordinateById = async (id: string): Promise<boolean> => {
  //console.log("Start of delete method");

  const coordinate = await Coordinate.findById(id);

  if (!coordinate) {
    throw new PositionError();
  }

  //console.log("Coordinate exists. Checking if it's linked to a document");
  // Check if the coordinate is linked to any document
  const document = await Document.findOne({ coordinates: coordinate._id });

  if (document) {
    //console.log("Coordinate is linked to a document");
    throw new CustomError('Coordinate is linked to a document', 400);
  }

  //console.log("Coordinate is not linked to any document");
  await Coordinate.deleteOne({ _id: coordinate._id });

  return true;
};