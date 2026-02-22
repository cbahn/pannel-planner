// src/lib/server/schemas/user.ts
import { z } from 'zod';

// Base schema (what you expect in Mongo)
export const UserSchema = z.object({
	_id: z.string(), // or z.string().uuid() if you control it
	email: z.string().email(),
	displayName: z.string().min(1),
	role: z.enum(['normal', 'pro', 'admin']).default('normal'),
	createdAt: z.date(),
	updatedAt: z.date(),
	profile: z
		.object({
			bio: z.string().max(500).optional(),
			avatarUrl: z.string().url().optional()
		})
		.optional()
});

// TypeScript type derived from schema
export type User = z.infer<typeof UserSchema>;

// A version for inserts (no _id yet, dates optional)
export const CreateUserSchema = UserSchema.omit({
	_id: true,
	createdAt: true,
	updatedAt: true
});