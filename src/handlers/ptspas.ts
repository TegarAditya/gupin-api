import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import db from "../plugins/database"
import { createFactory } from "hono/factory"
import { Context } from "hono"

const factory = createFactory()

const jenjangEnum = z.enum(["SD", "SMP", "SMA", "SMK", "MI", "MTS", "MA"])
const kurikulumEnum = z.enum(["KURTILAS", "KURMER", "KMA"])
const jenisSoalEnum = z.enum(["PTS", "PAS"])

type Jenjang = z.infer<typeof jenjangEnum>
type Kurikulum = z.infer<typeof kurikulumEnum>
type JenisSoal = z.infer<typeof jenisSoalEnum>

const not_found = (c: Context) => c.json({ message: "Data not found" }, 404)

// GET /api/banksoal
export const getBankSoal = factory.createHandlers(
    zValidator(
        "query",
        z.object({
            jenis_soal: jenisSoalEnum.optional(),
            kurikulum: kurikulumEnum.optional(),
            jenjang: z.union([jenjangEnum, z.array(jenjangEnum)]).optional(),
            kelas: z.coerce.number().optional(),
            mapel: z.string().optional(),
        })
    ),
    async (c) => {
        try {
            const ptspas = await db.ptspas.findMany({
                where: {
                    JENIS_SOAL: c.req.query("jenis_soal") || undefined,
                    KURIKULUM: c.req.query("kurikulum") || undefined,
                    JENJANG: { in: c.req.queries("jenjang") || undefined },
                    KELAS: c.req.query("kelas") || undefined,
                    MAPEL: c.req.query("mapel") || undefined,
                },
            })

            if (!ptspas) return not_found(c)

            return c.json(ptspas, 200)
        } catch (error) {
            return c.json({ message: error }, 500)
        }
    }
)

// GET /api/banksoal/:id
export const getBankSoalById = factory.createHandlers(
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
        try {
            const ptspas = await db.ptspas.findUnique({
                where: {
                    id_ptspas: parseInt(c.req.param("id")),
                },
            })

            if (!ptspas) return not_found(c)

            return c.json(ptspas, 200)
        } catch (error) {
            return c.json({ message: error }, 500)
        }
    }
)

// GET /api/kurikulum-banksoal
export const getKurikulumBankSoal = factory.createHandlers(async (c) => {
    try {
        const kurikulum = await db.ptspas.findMany({
            select: {
                KURIKULUM: true,
            },
            distinct: ["KURIKULUM"],
        })
        return c.json(kurikulum, 200)
    } catch (error) {
        return c.json({ message: error }, 500)
    }
})

// GET /api/jenjang-banksoal
export const getJenjangBankSoal = factory.createHandlers(async (c) => {
    try {
        const jenjang = await db.ptspas.findMany({
            select: {
                JENJANG: true,
            },
            distinct: ["JENJANG"],
        })
        return c.json(jenjang, 200)
    } catch (error) {
        return c.json({ message: error }, 500)
    }
})

// GET /api/kelas-banksoal
export const getKelasBankSoal = factory.createHandlers(async (c) => {
    try {
        const kelas = await db.ptspas.findMany({
            select: {
                KELAS: true,
            },
            orderBy: {
                KELAS: "asc",
            },
            distinct: ["KELAS"],
        })

        const data = kelas.sort(
            (a, b) => parseInt(a.KELAS || "0") - parseInt(b.KELAS || "0")
        )

        return c.json(data, 200)
    } catch (error) {
        return c.json({ message: error }, 500)
    }
})

// GET /api/mapel-banksoal
export const getMapelBankSoal = factory.createHandlers(
    zValidator(
        "query",
        z.object({
            jenjang: z.union([jenjangEnum, z.array(jenjangEnum)]).optional(),
            kurikulum: kurikulumEnum.optional(),
            jenis_soal: jenisSoalEnum.optional(),
        })
    ),
    async (c) => {
        try {
            const mapel = await db.ptspas.findMany({
                where: {
                    JENJANG: { in: c.req.queries("jenjang") || undefined },
                    JENIS_SOAL: c.req.query("jenis_soal") || undefined,
                    KURIKULUM: c.req.query("kurikulum") || undefined,
                },
                select: {
                    JENJANG: true,
                    MAPEL: true,
                },
                orderBy: [{ JENJANG: "desc" }, { MAPEL: "asc" }],
                distinct: ["MAPEL"],
            })

            if (mapel.length === 0) not_found(c)

            return c.json(mapel, 200)
        } catch (error) {
            return c.json({ message: error }, 500)
        }
    }
)
