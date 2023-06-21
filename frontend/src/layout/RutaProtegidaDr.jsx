/* eslint-disable react/prop-types */

import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const RutaProtegidaDr = () => {
	const { auth, cargando } = useAuth();

	// console.log(auth);

	//Poner un spínner aquí
	if (cargando) return "cargando...";

	return (
		<>
			{auth?._id && auth.role === "doctor" ? (
				<div className='flex h-screen'>
					<Sidebar />

					<div className='flex flex-col w-full'>
						<Header />

						<main className='border-2 border-teal-800 rounded-md shadow-md mx-5 mb-5 flex-grow p-5'>
							<Outlet />
						</main>
					</div>
				</div>
			) : (
				<Navigate to='/' />
			)}
		</>
	);
};

export default RutaProtegidaDr;
