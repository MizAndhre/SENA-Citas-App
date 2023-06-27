//crear controladores para las diferentes rutas

import generarJWT from "../helpers/generarJWT.js";

import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import Usuario from "../models/Usuario.js";
import Doctor from "../models/Doctor.js";

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
	const usuario = await Admin.findOne({ email });
	if (!usuario) {
		const error = new Error("Admin no registrado");
		return res.status(400).json({ msg: error.message });
	}

	//comparar las password para ver si coinciden
	// const compararPassword = await bcrypt.compare(password, usuario.password);
	// const compararPassword = await bcrypt.compare(password, usuario.password);
	//Revisar el password
	if (password === usuario.password) {
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
	const { admin } = req;

	res.json(admin);
};

const marcarLeidos = async (req, res) => {
	const { _id } = req.body;

	try {
		const admin = await Admin.findOne({ _id });

		// console.log(admin);
		const unseenNotif = admin.unseenNotif;

		const seenNotif = admin.seenNotif;

		seenNotif.push(...unseenNotif);
		admin.unseenNotif = [];
		admin.seenNotif = seenNotif;

		const actualizarAdmin = await admin.save();

		res.json({ msg: "Notificaciones marcadas como leída correctamente" });

		// console.log(admin, "ADMIN");
	} catch (e) {
		const error = new Error("Error al marcar como leídos");
		return res.status(403).json({ msg: error.message });
	}
};

const eliminarNotificaciones = async (req, res) => {
	const { _id } = req.body;

	try {
		const admin = await Admin.findOne({ _id });

		// console.log(admin);

		// admin.unseenNotif = [];
		admin.seenNotif = [];

		const actualizarAdmin = await admin.save();

		res.json({ msg: "Notificaciones marcadas como leída correctamente" });

		// console.log(admin, "ADMIN");
	} catch (e) {
		const error = new Error("Error al eliminar");
		return res.status(403).json({ msg: error.message });
	}
};

const obtenerPacientes = async (req, res) => {
	try {
		const usuarios = await Usuario.find({});
		// console.log(usuarios);
		res.json(usuarios);
	} catch (error) {
		console.log("Error al obtener pacientes", error);
	}
};

const obtenerDoctores = async (req, res) => {
	try {
		const doctores = await Doctor.find({});
		// console.log(doctores);
		res.json(doctores);
	} catch (error) {
		console.log("Error al obtener doctores", error);
	}
};

const cambiarEstadoDoctor = async (req, res) => {
	try {
		const { doctorId, estado } = req.body;
		const doctor = await Doctor.findByIdAndUpdate(doctorId, {
			estado,
		});

		//Enviar NOTIF al doctor sobre la cuenta
		const unseenNotif = doctor.unseenNotif;
		unseenNotif.push({
			type: "estado-cuenta-doctor-cambiado",
			msg: `Su cuenta de doctor ha sido ${estado}`,
			onClickPath: "/doctor/perfil/notificacion",
		});
		await doctor.save();
		// doctor.estado = "";

		//Enviar NOTIF al Admin
		const adminUser = await Admin.findOne();
		const unseenNotifAdmin = adminUser.unseenNotif;
		unseenNotifAdmin.push({
			type: "estado-cuenta-doctor-cambiado",
			msg: `La cuenta del doctor ${doctor.nombre} ha sido ${estado}`,
			onClickPath: "/admin/perfil/lista-doctores",
		});
		await adminUser.save();

		res.json({ msg: "Estado del doctor cambiado correctamente" });
	} catch (error) {
		const e = new Error("Error al cambiar el estado del doctor");
		return res.status(400).json({ msg: e.message });
	}
};



export {
	registrar,
	perfil,
	login,
	marcarLeidos,
	eliminarNotificaciones,
	obtenerPacientes,
	obtenerDoctores,
	cambiarEstadoDoctor,
};

// router.get("/get-all-users", authMiddleware, async (req, res) => {
// 	try {
// 	  const users = await User.find({});
// 	  res.status(200).send({
// 		message: "Users fetched successfully",
// 		success: true,
// 		data: users,
// 	  });
// 	} catch (error) {
// 	  console.log(error);
// 	  res.status(500).send({
// 		message: "Error applying doctor account",
// 		success: false,
// 		error,
// 	  });
// 	}
//   });

// router.get("/get-all-doctors", authMiddleware, async (req, res) => {
// 	try {
// 	  const doctors = await Doctor.find({});
// 	  res.status(200).send({
// 		message: "Doctors fetched successfully",
// 		success: true,
// 		data: doctors,
// 	  });
// 	} catch (error) {
// 	  console.log(error);
// 	  res.status(500).send({
// 		message: "Error applying doctor account",
// 		success: false,
// 		error,
// 	  });
// 	}
//   });
