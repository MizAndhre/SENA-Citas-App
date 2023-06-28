import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
	const { auth } = useAuth();
	const location = useLocation();

	// console.log(location);
	// Obtener un menu dependiendo del ROLE que está en el Context de Auth
	const obtenerMenu = () => {
		if (auth.role === "usuario") {
			return [
				{
					name: "Inicio",
					link: "/paciente/perfil",
					icon: "fa-solid fa-house",
				},
				{
					name: "Citas",
					link: "/paciente/perfil",
					icon: "fa-solid fa-calendar",
				},
				{
					name: "Historial Citas",
					link: "/paciente/perfil",
					icon: "fa-solid fa-clipboard-list",
				},
				{
					name: "Perfil",
					link: "/paciente/perfil",
					icon: "fa-solid fa-user",
				},
			];
		} else if (auth.role === "doctor") {
			return [
				{
					name: "Inicio",
					link: "/doctor/perfil",
					icon: "fa-solid fa-house",
				},
				{
					name: "Citas",
					link: "/doctor/perfil",
					icon: "fa-solid fa-calendar",
				},
				{
					name: "Historial Citas",
					link: "/doctor/perfil",
					icon: "fa-solid fa-clipboard-list",
				},
				{
					name: "Perfil",
					link: "/doctor/perfil/editar",
					icon: "fa-solid fa-user",
				},
			];
		} else if (auth.role === "admin") {
			return [
				{
					name: "Inicio",
					link: "/admin/perfil",
					icon: "fa-solid fa-house",
				},
				{
					name: "Pacientes",
					link: "/admin/perfil/lista-pacientes",
					icon: "fa-solid fa-calendar",
				},
				{
					name: "Doctores",
					link: "/admin/perfil/lista-doctores",
					icon: "fa-solid fa-clipboard-list",
				},
				{
					name: "Agregar Doctor",
					link: "/admin/perfil",
					icon: "fa-solid fa-user",
				},
			];
		} else {
			return [];
		}
	};
	// Llamar la funcion y almacenar lo retornado en una variable
	const menuObtenido = obtenerMenu();

	const [open, setOpen] = useState(true);

	return (
		<>
			<section className='flex gap-6'>
				<div className={`bg-teal-800 h-screen ${open ? "w-72" : "w-16"} text-white px-4`}>
					{/* ? ICONO */}
					<div className='py-3 flex justify-end'>
						<i
							className={`fa-solid 
							${open ? "fa-x" : "fa-bars"} 
							cursor-pointer text-2xl`}
							onClick={() => setOpen(!open)}></i>
					</div>

					{/* Mostrar el texto del Menú  Segun el role del Usuario*/}
					<div className='mt-4 flex flex-col gap-4 relative'>
						{menuObtenido?.map((menu, i) => (
							<Link
								to={menu.link}
								key={i}
								className={`group flex items-center text-xl
								hover:bg-teal-900
								 gap-3.5 font-semibold py-2 px-4 rounded-md

								 ${location.pathname === menu.link && "bg-teal-950"}

								`}>
								<div className='text-2xl'>
									<i className={menu.icon}></i>
								</div>
								<h2
									style={{
										transitionDelay: `${i + 3}00ms`,
									}}
									className={`whitespace-pre duration-500 ${
										!open && "opacity-0 translate-x-28 overflow-hidden"
									}`}>
									{menu.name}
								</h2>
								<h2
									className={`${
										open && "hidden"
									} absolute left-48 bg-teal-800 font-semibold whitespace-pre 
									
									rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:p-2 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>
									{menu.name}
								</h2>
							</Link>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Sidebar;

{
	/* <section className='flex gap-6'>
				<div className='bg-teal-600 min-h-screen w-72 text-black px-4'>
					<div className='py-3 flex justify-end'>
						<i className='fa-solid fa-bars cursor-pointer text-2xl'></i>
					</div>
					<div className='mt-4 flex flex-col gap-4 relative'>
						<Link to={"/"}>
							<div>
								<i className='fa-solid fa-bars cursor-pointer text-2xl'></i>
							</div>
							<h2>Home</h2>
						</Link>
					</div>
				</div>

				<div className='m-3 text-xl text-gray-900 font-semibold'>Tutorial</div>
			</section> */
}
