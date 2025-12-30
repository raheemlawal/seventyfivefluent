import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import History from '@/pages/History'
import Progress from '@/pages/Progress'
import { supabase } from '@/lib/supabase'

// Component to handle auth callbacks on any route
function AuthCallbackHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if there's a hash fragment with auth tokens
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        try {
          // Wait for Supabase to process the hash fragment
          await new Promise(resolve => setTimeout(resolve, 1000))

          const { data, error } = await supabase.auth.getSession()
          if (error) throw error

          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname)

          if (data.session) {
            // If we're on reset-password route, stay there; otherwise redirect to dashboard
            if (window.location.pathname === '/reset-password') {
              // Stay on reset password page
              return
            }
            // Otherwise, redirect to dashboard
            navigate('/dashboard', { replace: true })
          } else {
            // No session, redirect to login
            navigate('/login', { replace: true })
          }
        } catch (error) {
          console.error('Error handling auth callback:', error)
          navigate('/login', { replace: true })
        }
      }
    }

    handleAuthCallback()
  }, [navigate])

  return null
}

function AppRoutes() {
  return (
    <>
      <AuthCallbackHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
    </>
  )
}

function App() {
  useEffect(() => {
    // Handle case where Supabase redirects to /auth/callback
    // Redirect to root with hash preserved
    if (window.location.pathname === '/auth/callback' && window.location.hash) {
      window.location.href = '/' + window.location.hash
      return
    }
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
