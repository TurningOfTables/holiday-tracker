import { fail, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { authenticateUser, setUserSession } from '../lib/server/db/index.js';

export async function load({ locals, url }) {
    const registered = await url.searchParams.get('registered')
    return {
        registered: registered,
        user: locals.user
    }
}

export const actions = {
    login: async ({ request, cookies }) => {
        let data = await request.formData();
        const auth = authenticateUser(data.get('username'), data.get('password'))
        if (auth) {
            const uuid = uuidv4()
            cookies.set('session_id', uuid, {
                httpOnly: true,
                sameSite: true
            })
            setUserSession(auth, uuid)
            throw redirect(303, '/account')
        } else {
            return fail(403, {
                error: "Username or password is incorrect"
            })
        }

    }
}