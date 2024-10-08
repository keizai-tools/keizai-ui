import React from 'react';

import { Environment } from '@/common/types/environment';

type IProps = {
  environments: Environment[];
  hoveredEnvironment: string;
  setHoveredEnvironment: React.Dispatch<React.SetStateAction<string>>;
  handleSelectEnvironment: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => void;
};

function EnvironmentList({
  environments,
  hoveredEnvironment,
  setHoveredEnvironment,
  handleSelectEnvironment,
}: IProps) {
  return (
    <>
      <ul
        className="overflow-hidden overflow-y-scroll w-2/5 scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
        data-test="dropdown-environments-ul-container"
      >
        {environments?.map((env: Environment) => (
          <li
            key={env.id}
            id={env.id}
            data-test="dropdown-enviroment-li-container"
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 border-b-[1px] border-r-[1px] text-xs"
            onMouseEnter={() => setHoveredEnvironment(env.value)}
            onClick={handleSelectEnvironment}
          >
            {env.name}
          </li>
        ))}
      </ul>
      <div
        className={`w-3/5 text-xs flex gap-4 border-l-[1px] ${
          environments.length > 1 ? 'p-4' : 'p-2'
        }`}
      >
        <span className="text-slate-400">VALUE</span>
        <span
          className="overflow-y-hidden truncate"
          data-test="dropdown-hover-enviroment-value"
        >
          {hoveredEnvironment}
        </span>
      </div>
    </>
  );
}

export default EnvironmentList;
