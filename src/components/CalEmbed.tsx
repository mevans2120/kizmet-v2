'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Cal = dynamic(
  () => import('@calcom/embed-react').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading calendar...</div>
      </div>
    ),
  }
)

interface CalEmbedProps {
  calLink: string
}

export function CalEmbed({ calLink }: CalEmbedProps) {
  useEffect(() => {
    import('@calcom/embed-react').then(({ getCalApi }) => {
      getCalApi().then((api) => {
        api("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#5a725c" } },
          hideEventTypeDetails: false,
        })
      })
    })
  }, [])

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  )
}
