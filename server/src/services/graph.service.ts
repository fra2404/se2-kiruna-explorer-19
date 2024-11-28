import { getAllDocuments } from "./document.service";
import { ScaleTypeEnum } from "../utils/enums/scale-type-enum";
import { IDocQuantity, IDocPerYear, IGraphData } from "../interfaces/graph.return.interface";
import { CustomError } from '../utils/customError';

export const getGraphDatas = async (): Promise<IGraphData | null> => {
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
        const documents = await Document.aggregate([
            {
              // Aggiungi un campo "year" basato sulla data
              $addFields: {
                year: { $year: { $dateFromString: { dateString: "$date" } } }
              }
            },
            {
              // Raggruppa per anno e scala, contando i documenti
              $group: {
                _id: { year: "$year", scale: "$scale" },
                qty: { $sum: 1 }
              }
            },
            {
              // Riorganizza i dati per anno
              $group: {
                _id: "$_id.year",
                types: {
                  $push: {
                    scale: "$_id.scale",
                    qty: "$qty"
                  }
                }
              }
            },
            {
              // Calcola il minYear e maxYear in una fase successiva
              $group: {
                _id: null,
                minYear: { $min: "$_id" },
                maxYear: { $max: "$_id" },
                data: {
                  $push: {
                    year: "$_id",
                    type: "$types"
                  }
                }
              }
            },
            {
              // Rimuovi l'ID temporaneo per ottenere il formato desiderato
              $project: {
                _id: 0,
                minYear: 1,
                maxYear: 1,
                data: 1
              }
            }
          ]);

        return documents;
    } catch(error) {
        throw new CustomError("Internal Server Error", 500);
    } 
}
