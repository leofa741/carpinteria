// types/binpacking.d.ts
declare module 'binpacking' {
  export interface Item {
    w: number;
    h: number;
  }

  export interface Bin {
    width: number;
    height: number;
    items: { x: number; y: number; item: Item }[];
  }

  export function pack(items: Item[], binWidth: number, binHeight: number): Bin[];
}