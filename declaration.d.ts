declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.xlsx' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}
