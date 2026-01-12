"use client";

import React, { use } from "react";
import PredictionDetailView from "@/features/predictions/components/detail/prediction-detail-view";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <PredictionDetailView predictionId={id} />;
}