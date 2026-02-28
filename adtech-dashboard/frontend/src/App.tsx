import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './app/store';
import { router } from './app/router';
import theme from './app/theme';
import { ErrorBoundary } from './components/ui';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
