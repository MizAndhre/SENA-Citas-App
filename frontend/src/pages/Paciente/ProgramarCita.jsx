import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { useParams } from "react-router-dom";

const ProgramarCita = () => {
	const [doctor, setDoctor] = useState([]);
	const params = useParams();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const obtenerDoctorId = async () => {
			try {
				const url = `/usuarios/obtener-doctor-id/${params.id}`;
				const { data } = await clienteAxios.get(url, config);

				// const doctorObtenido = doctor[0];
				setDoctor(data[0]);
			} catch (error) {
				console.log(error.response.data.msg);
			}
		};

		obtenerDoctorId();
	}, []);

	console.log(doctor);

	return (
		<>
			<h1 className='titulo'>Programar Cita</h1>

			<h2 className='subtitulo'>{doctor.nombre}</h2>
		</>
	);
};

export default ProgramarCita;
