import { State, createRoot, render } from '../lib';
import type { DOM } from '../lib';

const count = State(0);

const app: DOM = {
	tag: 'div',
	children: [
		{
			tag: 'h1',
			children: [{ tag: 'text', children: 'Hello ${:count}', template: { count } }],
		},
		{
			tag: 'p',
			children: [{ tag: 'text', children: 'World' }],
		},
		{
			tag: 'button',
			children: [{ tag: 'text', children: 'Click me' }],
			events: {
				click: () => {
					count.set(count.get() + 1);
				},
			},
		},
		{
			tag: 'button',
			children: [{ tag: 'text', children: 'Click me2' }],
		},
	],
};

document.addEventListener('keypress', (e) => {
	if (e.key === 'w') {
		count.set(count.get() + 1);
	}
	if (e.key === 's') {
		if (count.get() > 0) count.set(count.get() - 1);
	}
});

for (let i = 0; i < 100_000; i++) {
	app.children.push({
		tag: 'h1',
		children: [{ tag: 'text', children: 'Hello ${:count}', template: { count } }],
	});
}

const root = createRoot();
render(root, app);
