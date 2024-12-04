import { useState, useCallback } from 'react';

interface ToastState {
    isShown: boolean;
    message: string;
    type: 'success' | 'error';
}

interface UseToastReturn {
    toast: ToastState;
    showToast: (message: string, type: 'success' | 'error') => void;
    hideToast: () => void;
}

const useToast = (): UseToastReturn => {
    const [toast, setToast] = useState<ToastState>({ isShown: false, message: '', type: 'success' });

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ isShown: true, message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast({ isShown: false, message: '', type: 'success' });
    }, []);

    return { toast, showToast, hideToast };
};

export default useToast;
