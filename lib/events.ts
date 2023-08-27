import { ObjectPoolT } from './memory';

export type InternalEventT = {
	target: HTMLElement | null;
	value: string;
};

export interface EventMapT<T> {
	put(key: string, e: T): void;
	get(key: string): T;
	clear(key: string): void;
	exec(key: string): void;
}

export function EventMap(pool: ObjectPoolT<InternalEventT>): EventMapT<InternalEventT> {
	const map: Record<string, InternalEventT> = {};

	return {
		put(key: string, e: InternalEventT) {
			map[key] = e;
		},
		get(key: string) {
			return map[key];
		},
		clear(key: string) {
			const tmp = this.get(key);
			if (tmp) {
				delete map[key];
				pool.return(tmp);
			}
		},
		exec(key: string) {
			const event = this.get(key);
			if (event && event.target) {
				event.target.innerText = event.value;
			}
			this.clear(key);
		},
	};
}
