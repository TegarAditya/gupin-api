import { Hono } from "hono"
import { apiReference } from "@scalar/hono-api-reference"
import { swaggerUI } from "@hono/swagger-ui"

const docs = new Hono()

docs.get(
    "/",
    apiReference({
        theme: "kepler",
        spec: {
            url: "/openapi.json",
        },
    })
)

docs.get(
    "swagger",
    swaggerUI({
        url: "/openapi.json",
    })
)

export default docs
