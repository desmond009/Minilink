import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { TempLinksProvider } from './context/TempLinksContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TempLinksProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TempLinksProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
