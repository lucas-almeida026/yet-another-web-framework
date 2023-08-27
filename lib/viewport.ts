import { type EventMapT, type InternalEventT } from './events';

export function Viewport(eventMap: EventMapT<InternalEventT>): {
	elements: Element[];
	observer: IntersectionObserver;
} {
	const elements: Element[] = [];
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				elements.push(entry.target);
				eventMap.exec(entry.target.id);
			} else {
				const index = elements.indexOf(entry.target);
				if (index >= 0) {
					elements.splice(index, 1);
				}
			}
		});
	});
	return { elements, observer };
}
