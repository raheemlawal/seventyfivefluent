import { useDailyLogs } from '@/hooks/useDailyLogs'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Languages, Globe, UserCheck, UserX } from 'lucide-react'
import { LanguageStats } from '@/components/admin/LanguageStats'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthUsers: 0,
    usersWithProfiles: 0,
    usersWithoutProfiles: 0,
    uniqueLanguagesStudied: 0,
    uiLanguages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get auth user statistics from database function
        const { data: authStats, error: authError } = await supabase
          .rpc('get_auth_user_stats')

        if (authError) {
          console.error('Error fetching auth stats:', authError)
        }

        // Get total users from profiles table (users who completed onboarding)
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

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
            totalAuthUsers: authStats?.[0]?.total_auth_users || 0,
            usersWithProfiles: userCount || 0,
            usersWithoutProfiles: (authStats?.[0]?.total_auth_users || 0) - (userCount || 0),
            uniqueLanguagesStudied: allTargetLanguages.size,
            uiLanguages: uiLanguages.size,
          })
        } else {
          setStats({
            totalUsers: userCount || 0,
            totalAuthUsers: authStats?.[0]?.total_auth_users || 0,
            usersWithProfiles: userCount || 0,
            usersWithoutProfiles: (authStats?.[0]?.total_auth_users || 0) - (userCount || 0),
            uniqueLanguagesStudied: 0,
            uiLanguages: 0,
          })
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        setStats({
          totalUsers: 0,
          totalAuthUsers: 0,
          usersWithProfiles: 0,
          usersWithoutProfiles: 0,
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

  const usersWithoutProfiles = stats.usersWithoutProfiles

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalAuthUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">all registered accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">completed onboarding</p>
                    {usersWithoutProfiles > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        {usersWithoutProfiles} never completed onboarding
                      </p>
                    )}
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

              {/* User States Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>User States Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Total Accounts */}
                    <div className="border-b pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Total Accounts</span>
                        <span className="text-2xl font-bold">{stats.totalAuthUsers}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">All users who signed up</p>
                    </div>

                    {/* Profile Status */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Active Users</span>
                          <span className="text-lg font-bold text-green-600">{stats.usersWithProfiles}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Completed onboarding</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          These users have created profiles and can use the full app.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Inactive Users</span>
                          <span className="text-lg font-bold text-orange-600">{usersWithoutProfiles}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Never completed onboarding</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          These users signed up but never finished the onboarding process.
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-3 bg-muted/30 p-3 rounded-md">
                      <p className="text-xs font-medium mb-2">Summary:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• {stats.totalAuthUsers} total accounts created</p>
                        <p>• {stats.usersWithProfiles} active users ({Math.round((stats.usersWithProfiles / stats.totalAuthUsers) * 100) || 0}% completion rate)</p>
                        <p>• {usersWithoutProfiles} inactive users ({Math.round((usersWithoutProfiles / stats.totalAuthUsers) * 100) || 0}% never completed onboarding)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <LanguageStats />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
