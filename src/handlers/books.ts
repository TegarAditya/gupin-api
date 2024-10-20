import { createFactory } from "hono/factory"
import db from "../plugins/database"

const factory = createFactory()

export const getBooks = factory.createHandlers(async (c) => {
    const books = await db.bukunontext.findMany({
        where: {
            NOT: [{ pdf: { contains: "tim.bupin.id" } }],
        },
        select: {
            judul: true,
            isi: true,
            pdf: true,
            cover: true,
        },
    })
    return c.json(books, 200)
})
