import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, XCircle, Loader2, Edit2, RotateCcw } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'

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
  const [showRestartDialog, setShowRestartDialog] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [uiLanguage, setUiLanguage] = useState('')
  const [targetLanguages, setTargetLanguages] = useState<string[]>([])
  const [savingInfo, setSavingInfo] = useState(false)

  const COMMON_LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish',
    'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Greek', 'Hebrew',
    'Yoruba', 'Swahili', 'Vietnamese', 'Thai', 'Indonesian', 'Malay'
  ]

  const SUPPORTED_UI_LANGUAGES = ['English', 'Spanish', 'Dutch', 'Danish', 'Italian']

  // Initialize username from profile
  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username)
    }
  }, [profile?.username])

  // Initialize UI language and target languages from profile
  useEffect(() => {
    if (profile?.primary_language) {
      setUiLanguage(profile.primary_language)
    }
    if (profile?.target_languages) {
      setTargetLanguages(profile.target_languages)
    }
  }, [profile?.primary_language, profile?.target_languages])

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

  const handleRestartAccount = async () => {
    if (!profile) return

    setRestarting(true)
    setError(null)

    try {
      // Delete all daily logs for this user
      const { error: deleteError } = await supabase
        .from('daily_logs')
        .delete()
        .eq('user_id', profile.id)

      if (deleteError) throw deleteError

      // Reset streak stats and update start_date to today
      const today = format(new Date(), 'yyyy-MM-dd')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          current_streak: 0,
          longest_streak: 0,
          total_completed: 0,
          start_date: today,
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      // Close dialog and refresh
      setShowRestartDialog(false)
      // Reload the page to refresh all data
      window.location.reload()
    } catch (err: any) {
      console.error('Error restarting account:', err)
      setError(err.message || 'Failed to restart account. Please try again.')
    } finally {
      setRestarting(false)
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

        <div className="space-y-4">
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t.profile}</CardTitle>
                <CardDescription>
                  Manage your profile settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t.username}</Label>
              <p className="text-xs text-muted-foreground">
                Your username must be unique and 3-20 characters long.
              </p>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setSuccess(false)
                    }}
                    placeholder={t.usernamePlaceholder}
                    className={`${!isEditing ? 'pr-24' : 'pr-10'} ${
                      isEditing && usernameStatus === 'available' && isUsernameChanged
                        ? 'border-green-500'
                        : isEditing && usernameStatus === 'unavailable'
                        ? 'border-red-500'
                        : ''
                    }`}
                    disabled={!isEditing || saving}
                  />
                  {isEditing && (
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
                  )}
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex-shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {t.edit}
                  </Button>
                )}
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

        <Card>
          <CardHeader>
            <CardTitle>{t.info}</CardTitle>
            <CardDescription>
              Manage your UI language and target languages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uiLanguage">{t.uiLanguage}</Label>
              <div className="flex gap-2 items-center">
                <Select
                  id="uiLanguage"
                  value={uiLanguage}
                  onChange={(e) => setUiLanguage(e.target.value)}
                  disabled={!isEditingInfo || savingInfo}
                  className="flex-1"
                >
                  {SUPPORTED_UI_LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
                {!isEditingInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingInfo(true)}
                    className="flex-shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {t.edit}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.targetLanguages}</Label>
              <p className="text-xs text-muted-foreground">
                Select up to 5 languages you're learning
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md text-sm">
                {COMMON_LANGUAGES.map(lang => {
                  const isSelected = targetLanguages.includes(lang)
                  const isPrimary = lang === uiLanguage
                  const isDisabled = !isSelected && targetLanguages.length >= 5
                  const isPrimaryDisabled = isPrimary
                  
                  return (
                    <label
                      key={lang}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-accent ${
                        isPrimaryDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isPrimaryDisabled) return
                          if (isDisabled) return
                          setTargetLanguages(prev => {
                            if (prev.includes(lang)) {
                              return prev.filter(l => l !== lang)
                            } else {
                              return [...prev, lang]
                            }
                          })
                        }}
                        disabled={isPrimaryDisabled || isDisabled || !isEditingInfo || savingInfo}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {lang}
                        {isPrimary && <span className="text-xs text-muted-foreground ml-1">(UI)</span>}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {targetLanguages.length}/5 selected
              </p>
            </div>

            {isEditingInfo && (
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    if (!profile) return

                    // Validate
                    if (targetLanguages.length === 0) {
                      setError('Please select at least one target language')
                      return
                    }

                    if (targetLanguages.length > 5) {
                      setError('You can select a maximum of 5 target languages')
                      return
                    }

                    if (targetLanguages.includes(uiLanguage)) {
                      setError('UI language cannot be selected as a target language')
                      return
                    }

                    setSavingInfo(true)
                    setError(null)

                    try {
                      await updateProfile({
                        primary_language: uiLanguage,
                        target_languages: targetLanguages,
                      })
                      
                      // Update localStorage if UI language changed
                      if (uiLanguage !== profile.primary_language && typeof window !== 'undefined') {
                        try {
                          localStorage.setItem('75fluent_ui_language', uiLanguage)
                        } catch {
                          // Ignore localStorage errors
                        }
                      }

                      setIsEditingInfo(false)
                      // Reload page to apply new UI language
                      if (uiLanguage !== profile.primary_language) {
                        window.location.reload()
                      }
                    } catch (err: any) {
                      console.error('Error updating languages:', err)
                      setError(err.message || 'Failed to update languages. Please try again.')
                    } finally {
                      setSavingInfo(false)
                    }
                  }}
                  disabled={savingInfo}
                  className="flex-1 md:flex-initial"
                >
                  {savingInfo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.saving}
                    </>
                  ) : (
                    t.save
                  )}
                </Button>
                <Button
                  onClick={() => {
                    if (profile?.primary_language) {
                      setUiLanguage(profile.primary_language)
                    }
                    if (profile?.target_languages) {
                      setTargetLanguages(profile.target_languages)
                    }
                    setIsEditingInfo(false)
                    setError(null)
                  }}
                  variant="outline"
                  disabled={savingInfo}
                  className="flex-1 md:flex-initial"
                >
                  {t.cancel}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.restartAccount}</CardTitle>
            <CardDescription>
              {t.restartAccountDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowRestartDialog(true)}
              className="w-full md:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.restartAccountButton}
            </Button>
          </CardContent>
        </Card>
        </div>

        {/* Restart Account Confirmation Dialog */}
        <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.restartAccount}</DialogTitle>
              <DialogDescription>
                {t.restartAccountConfirm}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-destructive">
                {t.restartAccountWarning}
              </p>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRestartDialog(false)}
                disabled={restarting}
              >
                {t.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRestartAccount}
                disabled={restarting}
              >
                {restarting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.restartAccountButton}
                  </>
                ) : (
                  t.restartAccountButton
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
