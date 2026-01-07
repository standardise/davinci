import AppDetailView from "@/features/applications/components/app-detail-view";
import React from "react";

const ApplicationDetailPage = async ({
  params,
}: {
  params: Promise<{ reference: string }>;
}) => {
  const { reference } = await params;
  return <AppDetailView id={reference} />;
};

export default ApplicationDetailPage;
