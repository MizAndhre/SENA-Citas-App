/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import clienteAxios from "../config/axios";
import useAlerta from "../hooks/useAlerta";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [cargando, setCargando] = useState(true);
	const [auth, setAuth] = useState({});

	const { alertaError, alertaExito } = useAlerta();

	console.log(auth);

	// ? Obtener los diferentes perfiles según el Usuario
	const obtenerPerfilPaciente = async (config) => {
		// Lógica para obtener perfil de paciente
		try {
			// Utiliza la API para obtener la información del paciente
			const { data } = await clienteAxios.get("/usuarios/perfil", config);

			// Actualizar el estado 'auth' con la información obtenida del perfil del paciente/usuario
			setAuth(data);
		} catch (error) {
			// En caso de error, como una respuesta no exitosa de la API
			console.log(error.response.data.msg);
			// Establecer 'auth' como un objeto vacío para indicar que no se pudo obtener el perfil del paciente
			setAuth({});
		}
	};
	const obtenerPerfilDoctor = async (config) => {
		// Lógica para obtener perfil de doctor
		// Utiliza la API correspondiente para obtener la información del doctor
		try {
			const { data } = await clienteAxios.get("/doctores/perfil", config);

			setAuth(data);
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}
	};
	const obtenerPerfilAdmin = async (config) => {
		// Lógica para obtener perfil de administrador
		// Utiliza la API correspondiente para obtener la información del administrador
		try {
			const { data } = await clienteAxios.get("/admins/perfil", config);

			setAuth(data);
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}
	};
	// ? Autenticar y verificar qué tipo de usuario es, actualiza los componentes
	const autenticarUsuario = async () => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");

		if (!token || !role) {
			setCargando(false);
			return;
		}

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			if (role === "usuario") {
				await obtenerPerfilPaciente(config);
			} else if (role === "doctor") {
				await obtenerPerfilDoctor(config);
			} else if (role === "admin") {
				await obtenerPerfilAdmin(config);
			}
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}

		setCargando(false);
	};
	// ? Mandar a llamar autenticacion del Usuario cuando la pagina cargue una vez
	useEffect(() => {
		autenticarUsuario();
	}, []);

	// ? Cerrar la sesión de cualquier usuario
	const cerrarSesion = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		setAuth({});
	};

	// ? Obtener las Notificaciones según el usuario
	// ! Falta Terminar
	const obtenerNotifPaciente = async (config) => {
		try {
			const url = "/usuarios/marcar-leidos";
			// console.log(auth._id);
			const { data } = await clienteAxios.post(url, { _id: auth._id }, config);

			// console.log(data);
			toast.custom(alertaExito(data.msg));
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
		}
	};
	const obtenerNotifDoctor = async (config) => {
		try {
			const url = "/doctores/marcar-leidos";
			// console.log(auth._id);
			const { data } = await clienteAxios.post(url, { _id: auth._id }, config);

			// console.log(data);
			toast.custom(alertaExito(data.msg));
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
		}
	};
	const obtenerNotifAdmin = async (config) => {
		try {
			const url = "/admins/marcar-leidos";
			// console.log(auth._id);
			const { data } = await clienteAxios.post(url, { _id: auth._id }, config);

			// console.log(data);
			toast.custom(alertaExito(data.msg));
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
		}
	};
	// ? Autenticar y verificar el usuario para marcar las Notificaciones
	const marcarLeidos = async () => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		// console.log(token, role);

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			if (role === "usuario") {
				await obtenerNotifPaciente(config);
			} else if (role === "doctor") {
				await obtenerNotifDoctor(config);
			} else if (role === "admin") {
				await obtenerNotifAdmin(config);
			}
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}

		autenticarUsuario();
	};

	// ? Eliminar las Notificaciones según el usuario
	// ! Falta Terminar
	const eliminarNotifPaciente = () => {};
	const eliminarNotifDoctor = async (config) => {
		try {
			const url = "/doctores/eliminar-notificaciones";
			console.log(auth._id);
			const { data } = await clienteAxios.post(url, { _id: auth._id }, config);

			console.log(data);
			toast.custom(alertaExito(data.msg));
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
		}
	};
	const eliminarNotifAdmin = async (config) => {
		try {
			const url = "/admins/eliminar-notificaciones";
			console.log(auth._id);
			const { data } = await clienteAxios.post(url, { _id: auth._id }, config);

			console.log(data);
			toast.custom(alertaExito(data.msg));
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
		}
	};
	// ? Autenticar y verificar el usuario para eliminar las Notificaciones
	const eliminarNotificaciones = async () => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		console.log(token, role);

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			if (role === "usuario") {
				await eliminarNotifPaciente(config);
			} else if (role === "doctor") {
				await eliminarNotifDoctor(config);
			} else if (role === "admin") {
				await eliminarNotifAdmin(config);
			}
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}

		autenticarUsuario();
	};

	// ? Actualizar el perfil según el usuario
	// ! Falta Terminar
	const actualizarPerfilPaciente = async (config, datos) => {};
	const actualizarPerfilAdmin = async (config, datos) => {};
	const actualizarPerfilDoctor = async (config, datos) => {
		try {
			const url = `/doctores/perfil/${datos._id}`;
			const { data } = await clienteAxios.put(url, datos, config);
			console.log(data);

			toast.custom(alertaExito("Actualizado Correctamente"));
		} catch (error) {
			return {
				msg: error.response.data.msg,
				error: true,
			};
		}
	};
	// ? Autenticar y verificar el usuario para actualizarlo
	const actualizarPerfil = async (datos) => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");

		if (!token) {
			setCargando(false);
			return;
		}

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			if (role === "usuario") {
				await actualizarPerfilPaciente(config, datos);
			} else if (role === "doctor") {
				await actualizarPerfilDoctor(config, datos);
			} else if (role === "admin") {
				await actualizarPerfilAdmin(config, datos);
			}
		} catch (error) {
			console.log(error.response.data.msg);
			setAuth({});
		}
	};

	// ? Autenticar y verificar el usuario para realizar cambio de contraseña
	// const guardarPassword = async (datos) => {
	// 	const token = localStorage.getItem("token");

	// 	if (!token) {
	// 		setCargando(false);
	// 		return;
	// 	}

	// 	const config = {
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	};

	// 	try {
	// 		const url = `/veterinarios/actualizar-password`;
	// 		const { data } = await clienteAxios.put(url, datos, config);
	// 		console.log(data);
	// 		return {
	// 			msg: data.msg,
	// 			error: false,
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			msg: error.response.data.msg,
	// 			error: true,
	// 		};
	// 	}
	// };

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				autenticarUsuario,
				cargando,
				cerrarSesion,
				marcarLeidos,
				eliminarNotificaciones,
				actualizarPerfil,
				// guardarPassword,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };

export default AuthContext;
