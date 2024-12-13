import { createFactory } from "hono/factory"
import db from "../plugins/database"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const factory = createFactory()

// GET /api/jenjang-materi
export const getJenjangMateri = factory.createHandlers(async (c) => {
    const jurusan = await db.tb_master_jurusan.findMany({
        select: {
            id_jurusan: true,
            jurusan: true,
        },
    })
    return c.json(jurusan, 200)
})

// GET /api/kelas-materi
export const getKelasMateri = factory.createHandlers(async (c) => {
    const kelas = await db.tb_master_kelas.findMany({
        select: {
            id_kelas: true,
            kelas: true,
        },
    })
    return c.json(kelas, 200)
})

// GET /api/mapel-materi
export const getMapelMateri = factory.createHandlers(async (c) => {
    const mapel = await db.tb_master_mapel.findMany({
        select: {
            id_mapel: true,
            mapel: true,
        },
    })
    return c.json(mapel, 200)
})

// GET /api/materi
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
            where: {
                id_jurusan: Number(c.req.query("id_jurusan")) || undefined,
                id_kelas: Number(c.req.query("id_kelas")) || undefined,
                id_mapel: Number(c.req.query("id_mapel")) || undefined,
            },
            select: {
                id_materi_pusat: true,
                jurusan: {
                    select: {
                        jurusan: true,
                    },
                },
                kelas: {
                    select: {
                        kelas: true,
                    },
                },
                mapel: {
                    select: {
                        mapel: true,
                    },
                },
                judul_materi: true,
                nama_file: true,
                link_youtube: true,
            },
        })

        const data = materies.map((value) => {
            return {
                id: value.id_materi_pusat,
                jurusan: value.jurusan.jurusan,
                kelas: value.kelas.kelas,
                mapel: value.mapel.mapel,
                judul_materi: value.judul_materi,
                materi: value.nama_file,
                link_youtube: value.link_youtube,
            }
        })

        return c.json(data, 200)
    }
)
