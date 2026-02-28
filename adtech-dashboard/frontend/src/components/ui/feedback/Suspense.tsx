import { Suspense } from 'react';
import { LoadingState } from './LoadingState';

interface LazyPageProps {
  children: React.ReactNode;
  message?: string;
}

export function LazyPage({ children, message }: LazyPageProps) {
  return <Suspense fallback={<LoadingState message={message} />}>{children}</Suspense>;
}
