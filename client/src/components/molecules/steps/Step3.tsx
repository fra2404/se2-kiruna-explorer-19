import { FileUploader } from '../../atoms/atoms';

interface Step3Props {
    files: File[];
    setFiles: (files: File[]) => void;
}

const Step3 = ({files, setFiles} : Step3Props) => {
    return (
        <div className="">
            <div className="mx-auto">
                <FileUploader files={files} setFiles={setFiles} />
            </div>
        </div>
    )
}

export default Step3;