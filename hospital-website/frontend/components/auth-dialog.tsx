'use client'

import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Your dialog content */}
      </DialogContent>
    </Dialog>
  );
} 