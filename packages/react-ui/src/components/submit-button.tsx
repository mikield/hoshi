'use client';

import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { type ComponentProps } from 'react';

const useFormStatus = (ReactDOM as any).useFormStatus as () => {
  pending: boolean;
  action: ((formData: FormData) => void | Promise<void>) | null;
};
const useActionState = (React as any).useActionState as <S>(
  action: (state: S, formData: FormData) => Promise<S>,
  initialState: S,
) => [S, (formData: FormData) => void];
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { AlertTriangle } from 'lucide-react';

type Props = Omit<ComponentProps<typeof Button>, 'formAction'> & {
  pendingText?: string;
  formAction: (prevState: any, formData: FormData) => Promise<any>;
  errorMessage?: string;
};

const initialState = {
  message: '',
};

export function SubmitButton({
  children,
  formAction,
  errorMessage,
  pendingText = 'Submitting...',
  ...props
}: Props) {
  const { pending, action } = useFormStatus();
  const [state, internalFormAction] = useActionState(formAction, initialState);

  const isPending = pending && action === internalFormAction;

  return (
    <div className="flex flex-col gap-y-4 w-full">
      {Boolean(errorMessage || state?.message) && (
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage || state?.message}</AlertDescription>
        </Alert>
      )}
      <div>
        <Button
          {...props}
          type="submit"
          aria-disabled={pending}
          formAction={internalFormAction as unknown as string}
        >
          {isPending ? pendingText : children}
        </Button>
      </div>
    </div>
  );
}
