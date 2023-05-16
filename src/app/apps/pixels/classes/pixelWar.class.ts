import { Canvas } from 'src/app/classes/canvas.class';
import { Coord } from 'src/app/classes/coord.class';
import { EPixelColors } from 'src/app/models/enums/pixel-colors.enum';
import { IPixel } from 'src/app/models/pixel.model';
import { Logger } from 'src/app/services/logger/logger.service';
import { Utils } from 'src/app/services/utils/utils.service';

const TIMESPAN = 100
const ARRAY_SIZE = 100
const PIXEL_SIZE = 4;
const IMAGE_SIZE = 800 // TODO TMP!


export class PixelWar extends Canvas {
	private _startClickPos: Coord | null = null;
	private _imagePos: Coord = new Coord()
	private _oldImagePos: Coord = new Coord()
	private _pixelArray: (EPixelColors | null)[] | undefined;

	constructor(name: string, wrapper: HTMLDivElement) {
		super({ name, wrapper, looperOption: { timespan: TIMESPAN } });

		this.start();
	}

	public feedPixels(pixels: IPixel[]): void {
		const ordonnedPixels = pixels.map(({ data }) => ({ pos: data.posX + data.posY * ARRAY_SIZE, color: data.color }))
		this._pixelArray = Utils.array(Math.pow(ARRAY_SIZE, 2))
		ordonnedPixels.forEach(pixel => this._pixelArray![pixel.pos] = pixel.color);
		console.log(this._pixelArray)
	}

	private fillPixel(image: ImageData, pos: number, color: EPixelColors) {
		const arraySize = 100 // TMP!
		const cellSize = IMAGE_SIZE / arraySize; // TMP!
		const startPos = Math.floor(pos / arraySize) * IMAGE_SIZE * cellSize * PIXEL_SIZE + (pos % arraySize) * cellSize * PIXEL_SIZE

		for (let i = 0; i < cellSize; i++) {
			for (let j = 0; j < cellSize; j++) {
				const subPos = startPos + (i * IMAGE_SIZE * PIXEL_SIZE) + (j * PIXEL_SIZE)
				image.data[subPos + 0] = 190;
				image.data[subPos + 1] = 0;
				image.data[subPos + 2] = 210;
				image.data[subPos + 3] = 255;
			}
		}
	}

	private calcImage(): void {
		if (!this._pixelArray) {
			return Logger.warn('[PixelWar] pixel array is not ready yet');
		}
		const image = this.render.createImageData(IMAGE_SIZE, IMAGE_SIZE); // TODO
		this._pixelArray.forEach((pixel, index) => {
			if (pixel) {
				this.fillPixel(image, index, pixel)
			}
		})
		this.render.putImageData(image, this._imagePos.x, this._imagePos.y)
	}

	override loopCB(): void {
		this.calcImage();
	}

	override onScroll(up: boolean): void {
	}

	override onMouseMove(mx: number, my: number): void {
		if (this._startClickPos) {
			this._imagePos.set(mx - this._startClickPos.x, my - this._startClickPos.y)
		}
	}

	override onMouse(pressed: boolean, x: number, y: number): void {
		this._startClickPos = pressed ? new Coord(x, y) : null;
		if (!pressed) {
			this._oldImagePos = this._imagePos;
		}
	}
}
