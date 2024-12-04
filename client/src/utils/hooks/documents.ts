import { useState, useEffect, useCallback } from 'react';
import API from '../../API'; 
import { IDocument } from '../interfaces/document.interface';

interface UseDocumentsReturn {
    documents: IDocument[];
    setDocuments: (documents: IDocument[]) => void;
    refreshDocuments: () => void;
    isLoading: boolean;
    error: string | null;
}

const useDocuments = (): UseDocumentsReturn => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shouldRefresh, setShouldRefresh] = useState(true);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedDocuments = await API.getDocuments();
            setDocuments(fetchedDocuments);
        } catch (e: any) {
            setError(e.message || 'An error occurred while fetching documents.');
        } finally {
            setIsLoading(false);
            setShouldRefresh(false);
        }
    }, []);

    useEffect(() => {
        if (shouldRefresh) {
            fetchDocuments();
        }
    }, [shouldRefresh, fetchDocuments]);

    const refreshDocuments = useCallback(() => {
        setShouldRefresh(true);
    }, []);

    return { documents, setDocuments, refreshDocuments, isLoading, error };
};

export default useDocuments;
