import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// import the query client
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

// useQuery: we use react query to get the data from the server
// useMutation: to manipulate the data 


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>,
)
