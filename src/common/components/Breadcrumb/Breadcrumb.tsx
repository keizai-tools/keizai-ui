const Breadcrumb = ({
  contractName,
  folderName,
  contractInvocationName,
  contractInvocationId,
}: {
  contractName: string;
  folderName: string;
  contractInvocationName: string;
  contractInvocationId?: string;
}) => {
  return (
    <div className="flex gap-1 text-sm" data-test="breadcrumb-container">
      <span
        className="text-background-300"
        data-test="breadcrumb-contract-name"
      >
        {contractName} / {folderName} /
      </span>
      <span
        className="font-bold"
        data-test="breadcrumb-contract-invocation-name"
      >
        {contractInvocationName} {contractInvocationId}
      </span>
    </div>
  );
};

export default Breadcrumb;
