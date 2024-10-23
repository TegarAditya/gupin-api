import { Hono } from "hono"
import db from "../plugins/database"

const healthcheck = new Hono()

healthcheck.get("/", async (c) => {
    try {
        const dbStatus = await db.$queryRaw`SELECT 1`
        if (!dbStatus) {
            return c.json({ message: "Database is not connected" }, 500)
        } else {
            return c.json({ message: "OK" })
        }
    } catch (error) {
        return c.json({ message: error }, 500)
    }
})

export default healthcheck
