import React from 'react';
import { DocumentIcon } from '../molecules/documentsItems/DocumentIcon';
import DocumentDetailsMiddle from '../molecules/DocumentDetailsMiddle';

export interface DocumentDetailsModalProps {
    title: string;
    stakeholders: string;
    scale: string;
    summary: string;
    type: string;
    date: string;
    coordinates: number[] | number[][];
    numConnections: number;
    language?: string;
}

const DocumentDetailsModal = ({ 
    title, stakeholders, scale, summary, 
    type, date, coordinates, numConnections, 
    language }: DocumentDetailsModalProps) => {

    const matchType = (type: string) => {
        switch (type) {
            case "AGREEMENT":
                return "Agreement";
            case "CONFLICT":
                return "Conflict";
            case "CONSULTATION":
                return "Consultation";
            case "DESIGN_DOC":
                return "Design Document";
            case "INFORMATIVE_DOC":
                return "Informative Document";
            case "MATERIAL_EFFECTS":
                return "Material Effects";
            case "PRESCRIPTIVE_DOC":
                return "Prescriptive Document";
            case "TECHNICAL_DOC":
                return "Technical Document";
            default: 
                return "Unknown";
        }
    }

    const list = [
        { label: "Title", content: title },
        { label: "Stakeholders", content: stakeholders },
        { label: "Scale", content: scale },
        { label: "Issuance Date", content: date },
        { label: "Type", content: matchType(type) },
        { label: "Connections", content: numConnections.toString() },
        { label: "Language", content: language },
        { label: "Coordinates", content: coordinates.coordinates.toString() }
    ]

    return (
        <>
            <div className="w-full p-8 grid grid-cols-12 text-sm">
                {/* Icon container */}
                <div className="col-span-2 px-2">
                    <DocumentIcon type={type} />
                </div>

                {/* Middle section */}
                <div className="col-start-3 col-span-5 border-r border-l px-2">
                    <DocumentDetailsMiddle list={list} />
                </div>

                {/* Description / Summary container */}
                <div className="col-start-8 col-span-5 px-2">
                    <h1>Description:</h1>
                    <p>{summary}</p>
                </div>
            </div>
        </>
    );
};

export default DocumentDetailsModal;