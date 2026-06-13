'use client'

import { useEffect } from 'react'

interface ProductViewer3DProps {
  src: string
  alt: string
}

export function ProductViewer3D({ src, alt }: ProductViewer3DProps) {
  useEffect(() => {
    // Load the web component only client-side to prevent SSR issues
    import('@google/model-viewer')
  }, [])

  return (
    <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
      <model-viewer
        src={src}
        alt={alt}
        camera-controls=""
        auto-rotate=""
        ar=""
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
