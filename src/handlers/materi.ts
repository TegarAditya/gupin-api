import { createFactory } from "hono/factory"
import db from "../plugins/database"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const factory = createFactory()

export const getJurusanMateri = factory.createHandlers(async (c) => {
    const jurusan = await db.tb_master_jurusan.findMany({
        select: {
            id_jurusan: true,
            jurusan: true,
        },
    })
    return c.json(jurusan, 200)
})

export const getKelasMateri = factory.createHandlers(async (c) => {
    const kelas = await db.tb_master_kelas.findMany({
        select: {
            id_kelas: true,
            kelas: true,
        },
    })
    return c.json(kelas, 200)
})

export const getMapelMateri = factory.createHandlers(async (c) => {
    const mapel = await db.tb_master_mapel.findMany({
        select: {
            id_mapel: true,
            mapel: true,
        },
    })
    return c.json(mapel, 200)
})

export const getMateries = factory.createHandlers(
    zValidator(
        "query",
        z.object({
            id_jurusan: z.string().optional(),
            id_kelas: z.string().optional(),
            id_mapel: z.string().optional(),
        })
    ),
    async (c) => {
        const materies = await db.tb_materi_pusat.findMany({
            include: {
                jurusan: true,
                kelas: true,
                mapel: true,
            },
        })
        return c.json(materies, 200)
    }
)
