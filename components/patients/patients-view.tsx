"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { PatientForm } from "@/components/patients/patient-form";
import { PatientsTable } from "@/components/patients/patients-table";
import { useClinic } from "@/components/providers/clinic-provider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PageHeader, tablePanelClass } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { CONDITIONS, DATE_RANGE_OPTIONS } from "@/lib/constants";
import type { DateRange, PatientRow } from "@/lib/types";
import { usePatientPage } from "@/lib/use-clinic-data";

export function PatientsView({ doctorId }: { doctorId?: string }) {
  const { deletePatient } = useClinic();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");
  const [range, setRange] = useState<DateRange>("any");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<PatientRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<PatientRow | null>(null);
  const [pending, setPending] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const result = usePatientPage({ search, condition, range, page, doctorId });

  async function confirmDelete() {
    if (!removing) return;
    setPending(true);
    setDeleteError("");
    try {
      await deletePatient(removing.id);
      setRemoving(null);
    } catch (reason) {
      setDeleteError(
        reason instanceof Error ? reason.message : "Could not remove this patient.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {doctorId ? null : (
        <PageHeader
          title="Patients"
          subtitle="Every patient across your network."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              Add patient
            </Button>
          }
        />
      )}
      <div className={`flex flex-col gap-3 lg:flex-row lg:items-center ${doctorId ? "" : "mt-6"}`}>
        <label className="relative block lg:flex-1">
          <span className="sr-only">Search patients</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name or phone"
            className="h-11 w-full rounded-xl border border-line bg-white pr-4 pl-10 text-sm text-ink outline-none placeholder:text-[#a8b6b2] focus:border-teal"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 lg:flex">
          <Select
            label="Filter by condition"
            value={condition}
            className="lg:w-48"
            onChange={(value) => {
              setCondition(value);
              setPage(1);
            }}
          >
            <option value="all">All conditions</option>
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            label="Filter by admitted date"
            value={range}
            className="lg:w-40"
            onChange={(value) => {
              setRange(value as DateRange);
              setPage(1);
            }}
          >
            {DATE_RANGE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        {doctorId ? (
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Add patient
          </Button>
        ) : null}
      </div>
      {result.error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {result.error}
        </p>
      ) : null}
      <section className={`${tablePanelClass} mt-4 ${result.loading ? "opacity-70" : ""}`}>
        {result.loading && result.page.total === 0 ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-[#f3f7f6]" />
            ))}
          </div>
        ) : (
          <PatientsTable
            rows={result.page.items}
            showDoctor={!doctorId}
            onEdit={setEditing}
            onDelete={setRemoving}
          />
        )}
        <Pagination
          from={result.page.from}
          to={result.page.to}
          total={result.page.total}
          page={result.page.page}
          pages={result.page.pages}
          onPage={setPage}
        />
      </section>
      {creating ? (
        <Modal title="New patient" onClose={() => setCreating(false)}>
          <PatientForm
            lockDoctorId={doctorId}
            onDone={() => {
              setSearch("");
              setCondition("all");
              setRange("any");
              setPage(1);
              setCreating(false);
            }}
          />
        </Modal>
      ) : null}
      {editing ? (
        <Modal title="Edit patient" onClose={() => setEditing(null)}>
          <PatientForm
            key={editing.id}
            initial={editing}
            lockDoctorId={doctorId}
            onDone={() => setEditing(null)}
          />
        </Modal>
      ) : null}
      {removing ? (
        <Modal
          title="Remove patient"
          onClose={() => {
            if (!pending) setRemoving(null);
          }}
        >
          <p className="text-sm leading-6 text-muted">
            {removing.name} will be removed from the doctor&apos;s list and the
            network totals.
          </p>
          {deleteError ? (
            <p className="mt-3 text-sm text-[#e11d48]">{deleteError}</p>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setRemoving(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={pending}>
              {pending ? "Removing" : "Delete"}
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
