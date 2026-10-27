// Build-time renderer for the Mermaid `flowchart LR` subset used in the case studies, as
// static inline SVG (no runtime JS, no dependencies). Supported lines:
//   A[Label] --> B[Label]        A -- text --> B        (plain edges)
//   A ==> B                      A == text ==> B        (key path, drawn in accent)
// Labels may contain <br/>; single-line labels longer than WRAP characters wrap at spaces. Layout is a small layered (Sugiyama-style) pass: back edges are
// found by DFS and routed above the diagram, long edges get dummy points, and each layer is
// ordered by the barycentre of its predecessors. Styles live in global.css (.diagram).

type Node = { id: string; lines: string[]; layer: number; order: number; dummy: boolean; x: number; y: number; w: number; h: number; key: boolean };
type Edge = { from: string; to: string; label: string; key: boolean };

const FONT = 11; // label size in SVG units (Geist Mono)
const CHAR = FONT * 0.6; // monospace advance
const LINE = 14;
const PAD_X = 10;
const PAD_Y = 7;
const GAP = 28; // between layers
const WRAP = 14;
const ROW = 16; // between nodes in a layer
const BACK = 26; // band above the nodes for back edges
const ARROW = 6;

const EDGE = /^(\w+)(?:\[([^\]]*)\])?\s*(?:(-->)|(==>)|--\s*(.+?)\s*-->|==\s*(.+?)\s*==>)\s*(\w+)(?:\[([^\]]*)\])?$/;

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const textWidth = (s: string) => s.length * CHAR;

// Greedy word wrap at WRAP characters; a " · " separator is dropped where the line breaks.
const wrap = (label: string) =>
	label.split(' ').reduce<string[]>((lines, word, i, words) => {
		const last = lines.at(-1);
		if (word === '·') {
			const next = words[i + 1] ?? '';
			if (last !== undefined && `${last} · ${next}`.length <= WRAP) lines[lines.length - 1] = `${last} ·`;
			else lines.push('');
			return lines;
		}
		if (last === '') lines[lines.length - 1] = word;
		else if (last !== undefined && `${last} ${word}`.length <= WRAP) lines[lines.length - 1] = `${last} ${word}`;
		else lines.push(word);
		return lines;
	}, []);

export function parseFlowchart(code: string) {
	const [header, ...lines] = code.trim().split('\n').map((line) => line.trim()).filter(Boolean);
	if (!/^(flowchart|graph)\s+LR$/.test(header)) throw new Error(`Flowchart: only "flowchart LR" is supported, got "${header}"`);
	const labels = new Map<string, string>();
	const edges: Edge[] = [];
	for (const line of lines) {
		const m = EDGE.exec(line);
		if (!m) throw new Error(`Flowchart: cannot parse "${line}"`);
		const [, from, fromLabel, , thick, plainText, keyText, to, toLabel] = m;
		for (const [id, label] of [[from, fromLabel], [to, toLabel]] as const) {
			if (label !== undefined) labels.set(id, label);
			else if (!labels.has(id)) labels.set(id, id);
		}
		const key = Boolean(thick || keyText);
		edges.push({ from, to, label: (plainText ?? keyText ?? '').trim(), key });
	}
	return { labels, edges };
}

