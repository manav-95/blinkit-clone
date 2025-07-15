import { type ReactNode } from "react";
import { LuX } from "react-icons/lu";

type ModalProps = {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

const Modal = ({ title, children, onClose, size = "lg" }: ModalProps) => {
    const getMaxWidth = () => {
        switch (size) {
            case "sm":
                return "max-w-md";
            case "md":
                return "max-w-lg";
            case "lg":
                return "max-w-4xl";
            case "xl":
                return "max-w-6xl";
            case "2xl":
                return "max-w-7xl";
            default:
                return "max-w-4xl"; // fallback to lg
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`relative bg-white rounded-xl shadow-xl w-full ${getMaxWidth()}
                     max-h-[90vh] overflow-y-auto`}
            >
                <div className="sticky bg-white top-0 z-10 shadow flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <LuX className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}

export default Modal;