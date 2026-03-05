import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { supabase } from '@/lib/supabase'

// Lazy load pages for code splitting
const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const SignUp = lazy(() => import('@/pages/SignUp'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const History = lazy(() => import('@/pages/History'))
const Progress = lazy(() => import('@/pages/Progress'))
const Library = lazy(() => import('@/pages/Library'))
const Settings = lazy(() => import('@/pages/Settings'))
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))

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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
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
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
