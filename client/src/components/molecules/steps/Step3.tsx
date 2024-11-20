import FileUploader from '../../atoms/FileUploader';

interface Step3Props {
  files: File[];
  setFiles: (files: File[]) => void;
  existingFiles: {
    id: string;
    url: string;
    filename: string;
    type: string;
    mimetype: string;
  }[];
}

const Step3 = ({ files, setFiles, existingFiles }: Step3Props) => {
  return (
    <div className="">
      <div className="mx-auto">
        <FileUploader
          files={files}
          setFiles={setFiles}
          existingFiles={existingFiles}
        />
      </div>
    </div>
  );
};

export default Step3;
