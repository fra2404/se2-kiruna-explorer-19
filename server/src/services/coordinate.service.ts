import { Coordinate } from '../schemas/coordinate.schema';
import { ICoordinate } from '../interfaces/coordinate.interface';
import { CustomError } from '../utils/customError';
import { PositionError } from '../utils/errors';

// Function to get a coordinate by its ID
export const getCoordinateById = async (id: string): Promise<ICoordinate | null> => {
    try {
        const coordinate = await Coordinate.findById(id);
        if (!coordinate) {
            return null;
        }
        return coordinate.toObject() as ICoordinate;
    } catch (error) {
        console.error(`Error fetching coordinate with ID ${id}:`, error);
        throw new CustomError('Internal Server Error', 500);
    }
};

export const addCoordinateService = async (coordinateData: ICoordinate): Promise<ICoordinate> => {
    try {
        const newCoordinate = new Coordinate(coordinateData);
        await newCoordinate.save();
        return newCoordinate.toObject() as ICoordinate;
    } catch (error) {
        console.error('Error adding coordinate:', error);
        throw new CustomError('Internal Server Error', 500);
    }
};

export const getAllCoordinates = async (): Promise<ICoordinate[]> => {
    try {
        const coordinates = await Coordinate.find();
        return coordinates.map(coordinate => coordinate.toObject() as ICoordinate);
    } catch (error) {
        console.error('Error fetching all coordinates:', error);
        throw new PositionError();
    }
};