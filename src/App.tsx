import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { AuthCallback } from '@/components/auth/AuthCallback'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import History from '@/pages/History'
import Progress from '@/pages/Progress'

function App() {
  useEffect(() => {
    // Handle hash fragments from email confirmation
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      // Redirect to callback handler, preserving the hash
      const currentPath = window.location.pathname
      if (currentPath !== '/auth/callback') {
        window.location.href = '/auth/callback' + hash
      }
    }
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
