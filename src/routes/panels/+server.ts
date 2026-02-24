// src/routes/panels/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { createPanel } from '$lib/server/panels.db';

const createPanelBodySchema = z.object({
	editCode: z.string().min(1),
	email: z.email(),
	title: z.string().min(1),
	description: z.string().default('')
});

export async function POST({ request }) {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Request body must be valid JSON' }, { status: 400 });
	}

	const parsed = createPanelBodySchema.safeParse(body);
	if (!parsed.success) {
		return json(
			{
				error: 'Invalid request body',
				issues: parsed.error.issues
			},
			{ status: 400 }
		);
	}

	const panel = await createPanel(parsed.data);

	// 201 Created is nice for “created a new thing”
	return json(panel, { status: 201 });
}