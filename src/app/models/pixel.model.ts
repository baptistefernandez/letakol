import { EItemTypes } from './enums/firebase-item-types.enum';
import { EPixelColors } from './enums/pixel-colors.enum';
import { EmptyItem, IItem } from './item.model';

export interface IPixelData {
  posX: number;
  posY: number;
  color: EPixelColors;
}

export interface IPixel extends IItem {
  data: IPixelData;
}

export class Pixel extends EmptyItem implements IPixel {
  constructor(data: IPixelData) {
    super(EItemTypes.Pixel, 'pixel', data)
  }
}