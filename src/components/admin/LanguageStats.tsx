import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LanguageCount {
  language: string
  count: number
}

export function LanguageStats() {
  const [topTargetLanguages, setTopTargetLanguages] = useState<LanguageCount[]>([])
  const [topUILanguages, setTopUILanguages] = useState<LanguageCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLanguageStats() {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('target_languages, primary_language')

        if (profiles) {
          // Count target languages
          const targetLanguageCounts: Record<string, number> = {}
          profiles.forEach(profile => {
            if (profile.target_languages && Array.isArray(profile.target_languages)) {
              profile.target_languages.forEach((lang: string) => {
                if (lang) {
                  targetLanguageCounts[lang] = (targetLanguageCounts[lang] || 0) + 1
                }
              })
            }
          })

          // Count UI languages
          const uiLanguageCounts: Record<string, number> = {}
          profiles.forEach(profile => {
            if (profile.primary_language) {
              uiLanguageCounts[profile.primary_language] = (uiLanguageCounts[profile.primary_language] || 0) + 1
            }
          })

          // Sort and get top 10
          const topTarget = Object.entries(targetLanguageCounts)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

          const topUI = Object.entries(uiLanguageCounts)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

          setTopTargetLanguages(topTarget)
          setTopUILanguages(topUI)
        }
      } catch (error) {
        console.error('Error fetching language stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLanguageStats()
  }, [])

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading language stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Target Languages</CardTitle>
        </CardHeader>
        <CardContent>
          {topTargetLanguages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <div className="space-y-2">
              {topTargetLanguages.map((item) => (
                <div key={item.language} className="flex items-center justify-between">
                  <span className="text-sm">{item.language}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top UI Languages</CardTitle>
        </CardHeader>
        <CardContent>
          {topUILanguages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <div className="space-y-2">
              {topUILanguages.map((item) => {
                const supportedLanguages = ['English', 'Spanish', 'Dutch', 'Danish', 'Italian']
                const isSupported = supportedLanguages.includes(item.language)
                return (
                  <div key={item.language} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.language}</span>
                      {!isSupported && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                          Legacy
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                )
              })}
              {topUILanguages.some(item => !['English', 'Spanish', 'Dutch', 'Danish', 'Italian'].includes(item.language)) && (
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  Note: Legacy languages are from before UI language support was expanded.
                  These users see English as fallback in the app.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
