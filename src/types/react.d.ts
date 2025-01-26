import * as React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom attributes here
    dir?: string;
    className?: string;
    style?: React.CSSProperties;
  }
}

declare global {
  namespace React {
    interface SVGProps<T> extends SVGAttributes<T> {
      // Add any custom SVG attributes here
      className?: string;
      style?: React.CSSProperties;
    }
  }
} 