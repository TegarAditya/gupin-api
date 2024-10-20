import { Hono } from "hono"
import {
    getJenjangPtsPas,
    getKelasPtsPas,
    getKurikulumPtsPas,
    getMapelPtsPas,
    getPtsPas,
} from "../handlers/ptspas"
import {
    getJurusanMateri,
    getKelasMateri,
    getMapelMateri,
    getMateries,
} from "../handlers/materi"
import { getBooks } from "../handlers/books"

const api = new Hono()

api.get("/banksoal", ...getPtsPas)
api.get("/kurikulum-banksoal", ...getKurikulumPtsPas)
api.get("/jenjang-banksoal", ...getJenjangPtsPas)
api.get("/kelas-banksoal", ...getKelasPtsPas)
api.get("/mapel-banksoal", ...getMapelPtsPas)

api.get("/materi", ...getMateries)
api.get("/jenjang-materi", ...getJurusanMateri)
api.get("/kelas-materi", ...getKelasMateri)
api.get("/mapel-materi", ...getMapelMateri)

api.get("/books", ...getBooks)

export default api
