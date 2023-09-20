import { fail, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { authenticateUser, setUserSession, clearUserSession } from '../lib/server/db/index.js';

export function load({locals}) {
    return {
        user: locals.user
    }
}

export const actions = {
    login: async ({ request, cookies }) => {
        let data = await request.formData();
        const auth = authenticateUser(data.get('username'), data.get('password'))
        if (auth) {
            const uuid = uuidv4()
            cookies.set('session_id', uuid)
            setUserSession(auth, uuid)
            throw redirect(303, '/account')
        } else {
            return fail(403, {
                error: "Username or password is incorrect"
            })
        }

    },

    logout: async ({ request, cookies }) => {
        const uuid = cookies.get('session_id')
        cookies.delete('session_id')
        clearUserSession(uuid)
        throw redirect(303, '/')
    }
}