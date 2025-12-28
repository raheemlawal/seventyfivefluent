import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the hash fragment
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        
        // Clear the hash from URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname)
        }
        
        if (data.session) {
          // User is authenticated, redirect to dashboard
          navigate('/dashboard')
        } else {
          // No session, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Error handling auth callback:', error)
        navigate('/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Verifying email...</div>
    </div>
  )
}

