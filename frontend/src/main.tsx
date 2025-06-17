import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from 'App'
import { Provider } from 'components/ui/provider'
import { Toaster } from 'components/ui/toaster'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './contexts/AuthContext'
import './i18n' // Import i18next configuration
import './index.css'

registerSW()

const MAX_RETRIES = 1
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			retry: MAX_RETRIES
		}
	}
})

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		<Provider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Toaster />
					<App />
				</AuthProvider>
			</QueryClientProvider>
		</Provider>
	)
}
