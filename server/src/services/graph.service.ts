import { IGraphData } from "../interfaces/graph.return.interface";
import { CustomError } from '../utils/customError';
import Document from '../schemas/document.schema';

export const getGraphDatas = async (): Promise<IGraphData | null> => {
  try {

    const result = await Document.aggregate([
      {
        // Add the 'year' field as the year extracted from the 'date' field
        $addFields: {
          year: {
            $cond: {
              if: { $regexMatch: { input: "$date", regex: /^\d{4}$/ } }, // Check if the date is just a year
              then: "$date", // If it's a year, keep the value
              else: { $substr: ["$date", 0, 4] }, // Otherwise, extract the first year from the string
            },
          },
        },
      },
      {
        // Group by year and scale
        $group: {
          _id: { year: "$year", scale: "$scale" },
          qty: { $sum: 1 },
        },
      },
      {
        // Group by year, creating an array with the types of scales and their quantities
        $group: {
          _id: "$_id.year",
          types: {
            $push: {
              scale: "$_id.scale",
              qty: "$qty",
            },
          },
        },
      },
      {
        // Calculate the minimum and maximum year, and gather the data
        $group: {
          _id: null,
          minYear: { $min: "$_id" },
          maxYear: { $max: "$_id" },
          data: {
            $push: {
              year: "$_id",
              type: "$types",
            },
          },
        },
      },
      {
        // Project the final result
        $project: {
          _id: 0,
          minYear: 1,
          maxYear: 1,
          data: 1,
        },
      },
    ]);

    const graphData: IGraphData = {
      minYear: result[0].minYear,
      maxYear: result[0].maxYear,
      infoYear: result[0].data.map((item: any) => ({
        year: item.year,
        types: item.type.map((type: any) => ({
          scale: type.scale,
          qty: type.qty,
        })),
      })),
    };

    return graphData;
  } catch (error) {
    throw new CustomError("Internal Server Error", 500);
  }
}
