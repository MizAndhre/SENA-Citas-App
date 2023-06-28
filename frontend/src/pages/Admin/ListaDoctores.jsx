import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { toast } from "react-hot-toast";
import useAlerta from "../../hooks/useAlerta";
import useAuth from "../../hooks/useAuth";

const ListaDoctores = () => {
	const [doctores, setDoctores] = useState([]);
	const { alertaError, alertaExito } = useAlerta();
	const { autenticarUsuario } = useAuth();

	const token = localStorage.getItem("token");
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	const obtenerDoctores = async () => {
		try {
			const { data } = await clienteAxios.get("/admins/obtener-doctores", config);
			// console.log(data);
			setDoctores(data);
			autenticarUsuario();
			// toast.custom(alertaExito(data.msg));
		} catch (error) {
			console.log(error.response.data.msg);
		}
	};

	useEffect(() => {
		obtenerDoctores();
	}, []);
	console.log(doctores);
	const cambiarEstadoDoctor = async (doctorId, estado) => {
		console.log(doctorId, estado);

		try {
			//url y enviar datos al backend
			const url = "/admins/cambiar-estado-doctores";
			const { data } = await clienteAxios.post(
				url,
				{
					doctorId,
					estado,
				},
				config
			);
			console.log(data);
			toast.custom(alertaExito(data.msg));
			obtenerDoctores();
		} catch (error) {
			toast.custom(alertaError(error.response.data.msg));
			console.log(error.response.data);
		}
	};

	return (
		<>
			<h1 className='titulo'> Lista de Doctores</h1>

			<div className='overflow-x-auto'>
				<table className='tabla'>
					<thead className='tabla-head'>
						<tr>
							<th className='columna'>#</th>
							<th className='columna'>Nombre</th>
							<th className='columna'>Email</th>
							<th className='columna'>Creado</th>
							<th className='columna'>Estado</th>
							<th className='columna'>Acción</th>
						</tr>
					</thead>

					<tbody className='tabla-body'>
						{doctores.map((doctor, i) => (
							<tr key={doctor._id}>
								<td className='tabla-celda'>{i + 1}</td>
								<td className='tabla-celda'>{doctor.nombre}</td>
								<td className='tabla-celda'>{doctor.email}</td>
								<td className='tabla-celda'>{doctor.createdAt}</td>
								<td className='tabla-celda capitalize'>{doctor.estado}</td>
								<td className='tabla-celda enlace-tabla'>
									{doctor.estado === "pendiente" && (
										<p onClick={() => cambiarEstadoDoctor(doctor._id, "aprobada")}>
											Aprobar
										</p>
									)}
									{doctor.estado === "aprobada" && (
										<p onClick={() => cambiarEstadoDoctor(doctor._id, "bloqueada")}>
											Bloquear
										</p>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ListaDoctores;
