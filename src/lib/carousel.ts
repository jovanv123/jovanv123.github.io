// Shared carousel behaviour (MediaCarousel, SeasonCarousel): prev/next with wraparound,
// arrow keys while the carousel is focused or in view, swipe on `swipeArea`, and the
// 01 / 03 counter. `onShow` renders the slide at the given index; the returned `show`
// jumps to an index from elsewhere (e.g. season tabs).
export function initCarousel(root: HTMLElement, count: number, swipeArea: HTMLElement, onShow: (index: number) => void) {
	const counter = root.querySelector('[data-index]');
	let current = 0;
	let inView = false;

	const show = (index: number) => {
		current = (index + count) % count;
		onShow(current);
		if (counter) counter.textContent = String(current + 1).padStart(2, '0');
	};

	root.querySelector('[data-prev]')!.addEventListener('click', () => show(current - 1));
	root.querySelector('[data-next]')!.addEventListener('click', () => show(current + 1));

	new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.5 }).observe(root);
	document.addEventListener('keydown', (event) => {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		const active = document.activeElement;
		const editing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || (active instanceof HTMLElement && active.isContentEditable);
		if (!root.contains(active) && !(active instanceof HTMLElement && active.matches('[data-carousel-tab]')) && (!inView || editing)) return;
		event.preventDefault();
		show(current + (event.key === 'ArrowRight' ? 1 : -1));
	});

	let startX = 0;
	let startY = 0;
	swipeArea.addEventListener('touchstart', (event) => {
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	}, { passive: true });
	swipeArea.addEventListener('touchend', (event) => {
		const dx = event.changedTouches[0].clientX - startX;
		const dy = event.changedTouches[0].clientY - startY;
		if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
	}, { passive: true });

	return show;
}
