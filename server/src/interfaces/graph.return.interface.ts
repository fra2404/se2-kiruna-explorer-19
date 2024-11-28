import { ScaleTypeEnum } from "../utils/enums/scale-type-enum";

export interface IDocQuantity {
    scale: ScaleTypeEnum,
    quantity: number
}

export interface IDocPerYear {
    year: number,
    type: IDocQuantity[]
}

export interface IGraphData {
    minYear: number,
    maxYear: number,
    infoYear: IDocPerYear[] 
}