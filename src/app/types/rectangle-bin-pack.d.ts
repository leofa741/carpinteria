declare module 'rectangle-bin-pack' {
  export class MaxRectsPacker {
    constructor(width: number, height: number, padding: number, options?: any);
    add(width: number, height: number, data?: any): void;
    bins: Array<{
      width: number;
      height: number;
      items: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        data: any;
      }>
    }>;
  }
}
