import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { userService } from '@/modules/user/services/user.service';

function SelectInterval({
  interval,
  setInterval,
}: Readonly<{
  interval: number | null;
  setInterval: (interval: number) => void;
}>) {
  const [fargateTime, setFargateTime] = useState<number | null>(null);
  const [costPerMinute, setCostPerMinute] = useState<number | null>(null);

  const [totalCost, setTotalCost] = useState<number | null>(null);

  useEffect(() => {
    const fetchFargateTime = async () => {
      try {
        const response = await userService.getFargateTime();

        setFargateTime(response.payload.fargateTime);
      } catch (error) {
        console.error('Error fetching Fargate time:', error);
      }
    };

    fetchFargateTime();
  }, []);

  useEffect(() => {
    const fetchPricePerMinute = async () => {
      try {
        const response = await userService.getPricePerMinute();
        setCostPerMinute(response.payload.costPerMinute);
      } catch (error) {
        console.error('Error fetching price per minute:', error);
      }
    };

    fetchPricePerMinute();
  }, []);

  const handleIntervalChange = (selectedInterval: string) => {
    const interval = Number(selectedInterval);
    setInterval(interval);
    if (costPerMinute) {
      const cost = interval * costPerMinute;
      setTotalCost(cost);
    }
  };

  const availableIntervals = [1, 5, 10, 15, 30, 60].filter(
    (value) => fargateTime !== null && value <= fargateTime,
  );

  return (
    <div>
      {fargateTime !== null && fargateTime < 5 ? (
        <p className="text-sm text-red-400">
          You do not have a sufficient minimum balance to select an interval.
        </p>
      ) : (
        <div className="flex items-center space-x-4">
          <Select
            value={interval !== null ? String(interval) : 'Select an interval'}
            onValueChange={handleIntervalChange}
          >
            <SelectTrigger
              className="w-auto gap-2 px-4 py-3 font-bold border-2 rounded-md shadow-md border-slate-900 text-slate-400 focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus:ring-transparent"
              data-test="interval-select-trigger"
            >
              <SelectValue
                aria-label={
                  interval !== null ? String(interval) : 'Select an interval'
                }
                data-test="interval-select-value"
                className="flex items-center justify-between"
              >
                {interval !== null
                  ? `${interval} minutes`
                  : 'Select an interval'}
              </SelectValue>
            </SelectTrigger>

            <SelectContent
              data-test="interval-select-content"
              className="w-full mt-2 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
            >
              {availableIntervals.map((value) => (
                <SelectItem
                  key={value}
                  value={String(value)}
                  data-test={`interval-select-item-${value}`}
                  className="transition-colors duration-200 cursor-pointer text-slate-700"
                >
                  {`${value} minutes`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {totalCost !== null && (
            <div className="text-sm font-semibold text-slate-400">
              Cost for this interval: ${totalCost.toFixed(3)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectInterval;
