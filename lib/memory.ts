export interface ObjectPoolT<T extends object> {
  get(): T;
  return(o: T): void;
}

export function ObjectPool<T extends object>(
  initialSize: number,
  maxSize: number,
  factory: () => T,
  reset: (o: T)=> void
): ObjectPoolT<T> {
  const pool: T[] = Array.from({ length: initialSize }, factory);

  return {
    get(){
      if (pool.length > 0) {
        return pool.pop()!;
      }

      if (pool.length < maxSize) {
        return factory();
      }

      throw new Error('Out of memory');
    },
    return(o: T){
      reset(o);
      pool.push(o);
    }
  }
}