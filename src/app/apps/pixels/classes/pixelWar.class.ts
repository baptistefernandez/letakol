import { Canvas } from 'src/app/classes/canvas.class';
import { Coord } from 'src/app/classes/coord.class';
import { Debouncer } from 'src/app/classes/debouncer.class';
import { EPixelColors } from 'src/app/models/enums/pixel-colors.enum';
import { IPixel } from 'src/app/models/pixel.model';
import { Logger } from 'src/app/services/logger/logger.service';
import { Utils } from 'src/app/services/utils/utils.service';

const TIMESPAN = 30
const ARRAY_SIZE = 10
const PIXEL_SIZE = 4;
const MAX_ZOOM_LEVEL = 5;

export class PixelWar extends Canvas {
	private _imageSource: HTMLImageElement = new Image();
	private _startClickPos: Coord | null = null;
	private _imagePos: Coord = new Coord()
	private _oldImagePos: Coord = new Coord()
	private _pixelArray: (EPixelColors | null)[] | undefined;
	private _zoomLevel: number = 1;
	private _zoomDebouncer: Debouncer = new Debouncer(this.changeZoomLevel.bind(this), 100);
	private _resizeDebouncer: Debouncer = new Debouncer(this.calcImage.bind(this), 100);
	private _pendingZoom: number = 0;

	constructor(name: string, wrapper: HTMLDivElement) {
		super({ name, wrapper, looperOption: { timespan: TIMESPAN } });

		this.start();
	}

	public feedPixels(pixels: IPixel[]): void {
		const ordonnedPixels = pixels.map(({ data }) => ({ pos: Math.floor(data.posX / 10) + Math.floor(data.posY / 10) * ARRAY_SIZE, color: data.color }))
		this._pixelArray = Utils.array(Math.pow(ARRAY_SIZE, 2))
		ordonnedPixels.forEach(pixel => this._pixelArray![pixel.pos] = pixel.color);
		this.calcImage();
	}

	private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	private fillPixel(image: ImageData, pos: number, color: EPixelColors) {
		const cellSize = Math.floor(this.size / ARRAY_SIZE);
		const startPos = Math.floor(pos / ARRAY_SIZE) * this.size * cellSize * PIXEL_SIZE + (pos % ARRAY_SIZE) * cellSize * PIXEL_SIZE

		const gap = Math.floor(cellSize / 10); // 1/10 of pixel is for gap
		for (let i = gap; i < cellSize - gap; i++) {
			for (let j = gap; j < cellSize - gap; j++) {
				const subPos = startPos + (i * this.size * PIXEL_SIZE) + (j * PIXEL_SIZE)
				const { r, g, b } = this.hexToRgb(color)!
				image.data[subPos + 0] = r;
				image.data[subPos + 1] = g;
				image.data[subPos + 2] = b;
				image.data[subPos + 3] = 255;
			}
		}
	}

	private calcImage(): void {
		if (!this._pixelArray) {
			return Logger.warn(`[PixelWar] pixel array is not ready yet`);
		}
		console.log('calcImage!, size:', this.size)
		const imageData = this.render.createImageData(this.size, this.size); // TODO
		if (!imageData) {
			return Logger.error(`[PixelWar][calcImage] image data creation error`)
		}
		this._pixelArray.forEach((pixel, index) => {
			if (pixel) {
				this.fillPixel(imageData, index, pixel)
			}
		})
		this.render.putImageData(imageData, this._imagePos.x, this._imagePos.y);
		this._imageSource.src = this.render.canvas.toDataURL();
	}

	private changeZoomLevel(level: number, mx: number, my: number): void {
		const newZoom = Utils.reduce(this._zoomLevel + level, MAX_ZOOM_LEVEL, 1);
		this._pendingZoom = 0;
		if (newZoom !== this._zoomLevel) {
			this._zoomLevel = newZoom;
		}
	}

	protected override loopCB(): void {
		if (!this._imageSource) {
			this.calcImage();
		} else {
			this.render.clearRect(0, 0, this.size, this.size);
			this.render.drawImage(this._imageSource, this._imagePos.x, this._imagePos.y);
		}
	}

	protected override onScroll(up: boolean, mx: number, my: number): void {
		this._pendingZoom += up ? -1 : 1
		this._zoomDebouncer.exec(this._pendingZoom, mx, my)
	}

	protected override onMouseMove(mx: number, my: number): void {
		if (this._startClickPos) {
			this._imagePos.set(
				mx - this._startClickPos.x + this._oldImagePos.x,
				my - this._startClickPos.y + this._oldImagePos.y
			)
		}
	}

	protected override onMouse(pressed: boolean, mx: number, my: number): void {
		this._startClickPos = pressed ? new Coord(mx, my) : null;
		if (!pressed) {
			this._oldImagePos = this._imagePos.clone();
		}
	}

	protected override onMouseLeave(): void {
		this._startClickPos = null;
		this._oldImagePos = this._imagePos.clone();
	}

	protected override onResize(): void {
		this._resizeDebouncer.exec();
	}
}
