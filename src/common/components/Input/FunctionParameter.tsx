/* eslint-disable prettier/prettier */
import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';
import { Button } from '../ui/button';
import EnvironmentInput from './EnvironmentInput';

import useEnvironments from '@/common/hooks/useEnvironments';
import { useParameters } from '@/common/hooks/useParameters';
import { SCSpecTypeMap, isKeyOfSCSpecTypeMap } from '@/common/types/invocation';

const FunctionParameterInput = ({
  control,
  index,
  onDelete,
  defaultParameters,
  setValue,
  defaultValue,
}: {
  control: Control<ParametersFormType>;
  index: number;
  onDelete?: () => void;
  setValue: UseFormSetValue<ParametersFormType>;
  defaultParameters: {
    name: string;
    type: string;
  }[];
  defaultValue: string;
}) => {
  const {
    showEnvironments,
    handleSelectEnvironment,
    handleSearchEnvironment,
    setShowEnvironments,
  } = useEnvironments();
  const { setParamValue, paramValue } = useParameters({ defaultValue });
  const valueRef = React.useRef<HTMLInputElement>(null);

  const getTypeByParameterName = (parameterName: string) => {
    return defaultParameters.find(
      (parameter) => parameter.name === parameterName,
    )?.type;
  };

  React.useEffect(() => {
    setValue(`parameters.${index}.value`, paramValue, {
      shouldDirty: true,
    });
  }, [index, paramValue, setValue]);

  const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const environmentValue = handleSelectEnvironment(e.currentTarget.id);

    if (environmentValue) {
      setParamValue((prev) => prev + `{${environmentValue}}}`);
    }
  };

  const onHandleChange = (value: string) => {
    handleSearchEnvironment(value);
    setParamValue(value);
  };

  React.useEffect(() => {
    if (valueRef.current) {
      valueRef.current.focus();
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Controller
        control={control}
        name={`parameters.${index}.name`}
        render={({ field }) => {
          const parameterType = getTypeByParameterName(field.value);
          return (
            <div className="relative flex items-center justify-between flex-1 w-full gap-4 p-2 border rounded-md min-w-[250px]">
              <span
                {...field}
                className={`select-none`}
                data-test="contract-input-address"
              >
                {field.value
                  .split('_')
                  .map((word, index) =>
                    index === 0
                      ? word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      : word.toLowerCase(),
                  )
                  .join(' ')}
              </span>
              {parameterType && isKeyOfSCSpecTypeMap(parameterType) && (
                <span className="absolute right-3 top-[10px] text-sm text-slate-400 z-auto pointer-events-none">
                  {SCSpecTypeMap[parameterType]}
                </span>
              )}
            </div>
          );
        }}
      />
      <Controller
        control={control}
        name={`parameters.${index}.value`}
        render={({ field: valueField }) => {
          return (
            <EnvironmentDropdownContainer
              handleSelect={handleSelect}
              showEnvironments={showEnvironments}
              setShowEnvironments={setShowEnvironments}
            >
              <EnvironmentInput
                value={valueField.value}
                handleChange={(value: string) => {
                  onHandleChange(value);
                  valueField.onChange(value);
                }}
                styles="h-10 text-sm rounded-md border border-input"
                placeholder="Parameter value"
                testName="function-tab-parameter-input-value"
              />
            </EnvironmentDropdownContainer>
          );
        }}
      />
      {onDelete && (
        <Button
          onClick={onDelete}
          variant={'ghost'}
          size={'icon'}
          className="min-w-[42px]"
        >
          <DeleteIcon size="20" className="text-primary" />
        </Button>
      )}
    </div>
  );
};

export default FunctionParameterInput;
