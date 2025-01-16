import { Eye, EyeOff, Lock } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import { Input } from '../ui/input';

interface IPropsPassword {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  styles?: string;
  placeholder?: string;
  darkMode?: boolean;
}

function PasswordInput({
  value,
  styles,
  onChange,
  placeholder = 'Password',
  darkMode = false,
}: IPropsPassword) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`flex items-center border-2 px-3 rounded-md ${
        darkMode ? 'bg-background text-white' : 'bg-white text-black'
      } ${styles}`}
    >
      <Lock
        className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-400'}`}
      />
      <Input
        className={`pl-2 ${
          darkMode ? 'bg-background text-white' : 'bg-white text-black'
        } border-none focus-visible:ring-0`}
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-test="form-input-password"
      />
      <div>
        {showPassword ? (
          <EyeOff
            className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-black'}`}
            onClick={toggleShowPassword}
          />
        ) : (
          <Eye
            className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-black'}`}
            onClick={toggleShowPassword}
          />
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
