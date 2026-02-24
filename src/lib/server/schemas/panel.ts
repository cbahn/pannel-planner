// src/lib/server/schemas/panel.ts
import { z } from 'zod';
import { ObjectId } from "mongodb";

export const panelEntitySchema = z.object({
	_id: z.instanceof(ObjectId),
	panelId: z.number(),
	editCode: z.string().min(1),
	email: z.email(),
	title: z.string().min(1),
	description: z.string(),
	createdAt: z.date(),
});

export type PanelEntity = z.infer<typeof panelEntitySchema>;

export const panelDTOSchema = z.object({
  	id: z.string(),
	panelId: panelEntitySchema.shape.panelId,
	editCode: panelEntitySchema.shape.editCode,
	email: panelEntitySchema.shape.email,
	title: panelEntitySchema.shape.title,
	description: panelEntitySchema.shape.description,
	createdAt: panelEntitySchema.shape.createdAt
});

export type PanelDTO = z.infer<typeof panelDTOSchema>;