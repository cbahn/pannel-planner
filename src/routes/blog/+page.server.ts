import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';


export const load: PageServerLoad = async ({ }) => {
	
    console.log(env.CHARLIE);
	

	error(404, 'Not found');
};