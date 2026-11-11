"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CONDITION_META } from "@/lib/constants";
import type { DashboardData } from "@/lib/types";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e4eeea",
  boxShadow: "0 12px 30px -18px rgba(16,40,36,0.45)",
  fontSize: 12,
};

export function RegistrationsChart({
  data,
}: {
  data: DashboardData["registrations"];
}) {
  const peak = data.reduce(
    (max, point) => Math.max(max, point.registrations, point.critical),
    0,
  );

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e7efec" />
          <XAxis
            dataKey="label"
            interval={2}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "#6b7c78", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={32}
            domain={[0, Math.max(8, peak)]}
            tick={{ fill: "#6b7c78", fontSize: 12 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="registrations"
            name="Admissions"
            stroke="#12b5a0"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="critical"
            name="Critical"
            stroke="#f0a07a"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConditionsChart({
  data,
}: {
  data: DashboardData["conditions"];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="size-[210px] shrink-0">
        {total === 0 ? (
          <div className="grid size-full place-items-center text-sm text-muted">
            No patients yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="condition"
                innerRadius={64}
                outerRadius={88}
                paddingAngle={2.5}
                stroke="#fff"
                strokeWidth={3}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((item) => (
                  <Cell
                    key={item.condition}
                    fill={CONDITION_META[item.condition].chart}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <ul className="w-full space-y-2">
        {data.map((item) => (
          <li
            key={item.condition}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2 text-ink">
              <span
                className="size-2.5 rounded-full"
                style={{ background: CONDITION_META[item.condition].chart }}
              />
              {item.condition}
            </span>
            <span className="text-muted tabular-nums">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PatientsPerDoctorChart({
  data,
}: {
  data: DashboardData["patientsPerDoctor"];
}) {
  const peak = data.reduce((max, item) => Math.max(max, item.count), 0);

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Doctor workload appears once the network has profiles.
      </p>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="#e7efec" />
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "#6b7c78", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={32}
            domain={[0, Math.max(8, peak)]}
            tick={{ fill: "#6b7c78", fontSize: 12 }}
          />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(18,181,160,0.08)" }} />
          <Bar dataKey="count" name="Patients" fill="#0f9d8a" radius={[7, 7, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
