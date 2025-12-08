declare module 'maxrects-packer' {
  export class MaxRectsPacker {
    constructor(width: number, height: number, padding?: number, options?: any);
    add(width: number, height: number, data?: any): void;
    bins: Array<{
      width: number;
      height: number;
      rects: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        data: any;
      }>
    }>;
  }
}
