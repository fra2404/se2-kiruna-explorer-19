import { IGraphData } from "../interfaces/graph.return.interface";
import { CustomError } from '../utils/customError';
import Document from '../schemas/document.schema';

export const getGraphDatas = async (): Promise<IGraphData | null> => {
  try {

    const result = await Document.aggregate([
      {
        // Aggiungi il campo 'year' come anno estratto dal campo 'date'
        $addFields: {
          year: {
            $cond: {
              if: { $regexMatch: { input: "$date", regex: /^\d{4}$/ } }, // Verifica se la data è solo un anno
              then: "$date", // Se è un anno, mantieni il valore
              else: { $substr: ["$date", 0, 4] }, // Altrimenti estrai il primo anno dalla stringa
            },
          },
        },
      },
      {
        // Raggruppa per anno e per scala
        $group: {
          _id: { year: "$year", scale: "$scale" },
          qty: { $sum: 1 },
        },
      },
      {
        // Raggruppa per anno, creando un array con i tipi di scala e le loro quantità
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
        // Calcola l'anno minimo e massimo, e raccogli i dati
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
        // Proietta il risultato finale
        $project: {
          _id: 0,
          minYear: 1,
          maxYear: 1,
          data: 1,
        },
      },
    ]);

    console.log(result);

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
