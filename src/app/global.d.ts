
// global.d.ts
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader, Group } from 'three';


  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: any[];
    cameras: any[];
    asset: object;
  }


  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void
    ): void;
  }
}


declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      ar?: boolean;
      arModes?: string;
      cameraControls?: boolean;
      shadowIntensity?: number;
      autoRotate?: boolean;
      style?: React.CSSProperties;
    };
  }
}





