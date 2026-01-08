import React from "react";
import { AppContainer } from "@/features/applications/components/webapp/app-container";

export default async function AppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AppContainer appId={id} />;
}