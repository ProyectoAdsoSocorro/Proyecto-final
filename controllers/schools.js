import Colegio from "../models/schools.js";

const httpSchools = {
    getSchools: async (req, res)=>{
        try {
            const schools = await Colegio.find()
            res.json(schools);
        } catch (error) {
            res.status(500).json({message: "Error al obtener los colegios"});
        }
    },  

    getSchoolById : async (req, res)=>{
        try {
            const {id} = req.params;
            console.log(id);
            const school = await Colegio.findById(id)
            if(!school){
                return res.status(404).json({message: "Colegio no encontrado"});
            }
            res.json({school});
        } catch (error) {
            res.status(500).json({message: "Error al obtener el colegio"});
        }
    },

    createSchool: async (req, res)=>{
        try {
            const { core_address } = req.body;
            
            if (!core_address) {
                return res.status(400).json({ message: "El core_address es requerido" });
            }

            const school = new Colegio(req.body);
            await school.save();
            res.status(201).json({ message: "Colegio creado correctamente", school }); // Cambiado 'colegio' por 'school'
        } catch (error) {
            res.status(500).json({message: "Error al crear el colegio", error: error.message});
        }
    },
    updateSchool: async (req, res)=>{
        try {
            const {id} = req.params;
            const { core_address } = req.body;
            const school = await Colegio.findByIdAndUpdate(id, req.body, {new: true}) 
            if(!school){
                return res.status(404).json({message: "Colegio no encontrado"});
            }
            res.json({ message: "Colegio actualizado correctamente", school});

        } catch (error) {
            res.status(500).json({message:"Error al actualizar el Colegio", error: error.message})
        }
    },


    activateSchool: async (req, res)=>{
        try {
         const {id} = req.params;
         const school = await Colegio.findByIdAndUpdate(
             id,
             {active: true},
             {new: true}
         )
         if(!school){
            return res.status(404).json({ message: "Colegio no Encontrado"})
         }
         res.json({message: "Colegio Activado Correctamente", school})


        } catch (error) {
            res.status(500).json({message:"Error al Activar el Colegio"})
        }

    },

    deactivateSchool: async(req, res)=>{
        try {
        const { id } = req.params;
        const school = await Colegio.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        );
        if (!school) {
            return res.status(404).json({ message: "Colegio no encontrado" });
        }
        res.json({ message: "Colegio desactivado correctamente", school });
    } catch (error) {
        res.status(500).json({ message: "Error al desactivar el colegio" });
    }

    },


    deleteSchool: async (req, res)=>{

        try {
            const {id} = req.params;
            const school = await Colegio.findByIdAndDelete(id);
            res.json({ message: "Colegio borrado correctamente", school});
            
        } catch (error) {
            res.status(500).json({message: "Error al borrar el colegio"});
        }
    }



}

export default httpSchools;
