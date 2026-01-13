"use client";

import React, { use } from "react";
import AppDetailView from "@/features/applications/components/app-detail-view";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <AppDetailView id={id} />
    </div>
  );
}
