import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserProvider.jsx'

import router from './router.jsx'
import './index.css'
import './pdf-safe.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </StrictMode>,
)
