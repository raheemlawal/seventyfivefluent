import { useDailyLogs } from '@/hooks/useDailyLogs'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Languages, Globe } from 'lucide-react'
import { LanguageStats } from '@/components/admin/LanguageStats'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthUsers: 0,
    uniqueLanguagesStudied: 0,
    uiLanguages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total users from profiles table (users who completed onboarding)
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Get total auth users (all users who signed up, including those who didn't complete onboarding)
        // Note: This requires querying auth.users which may not be accessible via RLS
        // For now, we'll just show profiles count and note the difference

        // Get all profiles to analyze languages
        const { data: profiles } = await supabase
          .from('profiles')
          .select('target_languages, primary_language')

        if (profiles) {
          // Count unique languages studied (from target_languages arrays)
          const allTargetLanguages = new Set<string>()
          profiles.forEach(profile => {
            if (profile.target_languages && Array.isArray(profile.target_languages)) {
              profile.target_languages.forEach((lang: string) => {
                if (lang) allTargetLanguages.add(lang)
              })
            }
          })

          // Count unique UI languages (from primary_language)
          const uiLanguages = new Set<string>()
          profiles.forEach(profile => {
            if (profile.primary_language) {
              uiLanguages.add(profile.primary_language)
            }
          })

          setStats({
            totalUsers: userCount || 0,
            totalAuthUsers: userCount || 0, // Will be updated if we can access auth.users
            uniqueLanguagesStudied: allTargetLanguages.size,
            uiLanguages: uiLanguages.size,
          })
        } else {
          setStats({
            totalUsers: userCount || 0,
            totalAuthUsers: userCount || 0,
            uniqueLanguagesStudied: 0,
            uiLanguages: 0,
          })
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      setStats({
        totalUsers: 0,
        totalAuthUsers: 0,
        uniqueLanguagesStudied: 0,
        uiLanguages: 0,
      })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Analytics</h2>
            <p className="text-muted-foreground">
              Overview of platform usage and language statistics
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">users with profiles</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      (Note: Only counts users who completed onboarding. Check Supabase Auth for all registered users.)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">Languages Studied</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.uniqueLanguagesStudied}</div>
                    <p className="text-xs text-muted-foreground mt-1">unique target languages</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">UI Languages</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.uiLanguages}</div>
                    <p className="text-xs text-muted-foreground mt-1">unique UI languages</p>
                  </CardContent>
                </Card>
              </div>

              <LanguageStats />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
