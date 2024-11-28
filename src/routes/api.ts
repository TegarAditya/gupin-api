import { Hono } from "hono"
import {
    getJenjangBankSoal,
    getKelasBankSoal,
    getKurikulumBankSoal,
    getMapelBankSoal,
    getBankSoal,
} from "../handlers/ptspas"
import {
    getJenjangMateri,
    getKelasMateri,
    getMapelMateri,
    getMateries,
} from "../handlers/materi"
import { getBooks } from "../handlers/books"
import { getUserById } from "../handlers/user"

const api = new Hono()

api.get("/banksoal", ...getBankSoal)
api.get("/kurikulum-banksoal", ...getKurikulumBankSoal)
api.get("/jenjang-banksoal", ...getJenjangBankSoal)
api.get("/kelas-banksoal", ...getKelasBankSoal)
api.get("/mapel-banksoal", ...getMapelBankSoal)

api.get("/materi", ...getMateries)
api.get("/jenjang-materi", ...getJenjangMateri)
api.get("/kelas-materi", ...getKelasMateri)
api.get("/mapel-materi", ...getMapelMateri)

api.get("/books", ...getBooks)

api.get("/user/:id", ...getUserById)

export default api
