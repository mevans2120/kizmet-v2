import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

// Fraunces font from jsDelivr CDN (fontsource)
const fontUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-700-normal.ttf'

export default async function AppleIcon() {
  // Load Fraunces font (Bold weight)
  const frauncesBold = await fetch(fontUrl).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #f0ebe4 0%, #e4dcd2 50%, #ddd4c8 100%)',
          borderRadius: '50%',
        }}
      >
        <span
          style={{
            fontFamily: 'Fraunces',
            fontSize: 100,
            fontWeight: 700,
            color: '#2d2d2d',
            lineHeight: 0.7,
            marginTop: 10,
          }}
        >
          K
        </span>
        <span
          style={{
            fontFamily: 'Fraunces',
            fontSize: 100,
            fontWeight: 700,
            color: '#5a725c',
            lineHeight: 0.7,
            marginTop: -28,
          }}
        >
          M
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Fraunces',
          data: frauncesBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
