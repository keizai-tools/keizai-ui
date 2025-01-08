import { ReactNode, useState } from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

function isNameValid(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9]+$/;
  return !!name.trim() && nameRegex.test(name);
}

function NewEntityDialog({
  children,
  onSubmit,
  isLoading,
  title,
  description,
  defaultName,
  elementList,
}: Readonly<{
  children: ReactNode;
  onSubmit: ({ name }: { name: string }) => void;
  isLoading: boolean;
  title: string;
  description: string;
  defaultName: string;
  elementList?: {
    name: string;
  }[];
}>) {
  const [name, setName] = useState(defaultName);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isNameValidState, setIsNameValidState] = useState(
    isNameValid(defaultName),
  );
  const [isOpen, setIsOpen] = useState(false);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value;
    setName(newName);
    const errors = [];
    if (!newName.trim()) {
      errors.push('Name must not be empty or contain only spaces.');
    }
    if (!/^[a-zA-Z0-9]+$/.test(newName)) {
      errors.push('Name must not have special characters.');
    }
    if (elementList && elementList.some((el) => el.name === newName)) {
      errors.push('Name is already in use.');
    }
    setErrorMessages(errors);
    setIsNameValidState(errors.length === 0);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const errors = [];
    if (!name.trim()) {
      errors.push('Name must not be empty or contain only spaces.');
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      errors.push('Name must not have special characters.');
    }
    if (elementList && elementList.some((el) => el.name === name)) {
      errors.push('Name is already in use.');
    }
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }
    setErrorMessages([]);
    onSubmit({ name });
    setName(defaultName);
    setIsOpen(false);
  }

  function handleButtonClick(event: React.MouseEvent) {
    handleSubmit(event);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent
        className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
        data-test="new-entity-dialog-container"
      >
        <DialogHeader>
          <DialogTitle data-test="new-entity-dialog-title">{title}</DialogTitle>
          <DialogDescription data-test="new-entity-dialog-description">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex items-center gap-3 mt-4 space-x-2"
          data-test="new-entity-dialog-form-container"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid flex-1 gap-2">
            <Input
              value={name}
              onChange={handleNameChange}
              data-test="new-entity-dialog-input-name"
            />
            {errorMessages.length > 0 && (
              <ul className="text-sm text-red-400">
                {errorMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
          <DialogClose asChild>
            <Button
              onClick={handleButtonClick}
              size="sm"
              className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-test="new-entity-dialog-btn-submit"
              disabled={isLoading || !isNameValidState}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewEntityDialog;
