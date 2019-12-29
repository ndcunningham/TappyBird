export interface Image {
  name: string;
  source: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  destination: {
    x: number;
    y: number;
  };

  draw: (ctx: CanvasRenderingContext2D) => {};
}

// export const background: Image = {
//   name: 'background',
//   source: {
//     x: 0,
//     y: 0
//   },
//   size: {
//     width: 275,
//     height: 226
//   },
//   destination: {
//     x: 0,
//     y:
//   }

// }
