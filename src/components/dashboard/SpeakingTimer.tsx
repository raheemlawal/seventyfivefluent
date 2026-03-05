import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'
import { Play, Pause, Square } from 'lucide-react'

interface SpeakingTimerProps {
  done: boolean
  onDoneChange: (done: boolean) => void
}

export function SpeakingTimer({ done, onDoneChange }: SpeakingTimerProps) {
  const { t } = useTranslation()
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goalSeconds = 5 * 60 // 5 minutes

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          if (newSeconds >= goalSeconds) {
            setIsRunning(false)
            onDoneChange(true)
            return goalSeconds
          }
          return newSeconds
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, goalSeconds, onDoneChange])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setSeconds(0)
    setIsRunning(false)
    onDoneChange(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t.minutesOfSpeaking}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="speaking-done"
                checked={done}
                onCheckedChange={(checked) => {
                  onDoneChange(checked === true)
                  if (checked) {
                    setIsRunning(false)
                  }
                }}
              />
              <Label htmlFor="speaking-done" className="cursor-pointer">
                {t.done}
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-mono text-center">
              {formatTime(seconds)} / {formatTime(goalSeconds)}
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
                disabled={done || seconds >= goalSeconds}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={seconds === 0}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

