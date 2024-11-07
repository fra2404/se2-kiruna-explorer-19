import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

interface ToastProps {
    isShown: boolean;
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const Toast = ({ isShown, message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onClose();
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [onClose]);

    return (
        <div className={`absolute bottom-6 right-6 transition-all duration-400
        ${isShown ? "block" : "hidden"}`}>

            <div className={`min-w-52 bg-white border shadow-2xl 
            rounded-md after:w-[5px] after:h-full 
            ${type === "error" ? "after:bg-red-500" : "after:bg-green-500"}
            after:absolute after:left-0 after:top-0 after:rounded-lg`}>

                <div className="flex items-center gap-3 py-2 px-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${type === "error" ? "bg-red-50" : "bg-green-50"}`}>
                        {type === "error" ? <MdDeleteOutline className="text-xl text-red-500"/> : <LuCheck className="text-xl text-green-500" /> }
                    </div>
                    <p className="text-sm text-slate-800">{message}</p>
                </div>

            </div>
        </div>
    ); 
};

export default Toast;