export interface StateT<T> {
	subscribe(fn: (value: T) => void): () => void;
	set(value: T): void;
	get(): T;
}

export function State<T>(initialValue: T): StateT<T> {
	let value = typeof initialValue === 'object' ? Object.assign({}, initialValue) : initialValue;
	const subscribers: ((value: T) => void)[] = [];

	return {
		subscribe(fn: (value: T) => void): () => void {
			subscribers.push(fn);
			return () => {
				subscribers.splice(subscribers.indexOf(fn), 1);
			};
		},
		set(newValue: T) {
			value = newValue;
			subscribers.forEach((fn) => fn(newValue));
		},
		get() {
			return value;
		},
	};
}
