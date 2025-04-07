import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import store from '@/redux/store/store'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'

createRoot(document.getElementById('root')).render(
 
    <SidebarProvider>
      <Provider store={store}>
        <App />
      </Provider>
      <Toaster />
    </SidebarProvider>
 ,
)
