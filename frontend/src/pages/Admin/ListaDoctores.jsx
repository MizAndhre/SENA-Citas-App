import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";

const ListaDoctores = () => {
	const [doctores, setDoctores] = useState([]);

	useEffect(() => {
		const obtenerDoctores = async () => {
			const token = localStorage.getItem("token");

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const { data } = await clienteAxios.get("/admins/obtener-doctores", config);
				// console.log(data);
				setDoctores(data);
				// toast.custom(alertaExito(data.msg));
			} catch (error) {
				console.log(error.response.data.msg);
			}
		};

		obtenerDoctores();
	}, []);

	
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
								<td className='tabla-celda capitalize'>{doctor.activado}</td>
								<td className='tabla-celda enlace-tabla'>
									{doctor.activado === "pendiente" && "Aprobar"}
									{doctor.activado === "aprobado" && "Bloquear"}
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
