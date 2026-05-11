import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink-black/60 backdrop-blur-sm animate-fade-in-up" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-canvas rounded-[28px] p-8 w-full max-w-md max-h-[90vh] overflow-y-auto',
            'shadow-[0px_24px_64px_rgba(69,36,219,0.3)]',
            'animate-fade-in-up',
            'focus:outline-none',
            className
          )}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              {title && (
                <Dialog.Title className="text-body-lg font-semibold text-ink-black mb-1">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-body-sm text-muted-text">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-full hover:bg-subtle-gray transition-all duration-200 active:scale-[0.95]"
                aria-label="Close"
              >
                <X size={20} className="text-ink-black" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}