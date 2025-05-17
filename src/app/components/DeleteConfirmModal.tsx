// components/DeleteConfirmModal.tsx
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  todoTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          確認刪除
        </h3>
        <p className="text-gray-500 mb-6">
          您確定要刪除「{todoTitle || '此項'}」待辦事項嗎？此操作無法復原。
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded transition-colors
            cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            cursor-pointer"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
}