import { ElementHandle } from 'playwright';

import NmriumPage from '../NmriumPage';

interface Options {
  steps?: number;
}

interface XOptions extends Options {
  axis: 'X';
  startX: number;
  endX: number;
}

interface YOptions extends Options {
  axis: 'Y';
  startY: number;
  endY: number;
}

interface XYOptions extends Options {
  axis: 'XY';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

async function getBoundary(
  element: ElementHandle<SVGElement | HTMLElement>,
  options: XOptions | XYOptions | YOptions,
): Promise<{ x1: number; x2: number; y1: number; y2: number }> {
  // get the bounding box {x,y,width,hegith} for the drawing area
  const boundingBox = (await element?.boundingBox()) as BoundingBox;

  switch (options.axis) {
    case 'X': {
      const { startX, endX }: XOptions = options;
      const { x, height } = boundingBox;
      const x1 = x + startX;
      const x2 = x + endX;
      const y1 = height / 2;
      const y2 = height / 2;
      return { x1, x2, y1, y2 };
    }
    case 'Y': {
      const { startY, endY }: YOptions = options;
      const { y, width } = boundingBox;
      const x1 = width / 2;
      const x2 = width / 2;
      const y1 = y + startY;
      const y2 = y + endY;
      return { x1, x2, y1, y2 };
    }
    case 'XY': {
      const { startX, endX, startY, endY }: XYOptions = options;
      const { x, y } = boundingBox;
      const x1 = x + startX;
      const x2 = x + endX;
      const y1 = y + startY;
      const y2 = y + endY;
      return { x1, x2, y1, y2 };
    }
    default:
      return { x1: 0, x2: 0, y1: 0, y2: 0 };
  }
}

export async function selectRange(
  nmrium: NmriumPage,
  element: ElementHandle<SVGElement | HTMLElement>,
  options: XOptions | XYOptions | YOptions,
) {
  const { steps = 15 } = options;

  const { x1, x2, y1, y2 } = await getBoundary(element, options);

  //move the custose to the center of the draw area
  await nmrium.page.mouse.move(x1, y1, { steps });
  // press shift + left mouse down
  await nmrium.page.keyboard.down('Shift');
  await nmrium.page.mouse.down({ button: 'left' });

  //move the cusrose to new postion and still hold shift and left mouse button
  await nmrium.page.mouse.move(x2, y2, {
    steps,
  });

  //release shift and left mouse button
  await nmrium.page.keyboard.up('Shift');
  await nmrium.page.mouse.up({ button: 'left' });
}
