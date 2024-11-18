import { Popup } from "react-leaflet";
import ButtonRounded from "../../atoms/button/ButtonRounded";

interface DeleteCoordPopupProps {
  name: string;
  message: string;
  showButtons: boolean,
  onYesClick: () => void;
  onCancelClick: () => void;
}

export const DeleteCoordPopup: React.FC<DeleteCoordPopupProps> = ({
  name,
  message,
  showButtons,
  onYesClick,
  onCancelClick
}) => {
  return (
    <Popup>
      <span className="text-lg font-bold">{name}</span>
      <hr />

      <span className="text-base">{message}</span>
      {showButtons &&
      <>
        <br /><br />
        <div className="flex justify-between">
          <ButtonRounded
            variant="outlined"
            text="Yes"
            className="border-2 border-red-500 text-red-500 text-base pt-2 pb-2 pl-3 pr-3"
            onClick={onYesClick}
          />
          <ButtonRounded
            variant="outlined"
            text="Cancel"
            className="text-base pt-2 pb-2 pl-3 pr-3"
            onClick={onCancelClick}
          />
        </div>
      </>
      }
    </Popup>
  )
}