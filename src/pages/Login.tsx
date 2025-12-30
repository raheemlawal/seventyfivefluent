import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthForm } from '@/components/auth/AuthForm'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">75 Fluent</h1>
          <p className="text-muted-foreground">Welcome back</p>
        </div>
        <AuthForm mode="signin" onSuccess={() => navigate('/dashboard')} />
        <div className="space-y-2">
          <p className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

