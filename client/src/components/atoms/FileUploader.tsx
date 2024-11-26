import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineViewGridAdd } from 'react-icons/hi';

import { MAX_FILE_SIZE, CDN_URL } from '../../utils/constants';
import { nanoid } from 'nanoid';

interface ExistingFile {
  id: string;
  url: string;
  filename: string;
  type: string;
  mimetype: string;
}

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  existingFiles: ExistingFile[];
}

const FileUploader = ({
  files,
  setFiles,
  existingFiles,
}: FileUploaderProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTotalSize, setCurrentTotalSize] = useState<number>(0);

  const onDrop = (acceptedFiles: File[]) => {
    const newFilesSize = acceptedFiles.reduce(
      (acc, file) => acc + file.size,
      0,
    );

    if (currentTotalSize + newFilesSize > MAX_FILE_SIZE) {
      setErrorMessage('Total file size exceeds the limit');
      return;
    }

    setFiles([...files, ...acceptedFiles]);
    setCurrentTotalSize(currentTotalSize + newFilesSize);
    setErrorMessage(null);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const removedFileSize = files[index].size;
    setFiles(newFiles);
    setCurrentTotalSize(currentTotalSize - removedFileSize);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
        'text/csv': ['.csv'],
        'text/markdown': ['.md'],
      },
      multiple: true,
    });

  return (
    <>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`flex justify-between items-center p-4 w-96 bg-white rounded-lg border-[2.5px] border-dashed ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-[#005293]'
        } text-[#005293] group cursor-pointer transition-all`}
      >
        <HiOutlineViewGridAdd className="text-2xl" />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop files or click to upload</p>
        )}
      </div>
      <p className="text-sm mt-1">(.pdf, .txt, .csv, .md)</p>

      {/* Error Messages */}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 mt-2">
          Only pdf, text, csv and markdown files are allowed.
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Existing files:</h4>
          <ul className="list-disc pl-6 text-gray-700">
            {existingFiles.map((file) => (
              <li key={file.id} className="flex justify-between items-center">
                <a
                  href={CDN_URL + file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Uploaded files:</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {files.map((file, index) => (
            <li key={nanoid()} className="flex justify-between items-center">   {/* Instead of using the item's index as the key, we generate a random ID (file does not have an ID, so we cannot use that) */}
              <span>
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FileUploader;
