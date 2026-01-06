import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "@/components/common/ThemeProvider"
import appBootstrap from './bootstrap/appBootstrap.ts'
import LiveKitProvider from './providers/LiveKitProvider.tsx'

await appBootstrap().catch((err) => console.log(err));

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LiveKitProvider>
            <App />
          </LiveKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
