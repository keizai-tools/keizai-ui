import CreateNewAccount from '../../auth/stellar/CreateNewAccount';
import ImportAccount from '../../auth/stellar/ImportAccount';

function AuthorizationsTab() {
	return (
		<section data-test="auth-tab-container" className="p-2 overflow-x-auto">
			<div
				className="flex justify-center items-end my-14"
				data-test="auth-tab-header-container"
			>
				<div
					className="flex flex-col justify-center text-primary font-black md:text-6xl text-5xl"
					data-test="auth-tab-account-text"
				>
					<h2>SET YOUR</h2>
					<h2>AUTHENTICATION</h2>
				</div>
				<img
					src="/moon.svg"
					alt="Authentication image"
					width={200}
					height={200}
					loading="eager"
					data-test="auth-tab-account-img"
				/>
			</div>
			<div className="flex justify-center gap-4 h-12 w-[90%] px-4">
				<CreateNewAccount />
				<ImportAccount />
			</div>
		</section>
	);
}

export default AuthorizationsTab;
