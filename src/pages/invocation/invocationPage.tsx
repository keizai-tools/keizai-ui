import { Loader } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';

import InvocationPageContent from './invocationPageContent';

import { useInvocationQuery } from '@/common/api/invocations';

function InvocationPage() {
	const params = useParams();
	const { data, isLoading, isRefetching, error } = useInvocationQuery({
		id: params.invocationId,
	});

	if (isLoading || isRefetching) {
		return (
			<div className="flex items-center justify-center flex-1 w-full h-full">
				<Loader className="animate-spin" size="36" />
			</div>
		);
	}

	if (error) {
		return <Navigate to="/collection" replace={true} />;
	}

	if (!data) {
		return null;
	}

	return <InvocationPageContent data={data} />;
}

export default InvocationPage;
