import DatasetDetailView from "@/features/datasets/components/detail-view";
import React from "react";

const DatasetPageDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <DatasetDetailView id={id} />;
};

export default DatasetPageDetail;
