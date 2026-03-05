import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { format } from 'date-fns'

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Greek', 'Hebrew',
  'Yoruba', 'Swahili', 'Vietnamese', 'Thai', 'Indonesian', 'Malay'
]

const TIMEZONES = Intl.supportedValuesOf('timeZone')

export default function Onboarding() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [primaryLanguage, setPrimaryLanguage] = useState('English')
  const [targetLanguages, setTargetLanguages] = useState<string[]>([])
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (profile) {
      navigate('/dashboard')
    }
  }, [profile, navigate])

  const handleLanguageToggle = (lang: string) => {
    // Prevent selecting primary language as target
    if (lang === primaryLanguage) {
      setError('You cannot select your primary language as a target language')
      return
    }

    setTargetLanguages(prev => {
      if (prev.includes(lang)) {
        // Allow deselecting
        return prev.filter(l => l !== lang)
      } else {
        // Prevent selecting more than 5 languages
        if (prev.length >= 5) {
          setError('You can select a maximum of 5 target languages')
          return prev
        }
        return [...prev, lang]
      }
    })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!user) return

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    if (targetLanguages.length === 0) {
      setError('Please select at least one target language')
      return
    }

    if (targetLanguages.length > 5) {
      setError('You can select a maximum of 5 target languages')
      return
    }

    // Check if primary language is in target languages (shouldn't happen, but double-check)
    if (targetLanguages.includes(primaryLanguage)) {
      setError('Primary language cannot be selected as a target language')
      return
    }

    // Validate that primary language is supported
    // This only affects NEW users - existing users already have their profiles
    const supportedLanguages = ['English', 'Spanish', 'Dutch', 'Danish', 'Italian']
    if (!supportedLanguages.includes(primaryLanguage)) {
      setError('Please select a supported UI language')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        username: username.trim(),
        primary_language: primaryLanguage,
        target_languages: targetLanguages,
        timezone,
        start_date: startDate,
        is_public: isPublic,
      })

      if (error) throw error
      
      // Store language preference immediately so translations are available on next page load
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('75fluent_ui_language', primaryLanguage)
        } catch {
          // Ignore localStorage errors
        }
      }
      
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl py-4 md:py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Set up your 75 Fluent challenge preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage">Primary Language (UI Language)</Label>
                  <Select
                    id="primaryLanguage"
                    value={primaryLanguage}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                  >
                    {COMMON_LANGUAGES.map(lang => {
                      const supportedLanguages = ['English', 'Spanish', 'Dutch', 'Danish', 'Italian']
                      const isDisabled = !supportedLanguages.includes(lang)
                      return (
                        <option key={lang} value={lang} disabled={isDisabled}>
                          {lang}{isDisabled ? ' (Coming soon)' : ''}
                        </option>
                      )
                    })}
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    English, Spanish, Dutch, Danish, and Italian are currently available. More languages coming soon!
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Target Languages (Select up to 5)</Label>
                    <span className="text-sm text-muted-foreground">
                      {targetLanguages.length}/5 selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md text-sm md:text-base">
                    {COMMON_LANGUAGES.map(lang => {
                      const isSelected = targetLanguages.includes(lang)
                      const isPrimary = lang === primaryLanguage
                      const isDisabled = !isSelected && targetLanguages.length >= 5
                      const isPrimaryDisabled = isPrimary
                      
                      return (
                        <label
                          key={lang}
                          className={`flex items-center space-x-2 p-2 rounded ${
                            isPrimaryDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-accent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleLanguageToggle(lang)}
                            disabled={isPrimaryDisabled || isDisabled}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {lang}
                            {isPrimary && <span className="text-xs text-muted-foreground ml-1">(Primary)</span>}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {targetLanguages.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Please select at least one target language
                    </p>
                  )}
                </div>
                <Button onClick={() => setStep(2)} className="w-full">
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Challenge Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                  <p className="text-sm text-muted-foreground">
                    Default: Today
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Make profile public (for future leaderboard)</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                    {loading ? 'Creating...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

