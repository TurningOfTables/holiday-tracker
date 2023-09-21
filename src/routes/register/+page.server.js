import { createUser, getUserByUsername } from '$lib/server/db/index.js';
import { redirect, fail } from '@sveltejs/kit';

export function load({ locals }) {
    return {
        user: locals.user
    }
}

export const actions = {
    register: async ({ request }) => {
        let data = await request.formData();
        const username = data.get('username')
        const password = data.get('password')
        const passwordConfirmation = data.get('confirm-password')

        const existingUser = getUserByUsername(username)

        try {
            if (existingUser) {
                throw new Error('User already exists with that username')
            }

            if (username.length <= 0) {
                throw new Error('Username must not be blank')
            }

            if (password.length < 8 || password.length > 255) {
                throw new Error('Password must be between 8 and 255 characters long')
            }

            if (password != passwordConfirmation) {
                throw new Error('Password and confirm password must match')
            }
            createUser(data.get('username'), data.get('password'))

        } catch (error) {
            return fail(422, {
                error: error.message
            })
        }



        throw redirect(303, '/?registered=true')
    },
}