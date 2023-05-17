export class Coord {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

  public set(x: number, y: number, z = this.z): Coord {
    this.x = x;
    this.y = y;
    this.z = z;
    return this
  }

  public add(coord: Coord): Coord {
    this.x += coord.x;
    this.y += coord.y;
    this.z += coord.z;
    return this;
  }

  public clone(): Coord {
    return new Coord(this.x, this.y, this.z);
  }

  public toString = (): string => {
    return `${this.x}, ${this.y} , ${this.z}`;
  };
}
