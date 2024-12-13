import { zValidator } from "@hono/zod-validator"
import { createFactory } from "hono/factory"
import { z } from "zod"
import db from "../plugins/database"
import { romanToInt } from "../utils"

const factory = createFactory()

// GET /api/user/:id
export const getUserById = factory.createHandlers(
    zValidator("param", z.object({ id: z.string() })),
    zValidator("query", z.object({ kode_sekolah: z.string() })),
    async (c) => {
        try {
            const id = c.req.param("id")
            const kode_sekolah = c.req.query("kode_sekolah")

            const user = await db.tb_siswa.findFirst({
                where: {
                    nis: id,
                    kode_sekolah: kode_sekolah,
                    aktif: "Y",
                },
                select: {
                    nis: true,
                    nama_siswa: true,
                    kode_sekolah: true,
                    aktif: true,
                    id_jurusan: true,
                    id_kelas: true,
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
                },
            })

            if (!user) return c.json({ message: "User not found" }, 404)

            if (user.aktif !== "Y")
                return c.json({ message: "User is not active" }, 403)

            const getUserClass = (input: string): number => {
                const roman = input.split(" - ")[0].trim()
                return romanToInt(roman)
            }

            const data = {
                nis: user?.nis,
                nama_siswa: user?.nama_siswa,
                kode_sekolah: user?.kode_sekolah,
                aktif: user?.aktif,
                id_jurusan: user?.id_jurusan,
                id_kelas: user?.id_kelas,
                jurusan: user?.jurusan.jurusan,
                kelas: getUserClass(user?.kelas.kelas),
            }

            return c.json(data, 200)
        } catch (error) {
            return c.json({ message: error }, 500)
        }
    }
)
