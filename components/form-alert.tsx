import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

export interface FormAlertProps {
  message?: string;
  canClose?: boolean;
  type?: 'success' | 'error' | 'warning' | 'unknown';
}

/**
 * @description A form alert
 * @param {FormAlertProps} props The form properties
 */
export const FormAlert = ({
  message,
  type = 'unknown',
  canClose = true,
}: FormAlertProps) => {
  const [visible, setVisible] = useState(true);
  if (!message || !visible) {
    return null;
  }

  const Icon = type === 'success' ? CheckCircledIcon : ExclamationTriangleIcon;
  let bgColor = type === 'success' ? 'bg-emerald-500/15' : 'bg-destructive/15';
  let fgColor = 'text-black';

  if (type === 'warning') {
    bgColor = 'bg-amber-300/30';
  } else if (type === 'unknown') {
    bgColor = 'bg-black/15';
  } else if (type === 'error') {
    fgColor = 'text-destructive';
  } else if (type === 'success') {
    fgColor = 'text-emerald-500';
  }

  return (
    <div
      className={`relative flex items-center gap-x-2 rounded-md ${bgColor} p-3 text-sm ${fgColor}`}
    >
      <Icon className="h-4 w-4" />
      <p>{message}</p>
      {canClose && (
        <button
          type="button"
          className="absolute right-0 top-0 mr-1 mt-1 bg-transparent font-semibold leading-none text-gray-400 outline-none hover:text-gray-500 focus:outline-none"
          onClick={() => {
            setVisible(false);
          }}
          title="Hide alert message"
        >
          <span>×</span>
        </button>
      )}
    </div>
  );
};
