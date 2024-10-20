import { serve } from "@hono/node-server"
import { Hono } from "hono"
import api from "./routes/api"
import { logger } from "hono/logger"
import { cors } from "hono/cors"

const app = new Hono()

app.use(logger())
app.use(cors())

app.route("/api", api)

const port = process.env.PORT ? Number(process.env.PORT) : 3033
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
})
