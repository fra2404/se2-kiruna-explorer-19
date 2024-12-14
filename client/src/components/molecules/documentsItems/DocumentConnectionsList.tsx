import { IDocument } from "../../../utils/interfaces/document.interface";
import { DocumentConnectionItem } from "./DocumentConnectionItem";

interface ConnectionListProps {
  document: IDocument;
  allDocuments: IDocument[];
}

export const DocumentConnectionsList: React.FC<ConnectionListProps> = ({
  document,
  allDocuments
}) => {
  let connectedDocuments;
  connectedDocuments = document.connections?.map(c => {
    const connDocument = allDocuments.find((doc) => doc.id == c.document.toString());
    if(connDocument) {
      return (
        <DocumentConnectionItem 
          key={connDocument?.id}
          document={connDocument}
          type={c.type.toString()}
        />
      );
    }
    else {
      return(<></>);
    }
  })
  return (
    <div className='grid my-2'>
      <span className="text-xl font-bold">{document?.title}</span>
      <br />

      <span className="text-base w-full text-left">Connections:</span>
      <div>
        {
          connectedDocuments
        }
      </div>
    </div>
  );
}