import { X } from "lucide-react";

  export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  };

  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };


    export default Modal;