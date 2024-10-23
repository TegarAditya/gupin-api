import { Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { secureHeaders } from "hono/secure-headers"
import { compress } from "hono/compress"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trimTrailingSlash } from "hono/trailing-slash"
import docs from "./routes/docs"
import api from "./routes/api"
import healthcheck from "./routes/healthcheck"

const app = new Hono()

app.use(logger())
    .use(cors())
    .use(secureHeaders())
    .use(trimTrailingSlash())
    .use(compress())

app.route("/api", api)
app.route("/docs", docs)
app.route("/healthcheck", healthcheck)

app.use("/*", serveStatic({ root: "./public/" }))

const port = process.env.PORT ? Number(process.env.PORT) : 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
})
