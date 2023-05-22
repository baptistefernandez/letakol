import { Canvas } from 'src/app/classes/canvas.class';
import { Coord } from 'src/app/classes/coord.class';
import { Debouncer } from 'src/app/classes/debouncer.class';
import { Timer } from 'src/app/classes/timer.class';
import { EPixelColors } from 'src/app/models/enums/pixel-colors.enum';
import { IPixel } from 'src/app/models/pixel.model';
import { Logger } from 'src/app/services/logger/logger.service';
import { Utils } from 'src/app/services/utils/utils.service';

const TIMESPAN = 30;
const ARRAY_SIZE = 100;
const PIXEL_SIZE = 4;
const MAX_ZOOM_LEVEL = 5;
const ALPHA = 255
const HOVER_COLOR = '#aaaaaa'

export class PixelWar extends Canvas {
	private _imageSource: HTMLImageElement = new Image();
	private _mousePos: Coord = new Coord();
	private _startClickPos: Coord | null = null;
	private _imagePos: Coord = new Coord()
	private _currentImagePos: Coord = new Coord()
	private _pixelArray: (EPixelColors | null)[] | undefined;
	private _zoomLevel: number = 1;
	private _zoomDebouncer: Debouncer = new Debouncer(this.changeZoomLevel.bind(this), 100);
	private _resizeDebouncer: Debouncer = new Debouncer(this.calcImage.bind(this), 100);
	private _pendingZoom: number = 0;
	private _timer: Timer = new Timer(`[PixelWar] 'calcImage'`)

	constructor(name: string, wrapper: HTMLDivElement) {
		super({ name, wrapper, looperOption: { timespan: TIMESPAN } });
		this.start();
	}

	public feedPixels(pixels: IPixel[]): void {
		const ordonnedPixels = pixels.map(({ data }) => ({ pos: data.posX + data.posY * ARRAY_SIZE, color: data.color }))
		this._pixelArray = Utils.array(Math.pow(ARRAY_SIZE, 2))
		ordonnedPixels.forEach(pixel => this._pixelArray![pixel.pos] = pixel.color);
		this.calcImage();
	}

	private changeZoomLevel(level: number, mx: number, my: number): void {
		const newZoom = Utils.reduce(this._zoomLevel + level, MAX_ZOOM_LEVEL, 1);
		this._pendingZoom = 0;
		if (newZoom !== this._zoomLevel) {
			this._zoomLevel = newZoom;
		}
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
		const { r, g, b } = this.hexToRgb(color)!

		for (let x = gap; x < cellSize - gap; x++) {
			for (let y = gap; y < cellSize - gap; y++) {
				const subPos = startPos + (x * this.size * PIXEL_SIZE) + (y * PIXEL_SIZE)
				image.data[subPos + 0] = r;
				image.data[subPos + 1] = g;
				image.data[subPos + 2] = b;
				image.data[subPos + 3] = ALPHA;
			}
		}
	}

	private drawGrid(image: ImageData): void {
		const GREY = 55;
		const cellSize = Math.floor(this.size / ARRAY_SIZE);
		for (let x = 0; x <= ARRAY_SIZE; x++) {
			const subPosX1 = x * cellSize * this.size * PIXEL_SIZE;
			const subPosX2 = x * cellSize * PIXEL_SIZE;
			for (let y = 0; y < this.size * PIXEL_SIZE; y++) {
				// horizontal lines
				image.data[subPosX1 + y + 0] = GREY;
				image.data[subPosX1 + y + 1] = GREY;
				image.data[subPosX1 + y + 2] = GREY;
				image.data[subPosX1 + y + 3] = ALPHA;
				// vertical lines
				const subPosY = subPosX2 + y * this.size * PIXEL_SIZE;
				image.data[subPosY + 0] = GREY;
				image.data[subPosY + 1] = GREY;
				image.data[subPosY + 2] = GREY;
				image.data[subPosY + 3] = ALPHA;
			}
		}
	}

	private calcImage(): void {
		if (!this._pixelArray) {
			return Logger.warn(`[PixelWar] pixel array is not ready yet`);
		}

		this._timer.start();

		const imageData = this.render.createImageData(this.size, this.size); // TODO
		if (!imageData) {
			return Logger.error(`[PixelWar][calcImage] image data creation error`)
		}
		this._pixelArray.forEach((pixel, index) => pixel ? this.fillPixel(imageData, index, pixel) : null)
		// this.drawGrid(imageData);

		this.render.putImageData(imageData, 0, 0);
		this._imageSource.src = this.render.canvas.toDataURL();

		this._timer.stop();
		console.log(this._timer.toString())
	}

	private drawCell(): void {
		if (this._startClickPos) {
			return;
		}
		const cellSize = Math.floor(this.size / ARRAY_SIZE) * this._zoomLevel,
			gapx = this._currentImagePos.x % cellSize,
			gapy = this._currentImagePos.y % cellSize,
			x = Math.floor((this._mousePos.x - gapx) / cellSize) * cellSize,
			y = Math.floor((this._mousePos.y - gapy) / cellSize) * cellSize
		this.render.beginPath();
		this.render.fillStyle = HOVER_COLOR;
		this.render.fillRect(x + gapx, y + gapy, cellSize, cellSize);
		this.render.closePath();
	}

	private draw(): void {
		this.render.clearRect(0, 0, this.size, this.size);
		this.render.drawImage(this._imageSource, this._imagePos.x, this._imagePos.y, this.size * this._zoomLevel, this.size * this._zoomLevel);
		this.drawCell();
	}

	private clickOnCell(mx: number, my: number): void {
		const cellSize = Math.floor(this.size / ARRAY_SIZE) * this._zoomLevel,
			imgx = Math.floor(this._currentImagePos.x / cellSize),
			imgy = Math.floor(this._currentImagePos.y / cellSize),
			gapx = this._currentImagePos.x % cellSize,
			gapy = this._currentImagePos.y % cellSize,
			x = Math.floor((this._mousePos.x - gapx) / cellSize),
			y = Math.floor((this._mousePos.y - gapy) / cellSize)
			console.log(x - imgx, y - imgy)
	}

	protected override loopCB(): void {
		this._imageSource ? this.draw() : this.calcImage();
	}

	protected override onScroll(up: boolean, mx: number, my: number): void {
		this._pendingZoom += up ? -1 : 1
		this._zoomDebouncer.exec(this._pendingZoom, mx, my)
	}

	protected override onMouseMove(mx: number, my: number): void {
		this._mousePos.set(mx, my);
		if (this._startClickPos) {
			this._imagePos.set(
				mx - this._startClickPos.x + this._currentImagePos.x,
				my - this._startClickPos.y + this._currentImagePos.y
			)
		}
	}

	protected override onMouse(pressed: boolean, mx: number, my: number): void {
		this._startClickPos = pressed ? new Coord(mx, my) : null;
		if (!pressed) {
			// click
			if (this._imagePos.equal(this._currentImagePos)) {
				this.clickOnCell(mx, my);
			}
			this._currentImagePos = this._imagePos.clone();
		}
	}

	protected override onMouseLeave(): void {
		this._startClickPos = null;
		this._currentImagePos = this._imagePos.clone();
	}

	protected override onResize(): void {
		this._resizeDebouncer.exec();
	}
}
