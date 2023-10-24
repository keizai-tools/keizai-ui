import { Eye, EyeOff, Lock } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import { Input } from '../ui/input';

interface IPropsPassword {
	value: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	styles?: string;
	placeholder?: string;
}

function PasswordInput({
	value,
	styles,
	onChange,
	placeholder = 'Password',
}: IPropsPassword) {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div
			className={`flex items-center border-2 px-3 rounded-md bg-white ${styles}`}
		>
			<Lock className="h-5 w-5 text-gray-400" />
			<Input
				className="pl-2 border-none focus-visible:ring-0 bg-white text-black"
				type={showPassword ? 'text' : 'password'}
				name="password"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				data-test="form-input-password"
			/>
			<div>
				{showPassword ? (
					<EyeOff className="h-5 w-5 text-black" onClick={toggleShowPassword} />
				) : (
					<Eye className="h-5 w-5 text-black" onClick={toggleShowPassword} />
				)}
			</div>
		</div>
	);
}

export default PasswordInput;
