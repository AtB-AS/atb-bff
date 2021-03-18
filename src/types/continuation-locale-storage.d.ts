import 'continuation-local-storage';
declare module 'continuation-local-storage' {
  export type Func<T> = (...args: any[]) => T;
}
