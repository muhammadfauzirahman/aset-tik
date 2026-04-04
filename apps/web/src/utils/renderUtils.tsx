import { Button } from "../components/ui/Button";

interface ActionButtonProps {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showDetail?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const renderActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  showDetail = true,
  showEdit = true,
  showDelete = true
}: ActionButtonProps) => {
  return (
    <div className="flex justify-end gap-2">
      {showDetail && onDetail && (
        <Button variant="ghost" size="sm" onClick={onDetail} title="Detail">
          <span className="material-symbols-outlined text-sm">visibility</span>
        </Button>
      )}
      {showEdit && onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit} title="Edit">
          <span className="material-symbols-outlined text-sm">edit</span>
        </Button>
      )}
      {showDelete && onDelete && (
        <Button variant="danger" size="sm" onClick={onDelete} title="Hapus">
          <span className="material-symbols-outlined text-sm">delete</span>
        </Button>
      )}
    </div>
  );
};
