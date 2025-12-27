import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Mic, Video, BookMarked, Languages, Target } from 'lucide-react'

export default function Landing() {
  const rules = [
    {
      icon: Clock,
      title: '60 Minutes Language Study',
      description: 'Dedicate at least 60 minutes daily to structured language learning.',
    },
    {
      icon: BookOpen,
      title: 'Read 5 Pages',
      description: 'Read at least 5 pages in a book written in your target language.',
    },
    {
      icon: BookMarked,
      title: 'Track Your Study',
      description: 'Log what you studied, resources used, and key notes from your session.',
    },
    {
      icon: Mic,
      title: '5 Minutes of Speaking',
      description: 'Practice speaking for at least 5 minutes every day.',
    },
    {
      icon: Video,
      title: '1 Podcast/Video/Episode',
      description: 'Watch or listen to one episode of content in your target language.',
    },
    {
      icon: Languages,
      title: 'Journal in Target Language',
      description: 'Write a journal entry in your target language every day.',
    },
    {
      icon: Target,
      title: 'Immerse Yourself',
      description: 'Try to immerse yourself as much as possible throughout the day.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">75 Fluent</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A language learning habit challenge inspired by 75 Hard
          </p>
          <p className="text-lg mb-8">
            Build consistent language learning habits over 75 consecutive days. 
            Complete all 7 daily rules to maintain your streak and track your progress.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Start Challenge</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The 7 Rules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {rules.map((rule, index) => {
              const Icon = rule.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{rule.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{rule.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Track Daily:</strong> Log your completion of all 7 rules each day. 
                Missing any rule breaks your streak, but your history is preserved.
              </p>
              <p>
                <strong>Stay Consistent:</strong> Complete all 7 items every day for 75 consecutive days. 
                Your streak resets if you miss any rule on any day.
              </p>
              <p>
                <strong>Monitor Progress:</strong> View your stats, completion rates, and streak history 
                to stay motivated and track your language learning journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

