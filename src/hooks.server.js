import { redirect } from "@sveltejs/kit";
import { getUserBySession } from "./lib/server/db";
const protectedRoutes = ['/account']
export const handle = async ({ event, request, resolve }) => {
    if (protectedRoutes.includes(event.url.pathname)) {
        const sessionId = event.cookies.get('session_id')

        // If there no is no session ID and we access a protected page, redirect to index
        if (!sessionId && protectedRoutes.includes(event.url.pathname)) {
            throw redirect(303, '/')
        }

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


    }
    return resolve(event)
}