interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const workspaceIdPage = ({ params: { workspaceId } }: WorkspaceIdPageProps) => {
  return <div>ID: {workspaceId}</div>;
};

export default workspaceIdPage;
