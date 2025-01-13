import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyThemeClass } from './lib/utils.ts';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';
import { useThemeStore } from './store/theme-store.ts';

import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

function Main() {
  const { theme } = useThemeStore();
  applyThemeClass(theme);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <App />
          </ThirdwebProvider>          
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Main />
);