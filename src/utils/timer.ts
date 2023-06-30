export class Timer {
  start: Date;
  constructor(start?: Date) {
    this.start = start ?? new Date();
  }
  getElapsedMs() {
    const now = new Date();
    return now.valueOf() - this.start.valueOf();
  }
}
