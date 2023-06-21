import mongoose from "mongoose";

const citaSchema = new mongoose.Schema(
	{
		usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Usario",
			required: true,
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
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
			default: "pendiente",
		},
	},
	{
		timestamps: true,
	}
);

//registrarlo en mongoose
const Cita = mongoose.model("Cita", citaSchema);
export default Cita;
