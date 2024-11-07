import type { Context } from "hono";

export default async function routeEvent(context: Context) {
    return context.json({ hi: "there sub path" })
}