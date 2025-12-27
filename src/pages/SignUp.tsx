import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthForm } from '@/components/auth/AuthForm'

export default function SignUp() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">75 Fluent</h1>
          <p className="text-muted-foreground">Start your language learning journey</p>
        </div>
        <AuthForm mode="signup" onSuccess={() => navigate('/onboarding')} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

