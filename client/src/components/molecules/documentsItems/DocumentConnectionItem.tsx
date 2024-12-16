import { IDocument } from "../../../utils/interfaces/document.interface";
import { DocumentIcon } from "./DocumentIcon";

interface DocumentConnectionItemProps {
  document: IDocument;
  type: string;
}


export const DocumentConnectionItem: React.FC<DocumentConnectionItemProps> = ({
  document,
  type
}) => {
  return (
    <div className="flex">
      <div className="size-8 ml-1 mr-3">
        <DocumentIcon
          type={document.type.type}
          stakeholders={document.stakeholders?.map((s) => s.type)}
        />
      </div>
      <span className="text-lg mr-3">
        <span className='font-bold'>{document.title}</span>
        &nbsp;-&nbsp;
        <span>{type}</span>
      </span>
    </div>
  );
}