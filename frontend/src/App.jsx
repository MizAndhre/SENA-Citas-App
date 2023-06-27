import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
//Proveedores
import { AlertaProvider } from "./context/AlertaProvider";
import { AuthProvider } from "./context/AuthProvider";

// Rutas Públicas
import AuthLayout from "./layout/AuthLayout";

import Inicio from "./pages/Inicio";

//Usuario/Paciente
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import Perfil from "./pages/Paciente/Perfil";
import RutaProtegida from "./layout/RutaProtegida";

// Doctor
import LoginDoctor from "./pages/Doctor/LoginDoctor";
import RutaProtegidaDr from "./layout/RutaProtegidaDr";
import PerfilDoctor from "./pages/Doctor/PerfilDoctor";
import RegistrarDoctor from "./pages/Doctor/RegistrarDoctor";

// Admin
import LoginAdmin from "./pages/Admin/LoginAdmin";
import RutaProtegidaAdmin from "./layout/RutaProtegidaAdmin";
import PerfilAdmin from "./pages/Admin/PerfilAdmin";
import Notificaciones from "./components/Notificaciones";
import ListaDoctores from "./pages/Admin/ListaDoctores";
import ListaPacientes from "./pages/Admin/ListaPacientes";
import EditarPerfilDoctor from "./pages/Doctor/EditarPerfilDoctor";

// import OlvidePassword from "../not_used/OlvidePassword";

// Rutas Privadas

function App() {
	return (
		<>
			<BrowserRouter>
				<Toaster />
				<AlertaProvider>
					<AuthProvider>
						<Routes>
							{/* Ruta de Inicio */}
							{/* <Route path='/' element={<RutaProtegida />}>
								<Route index element={<Inicio />} />
							</Route> */}
							<Route path='/' element={<Inicio />} />

							{/* Rutas Públicas Paciente*/}
							<Route path='/usuario' element={<AuthLayout />}>
								<Route index element={<Login />} />
								<Route path='registrar' element={<Registrar />} />
							</Route>

							{/* Ruta Publica Doctores */}
							<Route path='/doctor' element={<AuthLayout />}>
								<Route index element={<LoginDoctor />} />
								<Route path='registrar' element={<RegistrarDoctor />} />
							</Route>

							{/* Ruta Publica Admin */}
							<Route path='/admin' element={<AuthLayout />}>
								<Route index element={<LoginAdmin />} />
								{/* <Route path='registrar' element={<RegistrarDoctor />} /> */}
							</Route>

							{/* Rutas Privadas Paciente*/}
							<Route path='/paciente/perfil' element={<RutaProtegida />}>
								<Route index element={<Perfil />} />
								<Route path='notificacion' element={<Notificaciones />} />
							</Route>

							{/* Rutas Privadas Paciente*/}
							<Route path='/doctor/perfil/' element={<RutaProtegidaDr />}>
								<Route index element={<PerfilDoctor />} />
								<Route path='notificacion' element={<Notificaciones />} />
								<Route path='editar' element={<EditarPerfilDoctor />} />
							</Route>

							{/* Rutas Privadas Paciente*/}
							<Route path='/admin/perfil' element={<RutaProtegidaAdmin />}>
								<Route index element={<PerfilAdmin />} />
								<Route path='notificacion' element={<Notificaciones />} />
								<Route path='lista-doctores' element={<ListaDoctores />} />
								<Route path='lista-pacientes' element={<ListaPacientes />} />
							</Route>

							<Route path='*' element={<Navigate to='/' />} />
						</Routes>
					</AuthProvider>
				</AlertaProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
