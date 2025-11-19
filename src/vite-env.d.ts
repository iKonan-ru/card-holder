/// <reference types="vite/client" />

declare module '*.svg?react' {
  import { type FC, type SVGProps } from 'react';

  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
