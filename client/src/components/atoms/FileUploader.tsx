import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineViewGridAdd } from "react-icons/hi";

import { MAX_FILE_SIZE } from '../../utils/constants';

interface FileUploaderProps {
    files: File[];
    setFiles: (files: File[]) => void;
}

const FileUploader = ({
    files,
    setFiles
}: FileUploaderProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentTotalSize, setCurrentTotalSize] = useState<number>(0);

    const onDrop = (acceptedFiles: File[]) => {
        const newFilesSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);

        if (currentTotalSize + newFilesSize > MAX_FILE_SIZE) {
            setErrorMessage('Total file size exceeds the limit');
            return;
        }

        setFiles([...files, ...acceptedFiles]);
        setCurrentTotalSize(currentTotalSize + newFilesSize);
        setErrorMessage(null);
    };

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
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
                } text-[#005293] group cursor-pointer transition-all`}>

                <HiOutlineViewGridAdd className="text-2xl" />
                <input {...getInputProps()} />
                {
                    isDragActive ? 
                    <p>Drop the files here...</p> : 
                    <p>Drag & drop PDF files or click to upload</p>
                }
            </div>
            <p className='text-sm mt-1'>(.pdf, .txt, .csv, .md)</p>

            {/* Error Messages */}
            {
                errorMessage && 
                <div className="text-red-500 mt-2">{errorMessage}</div> 
            }

            {/* File Rejections */}
            {fileRejections.length > 0 && (
                <div className="text-red-500 mt-2">
                    Only pdf, text, csv and markdown files are allowed.
                </div>
            )}

            {/* Uploaded Files */}
            <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Uploaded PDFs:</h4>
                <ul className="list-disc pl-6 text-gray-700">
                    {files.map((file, index) => (
                        <li key={index}>
                            {file.name} - {(file.size / 1024).toFixed(2)} KB
                        </li>
                    ))}
                </ul>
            </div>
        </>

    )
}

export default FileUploader;