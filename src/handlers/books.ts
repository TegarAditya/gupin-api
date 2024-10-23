import { createFactory } from "hono/factory"
import db from "../plugins/database"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const factory = createFactory()

const jenjangEnum = z.enum(["SD", "SMP", "SMA", "SMK", "MI", "MTS", "MA"])

// GET /api/books
export const getBooks = factory.createHandlers(
    zValidator(
        "query",
        z.object({
            jenjang: z.union([jenjangEnum, z.array(jenjangEnum)]).optional(),
            search: z.string().optional(),
        })
    ),
    async (c) => {
        const jenjangQuery = c.req.queries("jenjang") || c.req.query("jenjang")
        const whereClause: Prisma.bukunontextWhereInput = {}

        if (jenjangQuery) {
            whereClause.judul = {
                contains: Array.isArray(jenjangQuery)
                    ? jenjangQuery.join(",")
                    : jenjangQuery,
            }
        }

        const books = await db.bukunontext.findMany({
            where: {
                AND: [
                    { pdf: { not: { contains: "tim.bupin.id" } } },
                    { judul: { contains: c.req.query("search") || undefined } },
                    { ...whereClause },
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
