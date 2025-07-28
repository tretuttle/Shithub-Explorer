/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'dark-mode-toggle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id?: string;
      appearance?: 'toggle' | 'switch' | 'three-way';
      permanent?: boolean;
      legend?: string;
      light?: string;
      dark?: string;
      remember?: string;
      mode?: 'light' | 'dark';
    };
  }
}

declare module 'dark-mode-toggle' {
  // This module declaration allows importing the dark-mode-toggle package
}
