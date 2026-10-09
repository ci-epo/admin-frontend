"use client";

import { useMemo, useState } from "react";
import AddActivityModal from "@/components/sections/admin/activity/AddActivityModal";
import ActivityGrid from "@/components/sections/admin/activity/ActivityGrid";
import ActivityToolbar from "@/components/sections/admin/activity/ActivityToolbar";
import { ACTIVITY_TYPE_LABEL } from "@/components/ui/card/ActivityCard";
import EmptyState from "@/components/ui/empty-state/EmptyState";
import TableFooter from "@/components/ui/table/TableFooter";
import { usePagination } from "@/hooks/use-pagination";
import { filterBySearch } from "@/lib/utils/text-search";
import type { FormAction } from "@/types/administration";
import type { ActivityFormOptions, ActivityRow } from "@/types/activity";

interface ActivityBoardProps {
  rows: ActivityRow[];
  options: ActivityFormOptions;
  createAction: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

const PAGE_SIZE = 6;

/** Champs sur lesquels porte la recherche : nom, type, formateur, mandat, créneau et description. */
function searchableFields(activity: ActivityRow): string[] {
  return [
    activity.name,
    ACTIVITY_TYPE_LABEL[activity.type],
    activity.trainerName,
    activity.mandateLabel,
    activity.scheduleLabel,
    activity.description ?? "",
  ];
}

export default function ActivityBoard({ rows, options, createAction, updateAction, deleteAction }: ActivityBoardProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => filterBySearch(rows, query, searchableFields), [rows, query]);
  const { items, page, totalPages, from, to, total, setPage } = usePagination(filteredRows, PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="position-relative z-1">
      <ActivityToolbar onAdd={() => setIsAddOpen(true)} searchValue={query} onSearchChange={handleSearchChange} />

      {total === 0 ? (
        <EmptyState
          icon="ri-calendar-event-line"
          title={rows.length > 0 ? `Aucun résultat pour « ${query.trim()} »` : "Aucune activité enregistrée"}
        />
      ) : (
        <>
          <ActivityGrid activities={items} options={options} updateAction={updateAction} deleteAction={deleteAction} />
          <TableFooter
            from={from}
            to={to}
            total={total}
            emptyLabel=""
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <AddActivityModal options={options} action={createAction} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
