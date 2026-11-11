"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { DoctorsTable } from "@/components/doctors/doctors-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PageHeader, tablePanelClass } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { DATE_RANGE_OPTIONS, SPECIALIZATIONS } from "@/lib/constants";
import type { DateRange } from "@/lib/types";
import { useDoctorPage } from "@/lib/use-clinic-data";

export function DoctorsView() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [range, setRange] = useState<DateRange>("any");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const result = useDoctorPage({ search, specialization, range, page });

  return (
    <div>
      <PageHeader
        title="Doctors"
        subtitle="Your medical network at a glance."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add doctor
          </Button>
        }
      />
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block lg:flex-1">
          <span className="sr-only">Search doctors</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, hospital, email..."
            className="h-11 w-full rounded-xl border border-line bg-white pr-4 pl-10 text-sm text-ink outline-none placeholder:text-[#a8b6b2] focus:border-teal"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 lg:flex">
          <Select
            label="Filter by specialization"
            value={specialization}
            className="lg:w-52"
            onChange={(value) => {
              setSpecialization(value);
              setPage(1);
            }}
          >
            <option value="all">All specializations</option>
            {SPECIALIZATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            label="Filter by joined date"
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
          <DoctorsTable rows={result.page.items} />
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
      {open ? (
        <Modal title="New doctor" onClose={() => setOpen(false)}>
          <DoctorForm onDone={() => setOpen(false)} />
        </Modal>
      ) : null}
    </div>
  );
}
