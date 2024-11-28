import { createFactory } from "hono/factory"
import db from "../plugins/database"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const factory = createFactory()
const jenjangEnum = z.enum(["SD", "SMP", "SMA", "SMK", "MI", "MTS", "MA"])

/**
 * Creates an array of condition objects based on the provided query and field.
 */
const createConditions = (query: string | string[], field: string) => {
    const values = Array.isArray(query) ? query : [query].filter(Boolean)
    return values.map((value) => ({
        [field]: { contains: value },
    }))
}

// GET /api/books
export const getBooks = factory.createHandlers(
    zValidator(
        "query",
        z.object({
            jenjang: z.union([jenjangEnum, z.array(jenjangEnum)]).optional(),
            search: z.union([z.string(), z.array(z.string())]).optional(),
        })
    ),
    async (c) => {
        const jenjangQuery = c.req.queries("jenjang") || c.req.query("jenjang")
        const searchQuery = c.req.queries("search") || c.req.query("search")

        const conditions = []

        if (jenjangQuery) {
            conditions.push({ OR: createConditions(jenjangQuery, "judul") })
        }

        if (searchQuery) {
            conditions.push({ OR: createConditions(searchQuery, "judul") })
        }

        const whereClause = conditions.length ? { AND: conditions } : {}

        const books = await db.bukunontext.findMany({
            where: {
                AND: [
                    { pdf: { not: { contains: "tim.bupin.id" } } },
                    whereClause,
                ],
            },
            select: {
                judul: true,
                isi: true,
                pdf: true,
                cover: true,
            },
            distinct: ["pdf"],
            orderBy: {
                judul: "asc",
            },
        })

        return c.json(books, 200)
    }
)
