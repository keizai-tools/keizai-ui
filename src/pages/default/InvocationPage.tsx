import React from 'react';

const InvocationPage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="flex flex-col justify-between w-full gap-7"
			data-test="home-page-container"
		>
			{children}
		</div>
	);
};

export default InvocationPage;
