import React from "react";
import StatsClient from "./StatsClient";
import { getDashboardStats } from "./dataFetcher";

export const dynamic = "force-dynamic";

export default async function StatisticsDashboard() {
  const initialStats = await getDashboardStats();

  return <StatsClient initialStats={initialStats} />;
}
