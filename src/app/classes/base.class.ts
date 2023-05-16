// TOOD: remove from codewar, pet and snake
// replace with Player class

import { Logger } from "../services/logger/logger.service";


interface IBaseOptions {
  timeout: number;
  loopCallback: ((timestamp?: number) => void) | undefined;
  keyCallback: ((key: string, pressed: boolean) => void) | undefined;
  preventDefaultAllKey: boolean;
  preventDefaultKeys: string[];
}

export class Base implements IBaseOptions {
  timeout: number = 0;
  loopCallback: ((timestamp?: number) => void) | undefined;
  keyCallback: ((key: string, pressed: boolean) => void) | undefined;
  preventDefaultAllKey: boolean = false;
  preventDefaultKeys: string[] = [];

  private interval: NodeJS.Timer | undefined;
  private steps: number = 0;
  private running: boolean = false;

  constructor(options: IBaseOptions) {
    // mapping options
    Object.assign(this, options);

    // mapping key callbacks
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.preventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
      if (this.keyCallback) { this.keyCallback(event.key, true); }
    });
    window.addEventListener('keyup', event => {
      if (this.preventDefaultAllKey || this.preventDefaultKeys.includes(event.key)) { event.preventDefault(); }
      if (this.keyCallback) { this.keyCallback(event.key, false); }
    });

    // initializing
    this.stop();
  }

  public isRunning(): boolean {
    return this.running;
  }
  public getTimeout(): number {
    return this.timeout!;
  }
  public setTimeout(timeout: number, force?: boolean): boolean {
    if (!this.running || force) {
      this.timeout = timeout;
      return true;
    } else {
      Logger.warn('[Base/setTimeout] Cannot set timeout while running')
      return false;
    }
  }

  public stop(): void {
    this.running = false;
    this.steps = 0;
  }
  public start(): void {
    this.running = true;
    this.loop();
  }
  public pause(): void {
    this.running = !this.running;
    clearTimeout(this.interval);
    if (this.running) {
      this.interval = setTimeout(this.start.bind(this), this.timeout);
    }
  }

  private loop(): void {
    if (this.running) {
      if (this.loopCallback) {
        this.loopCallback(this.steps);
      }
      this.steps += 1;
      this.interval = setTimeout(this.loop.bind(this), this.timeout);
    }
  }
}
