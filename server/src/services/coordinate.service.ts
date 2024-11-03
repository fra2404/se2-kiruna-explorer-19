import { Coordinate } from "@schemas/coordinate.schema";
import { ICoordinate } from '@interfaces/coordinate.interface'; 

// Function to get a coordinate by its ID
export const getCoordinateById = async (id: string): Promise<ICoordinate | null> => {
    try {
        const coordinate = await Coordinate.findById(id);
        return coordinate ? coordinate.toObject() as ICoordinate : null;
    } catch (error) {
        console.error(`Error fetching coordinate with ID ${id}:`, error);
        return null;
    }
};