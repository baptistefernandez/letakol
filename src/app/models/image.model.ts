import { EItemTypes } from './enums/firebase-item-types.enum';
import { EmptyItem, IItem } from './item.model';

export interface IImageData {
  url: string;
  fileId: string;
  preview: string;
}

export interface IImage extends IItem {
  data: IImageData;
}

export class Image extends EmptyItem implements IImage {
  constructor(name: string, data: IImageData) {
    super(EItemTypes.Image, name, data)
  }
}