export function renderFlowchart(code: string, id: string) {
	const { labels, edges } = parseFlowchart(code);
	const ids = [...labels.keys()];
	const nodes = new Map<string, Node>(
		ids.map((nid) => {
			const label = labels.get(nid)!;
			const lines = /<br\s*\/?>/i.test(label) ? label.split(/<br\s*\/?>/i).map((s) => s.trim()) : wrap(label);
			const w = Math.max(...lines.map(textWidth)) + PAD_X * 2;
			const key = edges.some((e) => e.key && (e.from === nid || e.to === nid));
			return [nid, { id: nid, lines, layer: 0, order: 0, dummy: false, x: 0, y: 0, w, h: lines.length * LINE + PAD_Y * 2, key }];
		}),
	);

	// Back edges: edges that close a cycle in a DFS in definition order.
	const back = new Set<Edge>();
	const state = new Map<string, 'open' | 'done'>();
	const visit = (nid: string) => {
		state.set(nid, 'open');
		for (const e of edges.filter((e) => e.from === nid)) {
			if (state.get(e.to) === 'open') back.add(e);
			else if (!state.has(e.to)) visit(e.to);
		}
		state.set(nid, 'done');
	};
	ids.forEach((nid) => state.has(nid) || visit(nid));
	const forward = edges.filter((e) => !back.has(e));

	// Layers: longest path, then sources pulled right next to their first successor.
	for (let changed = true; changed; ) {
		changed = false;
		for (const e of forward) {
			const next = nodes.get(e.from)!.layer + 1;
			if (nodes.get(e.to)!.layer < next) (nodes.get(e.to)!.layer = next), (changed = true);
		}
	}
	for (const node of nodes.values()) {
		const succ = forward.filter((e) => e.from === node.id).map((e) => nodes.get(e.to)!.layer);
		if (succ.length && !forward.some((e) => e.to === node.id)) node.layer = Math.min(...succ) - 1;
	}

	// Long edges get one dummy point per layer they cross.
	const routes = forward.map((e) => {
		const a = nodes.get(e.from)!;
		const b = nodes.get(e.to)!;
		const points = [a];
		for (let l = a.layer + 1; l < b.layer; l++) {
			const d: Node = { id: `${e.from}>${e.to}@${l}`, lines: [], layer: l, order: 0, dummy: true, x: 0, y: 0, w: 0, h: 0, key: e.key };
			nodes.set(d.id, d);
			points.push(d);
		}
		points.push(b);
		return { edge: e, points };
	});

	// Order each layer by the barycentre of its predecessors (two sweeps).
	const layerCount = Math.max(...[...nodes.values()].map((n) => n.layer)) + 1;
	const layers: Node[][] = Array.from({ length: layerCount }, () => []);
	for (const n of nodes.values()) layers[n.layer].push(n);
	layers.forEach((layer) => layer.forEach((n, i) => (n.order = i)));
	const preds = (n: Node) => routes.flatMap((r) => r.points.flatMap((p, i) => (i > 0 && p === n ? [r.points[i - 1]] : [])));
	for (let sweep = 0; sweep < 2; sweep++) {
		for (const layer of layers.slice(1)) {
			const bary = (n: Node) => {
				const p = preds(n);
				return p.length ? p.reduce((s, q) => s + q.order, 0) / p.length : n.order;
			};
			layer.sort((a, b) => bary(a) - bary(b) || a.order - b.order).forEach((n, i) => (n.order = i));
		}
	}

	// Columns: widest node per layer; a gap widens to fit the labels of edges entering the next layer.
	const colW = layers.map((layer) => Math.max(0, ...layer.map((n) => n.w)));
	const gapAfter = layers.map((_, l) =>
		Math.max(GAP, ...routes.filter((r) => r.edge.label && r.points.at(-1)!.layer === l + 1).map((r) => textWidth(r.edge.label) + 36)),
	);
	const colX: number[] = [];
	let x = 0;
	layers.forEach((_, l) => {
		colX.push(x);
		x += colW[l] + gapAfter[l];
	});
	const width = x - gapAfter[layerCount - 1];

	// Rows: each layer stacked and centred on the tallest layer.
	const layerH = layers.map((layer) => layer.reduce((s, n) => s + (n.dummy ? LINE : n.h), 0) + ROW * (layer.length - 1));
	const top = back.size ? BACK : 0;
	const bodyH = Math.max(...layerH);
	layers.forEach((layer, l) => {
		let y = top + (bodyH - layerH[l]) / 2;
		for (const n of layer) {
			const h = n.dummy ? LINE : n.h;
			n.x = colX[l] + (colW[l] - n.w) / 2;
			n.y = y + h / 2; // centre line
			y += h + ROW;
		}
	});
	const height = top + bodyH;

	const out: string[] = [];
	const arrow = (key: boolean) => `marker-end="url(#${id}-${key ? 'key' : 'arrow'})"`;
	const edgeClass = (key: boolean) => (key ? 'diagram-edge is-key' : 'diagram-edge');
	const labelBox = (text: string, cx: number, cy: number) => {
		const w = textWidth(text) + 8;
		return `<rect class="diagram-label-bg" x="${cx - w / 2}" y="${cy - 8}" width="${w}" height="16"/><text class="diagram-label" x="${cx}" y="${cy}">${escape(text)}</text>`;
	};

	// Forward edges: orthogonal, elbow mid-gap (labelled edges turn early so the label sits on the run into the target).
	for (const { edge, points } of routes) {
		const [a] = points;
		let d = `M${a.x + a.w},${a.y}`;
		let labelAt: [number, number] | null = null;
		for (let i = 1; i < points.length; i++) {
			const p = points[i - 1];
			const b = points[i];
			const gapStart = colX[p.layer] + colW[p.layer];
			const gapEnd = colX[b.layer];
			const last = i === points.length - 1;
			const endX = b.dummy ? colX[b.layer] + colW[b.layer] : b.x - ARROW;
			if (Math.abs(p.y - b.y) < 0.5) d += ` H${endX}`;
			else {
				const elbow = edge.label && last ? gapStart + 12 : (gapStart + gapEnd) / 2;
				d += ` H${elbow} V${b.y} H${endX}`;
			}
			if (last && edge.label) {
				const from = Math.abs(p.y - b.y) < 0.5 ? gapStart : gapStart + 12;
				labelAt = [(from + b.x) / 2, b.y];
			}
		}
		out.push(`<path class="${edgeClass(edge.key)}" d="${d}" ${arrow(edge.key)}/>`);
		if (labelAt) out.push(labelBox(edge.label, ...labelAt));
	}

	// Back edges: up from the source, across the band above the nodes, down into the target.
	for (const edge of back) {
		const a = nodes.get(edge.from)!;
		const b = nodes.get(edge.to)!;
		const ax = a.x + a.w / 2;
		const bx = b.x + b.w / 2;
		const band = BACK / 2;
		out.push(`<path class="${edgeClass(edge.key)}" d="M${ax},${a.y - a.h / 2} V${band} H${bx} V${b.y - b.h / 2 - ARROW}" ${arrow(edge.key)}/>`);
		if (edge.label) out.push(labelBox(edge.label, (ax + bx) / 2, band));
	}

	for (const n of nodes.values()) {
		if (n.dummy) continue;
		const ty = n.y - ((n.lines.length - 1) * LINE) / 2;
		out.push(
			`<g class="${n.key ? 'diagram-node is-key' : 'diagram-node'}"><rect x="${n.x}" y="${n.y - n.h / 2}" width="${n.w}" height="${n.h}"/>` +
				n.lines.map((line, i) => `<text x="${n.x + n.w / 2}" y="${ty + i * LINE}">${escape(line)}</text>`).join('') +
				'</g>',
		);
	}

	const marker = (name: string) =>
		`<marker id="${id}-${name}" class="diagram-arrow${name === 'key' ? ' is-key' : ''}" viewBox="0 0 ${ARROW} ${ARROW}" refX="0" refY="${ARROW / 2}" markerWidth="${ARROW}" markerHeight="${ARROW}" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L${ARROW},${ARROW / 2} L0,${ARROW} Z"/></marker>`;
	const description = edges.map((e) => `${labels.get(e.from)!.replace(/<br\s*\/?>/gi, ', ')} → ${labels.get(e.to)!.replace(/<br\s*\/?>/gi, ', ')}`).join('; ');
	const pad = 1;
	const svg =
		`<svg viewBox="${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}" width="${width + pad * 2}" role="img" aria-label="${escape(description)}">` +
		`<defs>${marker('arrow')}${marker('key')}</defs>${out.join('')}</svg>`;
	return { svg, width: width + pad * 2 };
}
