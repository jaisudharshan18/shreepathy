// Type declaration for the <model-viewer> custom element from @google/model-viewer.
// Augments React.JSX.IntrinsicElements so TypeScript recognises the custom element in JSX.
import * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        'camera-controls'?: boolean | ''
        'auto-rotate'?: boolean | ''
        ar?: boolean | ''
      }
    }
  }
}
