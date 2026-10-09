"use client";

import Modal from "@/components/ui/modal/Modal";
import { formatDate } from "@/lib/utils/format-date";
import type { Schedule } from "@/types/calendar";

interface ScheduleDetailsModalProps {
  schedule: Schedule;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ScheduleDetailsModal({ schedule, isOpen, onClose, onEdit, onDelete }: ScheduleDetailsModalProps) {
  return (
    <Modal title="Détails du créneau" isOpen={isOpen} onClose={onClose} dialog={{ centered: true }}>
      <div className="text-start">
        <p className="mb-2">
          <strong>Lieu :</strong> {schedule.localisation}
        </p>
        <p className="mb-2">
          <strong>Date :</strong> {formatDate(new Date(schedule.date))}
        </p>
        <p className="mb-0">
          <strong>Horaires :</strong> {schedule.beginHour}–{schedule.endHour}
        </p>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Fermer
        </button>
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          <i className="ri-pencil-line me-1" aria-hidden="true"></i>Modifier
        </button>
        <button type="button" className="btn btn-danger" onClick={onDelete}>
          <i className="ri-delete-bin-line me-1" aria-hidden="true"></i>Supprimer
        </button>
      </div>
    </Modal>
  );
}
