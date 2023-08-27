import { EventMap, EventMapT, InternalEventT } from './events';
import { idMaker } from './id';
import { ObjectPool, ObjectPoolT } from './memory';
import { StateT } from './reactivity';
import { Viewport } from './viewport';

export function createRoot() {
	let root = document.getElementById('root');
	if (!root) {
		root = document.createElement('div');
		root.id = 'root';
		document.body.appendChild(root);
	}
	return root;
}

export type DOM_Text = {
	tag: 'text';
	children: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	template?: Record<string, StateT<any>>;
};

export type DOM_H1 = {
	tag: 'h1';
	children: DOM[];
};

export type DOM_P = {
	tag: 'p';
	children: DOM[];
};

export type DOM_DIV = {
	tag: 'div';
	children: DOM[];
};

export type DOM_BUTTON = {
	tag: 'button';
	children: DOM[];
	events?: {
		click?: (e: MouseEvent) => void;
	};
};

export type DOM = DOM_Text | DOM_H1 | DOM_P | DOM_DIV | DOM_BUTTON;

export function render(root: HTMLElement, vdom: DOM) {
	const internalEventPool = ObjectPool<InternalEventT>(
		100,
		64 * 64,
		() => ({ target: null, value: '' }),
		(o) => {
			o.target = null;
			o.value = '';
		},
	);

	const internalEventMap = EventMap(internalEventPool);

	const viewport = Viewport(internalEventMap);

	if (vdom.tag === 'text') {
		if ('template' in vdom) {
			viewport.observer.observe(root);
		}
		const template = TextTemplate(root, vdom, internalEventPool, viewport.elements, internalEventMap);
		template.build();
		root.appendChild(document.createTextNode(vdom.children));
	} else {
		const el = document.createElement(vdom.tag);
		el.id = String(idMaker.next().value) as string;
		for (const child of vdom.children) {
			render(el, child);
			if (vdom.tag === 'button' && vdom.events) {
				const entries = Object.entries(vdom.events);
				for (const [key, val] of entries) {
					el.addEventListener(key, val as EventListenerOrEventListenerObject);
				}
			}
		}
		root.appendChild(el);
	}
}

export function localized(
	el: HTMLElement,
	changes: { text?: string },
	pool: ObjectPoolT<InternalEventT>,
	viewport: Element[],
	eventMap: EventMapT<InternalEventT>,
	isTextNodeParent = false,
) {
	if (isTextNodeParent) {
		if (changes.text) {
			const event = pool.get();
			event.target = el;
			event.value = changes.text;
			eventMap.put(el.id, event);
			for (const vp of viewport) {
				if (vp == el) {
					eventMap.exec(el.id);
				}
			}
		}
	} else {
		console.warn('not implemented');
	}
}

export interface TemplateT {
	build(): string;
}
export function TextTemplate(
	el: HTMLElement,
	vdom: DOM_Text,
	pool: ObjectPoolT<InternalEventT>,
	viewort: Element[],
	eventMap: EventMapT<InternalEventT>,
): TemplateT {
	if (!vdom.template)
		return {
			build() {
				return vdom.children;
			},
		};
	const original = vdom.children;

	return {
		build() {
			const accessor = /\$\{:(.+)\}/g.exec(vdom.children);
			if (accessor) {
				const state = vdom.template![accessor[1]];
				state.subscribe((v) => {
					localized(
						el,
						{
							text: original.replace(accessor[0], v),
						},
						pool,
						viewort,
						eventMap,
						true,
					);
				});
				vdom.children = original.replace(accessor[0], state.get());
			}
			return vdom.children;
		},
	};
}
