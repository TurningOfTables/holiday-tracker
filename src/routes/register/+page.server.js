import { redirect } from '@sveltejs/kit';

import { createUser, clearUserSession } from '$lib/server/db/index.js';

export function load({locals}) {
    return {
        user: locals.user
    }
}

export const actions = {
    register: async ({ request, cookies }) => {
        let data = await request.formData();
        const username = data.get('username')
        const password = data.get('password')
        const passwordConfirmation = data.get('confirm-password')

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
    },

    logout: async ({ request, cookies }) => {
        const uuid = cookies.get('session_id')
        cookies.delete('session_id')
        clearUserSession(uuid)
        throw redirect(303, '/')
    }
}