import express from "express";

import { registrar, perfil, login, obtenerDoctoresAprobados } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Rutas públicas
router.post("/", registrar);
router.post("/login", login);

//Ruta Privada
router.get("/perfil", checkAuth, perfil);
router.get("/obtener-doctores-aprobados", checkAuth, obtenerDoctoresAprobados);

export default router;
