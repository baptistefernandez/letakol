import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Mutex } from 'src/app/classes/mutex.class';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { EItemTypes } from 'src/app/models/enums/firebase-item-types.enum';
import { IPixel, Pixel } from 'src/app/models/pixel.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { PixelWar } from './classes/pixelWar.class';
import { Utils } from 'src/app/services/utils/utils.service';
import { EPixelColors } from 'src/app/models/enums/pixel-colors.enum';
import { Logger } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-pixels',
  templateUrl: './pixels.component.html',
  styleUrls: ['./pixels.component.less']
})
export class PixelsComponent extends CurrentUser implements AfterViewInit {
  @ViewChild('pixelsWrapper') wrapper: ElementRef | undefined;
  public app: PixelWar | undefined;
  public mutex = new Mutex();
  public pixels: Array<IPixel> = [];

  constructor(private _firestoreService: FirestoreService) {
    super()
    this.addSubscription(
      this._firestoreService.list<IPixel>(EItemTypes.Pixel).subscribe(pixels => {
        this.pixels = pixels
        if (this.app) {
          this.app.feedPixels(pixels)
        } else {
          Logger.error(`[PixelsComponent] could not feed pixel because app is not instnacied`)
        }
      })
    )
  }

  ngAfterViewInit() {
    this.app = new PixelWar('Pixel', this.wrapper!.nativeElement);
  }

  protected override destroy(): void {
    if (this.app) {
      this.app.destroy();
    }
  }

  private searchPixelByPos(x: number, y: number): IPixel | null {
    return this.pixels.find(({ data }) => data.posX === x && data.posY === y) || null;
  }

  public create(): void {
    const pixelColorArray = Object.values(EPixelColors)
    const pixel = new Pixel({
      posX: Utils.random(100),
      posY: Utils.random(100),
      color: pixelColorArray[Utils.random(pixelColorArray.length)]
    })
    this.mutex.exec(
      this._firestoreService.create.bind(this._firestoreService),
      pixel
    )
  }
}
