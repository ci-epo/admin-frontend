import Pagination from "@/components/ui/pagination/Pagination";

interface TableFooterProps {
  from: number;
  to: number;
  total: number;
  /** Texte affiché quand la liste est vide (ex: "Aucun membre"). */
  emptyLabel: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Pied de tableau : « 1–8 sur 10 » + pagination. */
export default function TableFooter({
  from,
  to,
  total,
  emptyLabel,
  page,
  totalPages,
  onPageChange,
}: TableFooterProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <span className="text-muted fs-13">
        {total === 0 ? emptyLabel : `${from}–${to} sur ${total}`}
      </span>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
        appearance={{ size: "sm" }}
      />
    </div>
  );
}
