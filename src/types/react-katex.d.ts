declare module 'react-katex' {
  import * as React from 'react';

  interface KaTeXProps {
    math?: string;
    children?: string;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: any;
  }

  export class InlineMath extends React.Component<KaTeXProps> {}
  export class BlockMath extends React.Component<KaTeXProps> {}
}
