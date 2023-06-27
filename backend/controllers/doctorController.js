//crear controladores para las diferentes rutas

import generarJWT from "../helpers/generarJWT.js";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";

import bcrypt from "bcrypt";

const registrar = async (req, res) => {
	// res.send("Desde API Veterinarios CONTROLLER"); para enviar algo a la web

	// res.json({ msg: "Registrando doctor..." });
	const { email, password } = req.body;

	//Revisar si el doctor ya está registrado/existe
	const existeUsuario = await Doctor.findOne({ email });
	if (existeUsuario) {
		const error = new Error("Doctor ya registrado");
		return res.status(400).json({ msg: error.message });
	}

	try {
		//Hashear la password antes de enviarla
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		req.body.password = hashedPassword;

		//Guardar la información del form en una variable
		const doctor = new Doctor(req.body);
		//Guardar el doctor en la BD
		const doctorGuardado = await doctor.save();

		//Enviar email [tentativo]

		//! Enviar Notificacion al ADMIN
		const adminUser = await Admin.findOne();
		const unseenNotif = adminUser.unseenNotif;
		unseenNotif.push({
			type: "nuevo-registro-doctor",
			msg: `${doctorGuardado.nombre} se ha registrado como doctor`,
			data: {
				doctorId: doctorGuardado._id,
				name: doctorGuardado.nombre,
			},
			onClickPath: "/admin/perfil/lista-doctores",
		});
		await Admin.findByIdAndUpdate(adminUser._id, { unseenNotif });

		//Enviar la información del doctor como JSON
		res.json(doctorGuardado);
		// console.log(doctorGuardado);
	} catch (error) {
		console.log("Error al registrar", error);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	//Comprobar que el doctor exite
	const doctor = await Doctor.findOne({ email });
	if (!doctor) {
		const error = new Error("Doctor no registrado");
		return res.status(400).json({ msg: error.message });
	}

	//comparar las password para ver si coinciden
	const compararPassword = await bcrypt.compare(password, doctor.password);
	//Revisar el password
	if (compararPassword) {
		// console.log("enviar password", doctor);
		res.json({
			_id: doctor._id,
			nombre: doctor.nombre,
			email: doctor.email,
			especialidad: doctor.especialidad,
			role: doctor.role,
			horaInicio: doctor.horaInicio,
			horaFinal: doctor.horaFinal,
			estado: doctor.estado,
			seenNotif: doctor.seenNotif,
			unseenNotif: doctor.unseenNotif,
			token: generarJWT(doctor.id, doctor.role),
		});
	} else {
		const error = new Error("La contraseña es incorrecta");
		return res.status(403).json({ msg: error.message });
	}
};

const perfil = (req, res) => {
	const { doctor } = req;
	// console.log("console", doctor);
	res.json(doctor);
};

const marcarLeidos = async (req, res) => {
	const { _id } = req.body;

	try {
		const doctor = await Doctor.findOne({ _id });

		// console.log(doctor);
		const unseenNotif = doctor.unseenNotif;

		const seenNotif = doctor.seenNotif;

		seenNotif.push(...unseenNotif);
		doctor.unseenNotif = [];
		doctor.seenNotif = seenNotif;

		const actualizarDoctor = await doctor.save();

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
		const doctor = await Doctor.findOne({ _id });

		// console.log(doctor);

		// doctor.unseenNotif = [];
		doctor.seenNotif = [];

		const actualizarDoctor = await doctor.save();

		res.json({ msg: "Notificaciones marcadas como leída correctamente" });

		// console.log(admin, "ADMIN");
	} catch (e) {
		const error = new Error("Error al eliminar");
		return res.status(403).json({ msg: error.message });
	}
};

const actualizarPerfil = async (req, res) => {
	const doctor = await Doctor.findById(req.params.id);
	if (!doctor) {
		const error = new Error("Hubo un error");
		return res.status(400).json({ msg: error.message });
	}

	const { email } = req.body;
	if (doctor.email !== req.body.email) {
		const existeEmail = await Doctor.findOne({ email });
		if (existeEmail) {
			const error = new Error("Email ya está en uso");
			return res.status(400).json({ msg: error.message });
		}
	}

	try {
		doctor.nombre = req.body.nombre;
		doctor.email = req.body.email;
		doctor.especialidad = req.body.especialidad;
		doctor.horaInicio = req.body.horaInicio;
		doctor.horaFinal = req.body.horaFinal;

		const doctorActualizado = await doctor.save();
		res.json(doctorActualizado);
	} catch (error) {
		console.log(error);
	}
};

export { registrar, perfil, login, marcarLeidos, eliminarNotificaciones, actualizarPerfil };
