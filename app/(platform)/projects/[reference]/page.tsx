import React from "react";

const ProjectDetailPage = async ({
  params,
}: {
  params: { reference: string };
}) => {
  const reference = await params.reference;
  return <div>Project Detail: {reference}</div>;
};

export default ProjectDetailPage;
