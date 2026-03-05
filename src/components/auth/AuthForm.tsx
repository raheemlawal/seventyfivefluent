import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const redirectUrl = window.location.origin
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        })
        if (error) throw error
        // Show success message instead of redirecting immediately
        setSignupSuccess(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signup' ? 'Sign Up' : 'Login'}</CardTitle>
        <CardDescription>
          {mode === 'signup'
            ? 'Create an account to start your 75 Fluent challenge'
            : 'Enter your credentials to continue'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {signupSuccess ? (
          <div className="space-y-4">
            <div className="text-sm bg-primary/10 text-primary p-4 rounded-md border border-primary/20">
              <p className="font-medium mb-2">Check your email!</p>
              <p>
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please click the link in the email to verify your account and continue.
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>Didn't receive the email?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email address</li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSignupSuccess(false)
                setEmail('')
                setPassword('')
              }}
            >
              Back to Sign Up
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

