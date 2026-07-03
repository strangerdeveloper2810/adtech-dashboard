import type { AlertColor } from '@mui/material';
import type { User } from '../domain/user';

// Auth store (Redux)
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// UI store (Zustand)
export interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Toast store (Zustand)
export interface Toast {
  id: string;
  message: string;
  severity: AlertColor;
}

export interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, severity?: AlertColor) => void;
  removeToast: (id: string) => void;
}
