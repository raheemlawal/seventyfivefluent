import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, XCircle, Loader2, Edit2 } from 'lucide-react'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export default function Settings() {
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize username from profile
  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username)
    }
  }, [profile?.username])

  // Reset to original username when canceling edit
  const handleCancelEdit = () => {
    if (profile?.username) {
      setUsername(profile.username)
    }
    setIsEditing(false)
    setUsernameStatus('idle')
    setError(null)
    setSuccess(false)
  }

  // Check username availability
  const checkUsernameAvailability = async (newUsername: string) => {
    if (!isEditing) return // Don't check if not in edit mode
    
    if (!newUsername.trim()) {
      setUsernameStatus('idle')
      return
    }

    // If username hasn't changed, mark as available
    if (newUsername.trim() === profile?.username) {
      setUsernameStatus('available')
      return
    }

    // Validate username format (alphanumeric, underscore, hyphen, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(newUsername.trim())) {
      setUsernameStatus('error')
      setError('Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens')
      return
    }

    setUsernameStatus('checking')
    setError(null)

    try {
      const { data, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername.trim())
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      if (data && data.id !== profile?.id) {
        // Username is taken by another user
        setUsernameStatus('unavailable')
        setError(null)
      } else {
        // Username is available (either not found, or it's the current user's username)
        setUsernameStatus('available')
        setError(null)
      }
    } catch (err: any) {
      console.error('Error checking username:', err)
      setUsernameStatus('error')
      setError('Failed to check username availability. Please try again.')
    }
  }

  // Debounced username check
  useEffect(() => {
    if (!isEditing) return
    
    const timer = setTimeout(() => {
      if (username !== profile?.username) {
        checkUsernameAvailability(username)
      }
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [username, isEditing])

  const handleSave = async () => {
    if (!profile) return

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    if (username.trim() === profile.username) {
      setIsEditing(false)
      setError(null)
      return
    }

    if (usernameStatus !== 'available') {
      setError('Please choose an available username')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile({ username: username.trim() })
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error updating username:', err)
      setError(err.message || 'Failed to update username. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
      </AppLayout>
    )
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-8 text-muted-foreground">No profile found</div>
      </AppLayout>
    )
  }

  const isUsernameChanged = username.trim() !== profile.username
  const canSave = isEditing && isUsernameChanged && usernameStatus === 'available' && !saving

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.settingsTitle}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t.settingsDescription}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t.username}</CardTitle>
                <CardDescription>
                  Your username must be unique and 3-20 characters long.
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {t.edit}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t.username}</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setSuccess(false)
                  }}
                  placeholder={t.usernamePlaceholder}
                  className={`pr-10 ${
                    isEditing && usernameStatus === 'available' && isUsernameChanged
                      ? 'border-green-500'
                      : isEditing && usernameStatus === 'unavailable'
                      ? 'border-red-500'
                      : ''
                  }`}
                  disabled={!isEditing || saving}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {usernameStatus === 'available' && isUsernameChanged && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {usernameStatus === 'unavailable' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Status messages */}
              {isEditing && usernameStatus === 'checking' && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t.usernameChecking}
                </p>
              )}
              {isEditing && usernameStatus === 'available' && isUsernameChanged && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {t.usernameAvailable}
                </p>
              )}
              {isEditing && usernameStatus === 'unavailable' && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {t.usernameUnavailable}
                </p>
              )}
              {isEditing && usernameStatus === 'error' && error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
              {success && (
                <p className="text-xs text-green-600">Username updated successfully!</p>
              )}
            </div>

            {error && !usernameStatus && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex-1 md:flex-initial"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.savingUsername}
                    </>
                  ) : (
                    t.save
                  )}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  disabled={saving}
                  className="flex-1 md:flex-initial"
                >
                  {t.cancel}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
