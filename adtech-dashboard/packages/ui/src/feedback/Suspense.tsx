import { Suspense } from 'react';
import { LoadingState } from './LoadingState';
import type { LazyPageProps } from '@adtech/types';

export function LazyPage({ children, message }: LazyPageProps) {
  return <Suspense fallback={<LoadingState message={message} />}>{children}</Suspense>;
}
