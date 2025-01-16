import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Loader } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import InvocationByCollectionPage from '../invocation/InvocationByCollectionPage';

import Terminal from '@/common/components/ui/Terminal';
import { Button } from '@/common/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { useToast } from '@/common/components/ui/use-toast';
import { useEphemeralProvider } from '@/common/context/useEphemeralContext';
import { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import useInvocations from '@/modules/invocation/hooks/useInvocations';
import { InvocationService } from '@/modules/invocation/services/invocation.service';
import { EnvironmentProvider } from '@/providers/environmentProvider';

function SortableItem({
  id,
  children,
}: Readonly<{ id: string; children: React.ReactNode }>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isDragging && isFading) {
      const timeout = setTimeout(() => {
        setIsFading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isDragging, isFading]);

  useEffect(() => {
    if (isDragging) {
      setIsFading(true);
    }
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-colors duration-1000 ${
        isDragging || isFading ? 'bg-slate-800' : ''
      }`}
    >
      {children}
    </div>
  );
}

export default function InvocationByCollection() {
  const [invocations, setInvocations] = useState<Invocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { collectionId } = useParams<{ collectionId: string }>();
  const { wallet, connectWallet } = useAuthProvider();
  const { toast } = useToast();
  const { status: ephemeralStatus } = useEphemeralProvider();

  const [executionMode, setExecutionMode] = useState<'parallel' | 'sequential'>(
    'parallel',
  );

  const {
    contractResponses,
    handleRunInvocationSequential,
    isRunningInvocation,
    handleRunInvocationParallel,
    clearContractResponses,
  } = useInvocations(
    invocations,
    wallet,
    connectWallet,
    ephemeralStatus.status,
  );

  useEffect(() => {
    const fetchInvocations = async () => {
      if (!collectionId) return;

      try {
        const invocationService = new InvocationService(collectionId);
        const response = await invocationService.getInvocationByCollectionId();
        const savedOrder = JSON.parse(
          localStorage.getItem('invocationsOrder') || '[]',
        );
        if (savedOrder.length) {
          response.sort(
            (a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id),
          );
        }
        setInvocations(response);
      } catch (err) {
        setError('Failed to fetch invocations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvocations();
  }, [collectionId]);

  const filteredInvocations = useMemo(() => {
    if (ephemeralStatus.status === 'STOPPED') {
      return invocations.filter(
        (invocation) => invocation.network !== NETWORK.EPHEMERAL,
      );
    }
    return invocations;
  }, [invocations, ephemeralStatus.status]);

  const handleExecution = () => {
    if (executionMode === 'parallel') {
      handleRunInvocationParallel();
    } else {
      handleRunInvocationSequential();
    }
  };

  const handleClearConsole = () => {
    clearContractResponses();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setInvocations((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = () => {
    const order = invocations.map((invocation) => invocation.id);
    localStorage.setItem('invocationsOrder', JSON.stringify(order));
    toast({
      title: 'Order saved',
      description: 'The order of invocations has been saved.',
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  return (
    <EnvironmentProvider>
      <main className="relative flex flex-col justify-between w-full max-h-screen gap-6 p-4 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center flex-1 w-full h-full">
            <Loader className="animate-spin" size="36" />
          </div>
        ) : error ? (
          <div
            className="flex flex-wrap items-center justify-center w-full h-full gap-12"
            data-test="collection-empty-invocation-container"
          >
            <img
              src="/no_result.svg"
              width={400}
              height={400}
              alt="No invocation selected"
              className="transition-transform duration-400 transform hover:scale-110"
            />
            <div data-test="collection-empty-invocation-description">
              <h1 className="text-2xl text-primary">
                Before running the Collection Runner,
              </h1>
              <h3 className="text-xl text-slate-400">
                please create an invocation, select the method, and ensure all
                arguments are complete.
              </h3>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredInvocations.map((invocation) => invocation.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between p-4">
                  <h2 className="text-lg font-bold">Collection Runner</h2>
                  <div className="flex items-center justify-end space-x-4">
                    <Button
                      variant="outline"
                      className="py-3 font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={handleSaveOrder}
                    >
                      Save Order
                    </Button>
                    <Select
                      value={executionMode}
                      onValueChange={(e) =>
                        setExecutionMode(e as 'sequential' | 'parallel')
                      }
                    >
                      <SelectTrigger
                        className="w-auto gap-2 px-4 py-3 font-bold text-white border-2 rounded-md shadow-md focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus:ring-transparent"
                        data-test="execution-mode-select-trigger"
                      >
                        <SelectValue
                          aria-label={executionMode}
                          data-test="execution-mode-selected-value"
                          className="flex items-center justify-between"
                        >
                          {executionMode.slice(0, 1).toUpperCase() +
                            executionMode.slice(1)}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent
                        data-test="execution-mode-select-content"
                        className="w-full mt-2 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <SelectItem
                          value="parallel"
                          data-test="execution-mode-select-item-parallel"
                          className="text-white transition-colors duration-200 cursor-pointer"
                        >
                          Parallel
                        </SelectItem>
                        <SelectItem
                          value="sequential"
                          data-test="execution-mode-select-item-sequential"
                          className="text-white transition-colors duration-200 cursor-pointer"
                        >
                          Sequential
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="py-3 font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={handleExecution}
                      disabled={isRunningInvocation}
                    >
                      {!isRunningInvocation ? (
                        executionMode === 'sequential' ? (
                          'Run All Sequential'
                        ) : (
                          'Run All Parallel'
                        )
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader
                            className="w-auto font-bold animate-spin"
                            size="16"
                          />
                          <p>Running</p>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {filteredInvocations?.map((invocation) => (
                    <SortableItem key={invocation.id} id={invocation.id}>
                      <InvocationByCollectionPage invocation={invocation} />
                    </SortableItem>
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
        <Terminal
          entries={contractResponses}
          onClear={handleClearConsole}
          showClearButton={true}
        />
        <Outlet />
      </main>
    </EnvironmentProvider>
  );
}
