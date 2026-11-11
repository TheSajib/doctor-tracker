"use client";

import { HeartPulse, Stethoscope, TrendingUp, Users } from "lucide-react";
import {
  ConditionsChart,
  PatientsPerDoctorChart,
  RegistrationsChart,
} from "@/components/dashboard/charts";
import { panelClass } from "@/components/ui/page-header";
import { formatAvg } from "@/lib/dates";
import { useDashboardData } from "@/lib/use-clinic-data";

export function DashboardView() {
  const { data, loading, error } = useDashboardData();

  if (loading || !data) {
    return (
      <p className="text-sm text-muted">Gathering clinic numbers…</p>
    );
  }

  const cards = [
    {
      label: "Total doctors",
      value: data.totalDoctors,
      icon: <Stethoscope className="size-4" />,
      tone: "solid" as const,
    },
    {
      label: "Total patients",
      value: data.totalPatients,
      icon: <Users className="size-4" />,
      tone: "plain" as const,
    },
    {
      label: "New patients · 7d",
      value: data.newPatients7d,
      icon: <TrendingUp className="size-4" />,
      tone: "plain" as const,
    },
    {
      label: "Critical cases",
      value: data.criticalCases,
      icon: <HeartPulse className="size-4" />,
      tone: "plain" as const,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl leading-none font-medium tracking-tight text-ink sm:text-[2.65rem]">
        Good to see you
      </h1>
      <p className="mt-2 text-sm text-muted">
        {data.totalDoctors === 0
          ? "Add doctors to start tracking the network."
          : `Avg. ${formatAvg(data.avgPerDoctor)} patients per doctor across your network.`}
      </p>
      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) =>
          card.tone === "solid" ? (
            <article
              key={card.label}
              className="rounded-[22px] bg-gradient-to-br from-[#1ec9aa] to-[#0c9a84] p-5 text-white shadow-[0_18px_40px_-24px_rgba(12,154,132,0.85)]"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-white/80">{card.label}</p>
                <span className="grid size-9 place-items-center rounded-full bg-white/15">
                  {card.icon}
                </span>
              </div>
              <p className="mt-7 font-serif text-5xl leading-none">{card.value}</p>
            </article>
          ) : (
            <article
              key={card.label}
              className="rounded-[22px] border border-white bg-white p-5 shadow-[0_14px_36px_-28px_rgba(16,40,36,0.7)]"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted">{card.label}</p>
                <span className="grid size-9 place-items-center rounded-full bg-mint text-teal-deep">
                  {card.icon}
                </span>
              </div>
              <p className="mt-7 font-serif text-5xl leading-none text-ink">
                {card.value}
              </p>
            </article>
          ),
        )}
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
        <article className={`${panelClass} p-5 sm:p-6`}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-ink">
              Registrations · last 30 days
            </h2>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#12b5a0]" />
                Admissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#f0a07a]" />
                Critical
              </span>
            </div>
          </div>
          <RegistrationsChart data={data.registrations} />
        </article>
        <article className={`${panelClass} p-5 sm:p-6`}>
          <h2 className="mb-4 text-sm font-medium text-ink">Patient conditions</h2>
          <ConditionsChart data={data.conditions} />
        </article>
      </section>
      <article className={`${panelClass} mt-4 p-5 sm:p-6`}>
        <h2 className="mb-2 text-sm font-medium text-ink">Patients per doctor</h2>
        <PatientsPerDoctorChart data={data.patientsPerDoctor} />
      </article>
    </div>
  );
}
