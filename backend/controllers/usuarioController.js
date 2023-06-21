//crear controladores para las diferentes rutas

import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";

import bcrypt from "bcrypt";

const registrar = async (req, res) => {
	// res.send("Desde API Veterinarios CONTROLLER"); para enviar algo a la web

	// res.json({ msg: "Registrando usuario..." });
	const { email, password } = req.body;

	//Revisar si el usuario ya está registrado/existe
	const existeUsuario = await Usuario.findOne({ email });
	if (existeUsuario) {
		const error = new Error("Usuario ya registrado");
		return res.status(400).json({ msg: error.message });
	}

	try {
		//Hashear la password antes de enviarla
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		req.body.password = hashedPassword;

		//Guardar la información del form en una variable
		const usuario = new Usuario(req.body);
		//Guardar el usuario en la BD
		const usuarioGuardado = await usuario.save();

		//Enviar email [tentativo]

		//Enviar la información del usuario como JSON
		res.json(usuarioGuardado);
		// console.log(usuarioGuardado);
	} catch (error) {
		console.log("Error al registrar", error);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	//Comprobar que el usuario exite
	const usuario = await Usuario.findOne({ email });
	if (!usuario) {
		const error = new Error("Paciente no registrado");
		return res.status(400).json({ msg: error.message });
	}

	//comparar las password para ver si coinciden
	const compararPassword = await bcrypt.compare(password, usuario.password);
	//Revisar el password
	if (compararPassword) {
		// console.log("enviar password", usuario);
		res.json({
			_id: usuario._id,
			nombre: usuario.nombre,
			email: usuario.email,
			role: usuario.role,
			seenNotif: usuario.seenNotif,
			unseenNotif: usuario.unseenNotif,
			token: generarJWT(usuario.id, usuario.role),
		});
	} else {
		const error = new Error("La contraseña es incorrecta");
		return res.status(403).json({ msg: error.message });
	}
};

const perfil = (req, res) => {
	const { usuario } = req;

	res.json(usuario);
};

export { registrar, perfil, login };
