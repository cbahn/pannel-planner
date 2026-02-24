// src/lib/server/pannels.db.ts
import { ObjectId } from 'mongodb';
import { getPanelsCollection } from './db';
import { randomInt } from 'crypto';

import {
	panelEntitySchema,
	type PanelEntity,
	type PanelDTO
} from '$lib/server/schemas/panel';

// ---- Helpers ----

function toDTO(entity: PanelEntity): PanelDTO {
	return {
		id: entity._id.toHexString(),
		panelId: entity.panelId,
		editCode: entity.editCode,
		email: entity.email,
		title: entity.title,
		description: entity.description,
		createdAt: entity.createdAt
	};
}

// ---- CRUD ----
export async function createPanel(data: {
	email: string;
	title: string;
	description: string;
}): Promise<PanelDTO> {
	const collection = await getPanelsCollection();
	const newPanelId = randomInt(0,9999999);
	const newEditCode = "7YPZB28UVD68";

	const entity: PanelEntity = panelEntitySchema.parse({
		panelId: newPanelId,
		editCode: newEditCode,
		email: data.email,
		title: data.title,
		description: data.description,
		createdAt: new Date()
	});

	await collection.insertOne(entity);
	return toDTO(entity);
}

export async function getPanelById(panelId: number): Promise<PanelDTO | null> {
	const collection = await getPanelsCollection();

	const entity = await collection.findOne({ panelId });

	return entity ? toDTO(entity) : null;
}

export async function getAllPanels(): Promise<PanelDTO[]> {
	const collection = await getPanelsCollection();

	const entities = await collection
		.find({})
		.sort({ createdAt: -1 })
		.toArray();

	return entities.map(toDTO);
}

export async function updatePanel(
	panelId: number,
	data: Partial<{
		editCode: string;
		email: string;
		title: string;
		description: string;
	}>
): Promise<PanelDTO | null> {
	const collection = await getPanelsCollection();

	// validate only the fields provided
	const parsed = panelEntitySchema.partial().parse(data);

	const result = await collection.findOneAndUpdate(
		{ panelId },
		{ $set: parsed },
		{ returnDocument: 'after' }
	);

	return result ? toDTO(result) : null;
}

export async function deletePanel(panelId: number): Promise<void> {
	const collection = await getPanelsCollection();

	await collection.deleteOne({ panelId });
}