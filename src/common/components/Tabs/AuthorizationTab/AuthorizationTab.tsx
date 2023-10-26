import debounce from 'lodash.debounce';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '../../ui/input';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';

const AuthorizationTab = ({
	invocationId,
	defaultValues,
}: {
	invocationId: string;
	defaultValues: { secretKey?: string; publicKey?: string };
}) => {
	const { mutate: editKeys } = useEditInvocationKeysMutation();
	const { register, reset, formState, watch } = useForm({
		defaultValues: {
			secretKey: defaultValues.secretKey,
			publicKey: defaultValues.publicKey,
		},
	});
	const data = watch();

	const debounceKeyPhrase = React.useMemo(
		() =>
			debounce((value) => {
				editKeys({
					id: invocationId,
					secretKey: value.secretKey,
					publicKey: value.publicKey,
				});
				reset({
					secretKey: value.secretKey,
					publicKey: value.publicKey,
				});
			}, 500),
		[editKeys, invocationId, reset],
	);

	React.useEffect(() => {
		if (formState.isDirty) {
			debounceKeyPhrase(data);
		}
	}, [data, debounceKeyPhrase, formState.isDirty]);

	return (
		<div className="flex flex-col gap-2 mt-7">
			<div className="flex flex-col gap-1">
				<span className="text-primary text-md font-semibold">Secret key</span>
				<Input {...register('secretKey')} placeholder="S . . ." />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-primary text-md font-semibold">Secret key</span>
				<Input {...register('publicKey')} placeholder="G . . ." />
			</div>
		</div>
	);
};

export default AuthorizationTab;
