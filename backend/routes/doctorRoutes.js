import express from "express";

import {
	registrar,
	login,
	perfil,
	marcarLeidos,
	eliminarNotificaciones,actualizarPerfil
} from "../controllers/doctorController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Rutas públicas
router.post("/", registrar);
router.post("/login", login);

//Ruta Privada
router.get("/perfil", checkAuth, perfil);

router.post("/marcar-leidos", checkAuth, marcarLeidos);
router.post("/eliminar-notificaciones", checkAuth, eliminarNotificaciones);

router.put("/perfil/:id", checkAuth, actualizarPerfil);

export default router;
