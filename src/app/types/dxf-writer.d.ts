declare module 'dxf-writer' {
  class DxfWriter {
    constructor();
    addRectangle(x: number, y: number, width: number, height: number): void;
    toDxfString(): string;
  }
  export default DxfWriter;
}
