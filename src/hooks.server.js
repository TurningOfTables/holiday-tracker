import { redirect } from "@sveltejs/kit";
import { clearUserSession, getUserBySession } from "./lib/server/db";
const protectedRoutes = ['/account']
export const handle = async ({ event, request, resolve }) => {
    const sessionId = event.cookies.get('session_id')

    // If there no is no session ID and we access a protected page, redirect to index
    if (!sessionId && protectedRoutes.includes(event.url.pathname)) {
        throw redirect(303, '/')
    }

    // If we can find a user with the associated session, make that user available and set them to loggedIn
    // Otherwise redirect to index
    const user = getUserBySession(sessionId)
    if (user) {
        event.locals.user = {
            isLoggedIn: true,
            username: user.username
        }
    } else {
        if (protectedRoutes.includes(event.url.pathname)) {
            throw redirect(303, '/')
        }
    }

    // Remove session cookie if logout query param is true
    const query = event.url.searchParams.get('logout');
    if (Boolean(query) == true) {
        const user = getUserBySession(sessionId)
        clearUserSession(user.uuid)
        event.locals.user = {
            isLoggedIn: false,
        }
        event.cookies.delete('session_id', { path: '/', secure: false });
        
    }
    return resolve(event)
}