import { getAllDocuments } from "./document.service";
import { ScaleTypeEnum } from "../utils/enums/scale-type-enum";
import { IDocQuantity, IDocPerYear, IGraphData } from "../interfaces/graph.return.interface";
import { CustomError } from '../utils/customError';
import Document from '../schemas/document.schema';

export const getGraphDatas = async (): Promise<any | null> => {
  try {
    // const documents = await getAllDocuments();
    // let maxYear = 0;
    // let minYear = 0;
    // let years: string[] = [];
    // let yearedDocuments = [];
    // let typedDocuments = [];
    // let supportQuantity: IDocQuantity;
    // let supportPerYear: IDocPerYear;
    // let finalObj: IGraphData;

    // //Study of the years of all documents
    // for(let i=0; i<documents.length; i++) {
    //     //Search of the max year
    //     if(Number( documents[i].date.slice(0, 4) ) > maxYear) {
    //         maxYear = Number( documents[i].date.slice(0, 4) )
    //     }

    //     //Search of the min year
    //     if(Number( documents[i].date.slice(0, 4) ) < minYear) {
    //         minYear = Number( documents[i].date.slice(0, 4) )
    //     }

    //     //Collecting all the available years
    //     if( !years.includes(documents[i].date.slice(0, 4)) ) {
    //         years.push(documents[i].date.slice(0, 4))
    //     }
    // }

    // for(let i=0; i<years.length; i++) {
    //     yearedDocuments = documents.filter(x => x.date.slice(0, 4) === years[i])
    // }

    // return finalObj;

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

    return result;
  } catch (error) {
    throw new CustomError("Internal Server Error", 500);
  }
}
