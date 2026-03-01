// Domain
export type {
  UserRole,
  User,
  AuthTokens,
  LoginRequest,
  CampaignStatus,
  Targeting,
  Campaign,
  CampaignMetrics,
  CampaignListParams,
  DashboardOverview,
  AdType,
  Ad,
  EventType,
  AdEvent,
} from './domain';

// API
export type { ApiResponse, PaginatedResponse, PaginationMeta, ApiError } from './api';

// Store
export type { AuthState, UIState, Toast, ToastStore } from './store';

// Component props
export type {
  Column,
  DataTableProps,
  StatCardProps,
  StatusChipProps,
  ChartCardProps,
  FormFieldProps,
  SelectOption,
  SelectFieldProps,
  SearchInputProps,
  LoadingStateProps,
  TableSkeletonProps,
  EmptyStateProps,
  ErrorStateProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
  LazyPageProps,
  ConfirmDialogProps,
  PaginationProps,
  PageHeaderProps,
  ProtectedRouteProps,
} from './component';
