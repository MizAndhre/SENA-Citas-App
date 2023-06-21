import mongoose from "mongoose";

const historialCitaSchema = new mongoose.Schema(
	{
		cita: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cita",
			required: true,
		},
		fecha: {
			type: Date,
			required: true,
		},
		hora: {
			type: String,
			required: true,
		},
		motivo: {
			type: String,
			default: null,
		},
		estado: {
			type: String,
			required: true,
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
			required: true,
		},
		usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Usuario",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

//registrarlo en mongoose
const HistorialCita = mongoose.model("HistorialCita", historialCitaSchema);
export default HistorialCita;


