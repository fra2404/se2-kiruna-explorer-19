import { DocumentIcon } from '../molecules/documentsItems/DocumentIcon';

const DocumentDetailsModal = ( {document} : any ) => {

    console.log(document);

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
        { label: "Title", content: document.title },
        { label: "Stakeholders", content: document.stakeholders },
        { label: "Scale", content: document.scale },
        { label: "Issuance Date", content: document.date },
        { label: "Type", content: matchType(document.type) },
        { label: "Connections", content: document.connections?.length.toString() },
        { label: "Language", content: document.language },
        { label: "Coordinates", content: document.coordinates?.coordinates.toString() }
    ]

    return (
        <>
            <div className="w-full p-8 grid grid-cols-12 text-sm">
                {/* Icon container */}
                <div className="col-span-2 px-2">
                    <DocumentIcon type={document.type} />
                </div>

                {/* Middle section */}
                <div className="col-start-3 col-span-5 border-r border-l px-2">
                    {list.map((item, index) => (
                        <div key={index}>{item.label}: <span className="font-bold">{item.content}</span></div>
                    ))}
                </div>

                {/* Description / Summary container */}
                <div className="col-start-8 col-span-5 px-2">
                    <h1>Description:</h1>
                    <p>{document.summary}</p>
                </div>
            </div>
        </>
    );
};

export default DocumentDetailsModal;