"use client";

import { useSyncExternalStore } from "react";
import { currentIsoDate } from "@/lib/dates";

const SERVER_TODAY = "2026-11-11";
let clientToday: string | null = null;

function subscribe() {
  return () => {};
}

function getClientToday() {
  if (!clientToday) clientToday = currentIsoDate();
  return clientToday;
}

function getServerToday() {
  return SERVER_TODAY;
}

export function useTodayIso() {
  return useSyncExternalStore(subscribe, getClientToday, getServerToday);
}
