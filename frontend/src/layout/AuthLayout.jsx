import { Outlet } from "react-router-dom";

const AuthLayout = () => {
	return (
		<>
			<div className=' bg-gray-300 w-screen min-h-screen flex'>
				<main className='container mx-auto md:grid md:grid-cols-2 px-6 gap-24 items-center my-12 md:my-0'>
					<Outlet />
				</main>
			</div>
		</>
	);
};

export default AuthLayout;
