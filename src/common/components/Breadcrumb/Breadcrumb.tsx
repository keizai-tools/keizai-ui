const Breadcrumb = ({
	contractName,
	folderName,
	contractInvocationName,
}: {
	contractName: string;
	folderName: string;
	contractInvocationName: string;
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
				{contractInvocationName}
			</span>
		</div>
	);
};

export default Breadcrumb;
