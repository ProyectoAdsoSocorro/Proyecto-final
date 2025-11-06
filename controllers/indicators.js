import Indicators from "../models/indicators.js";


  const httpIndicators = {

    getIndicators: async (req, res) =>{
        try {
            const allIndicators = await Indicators.find()
                .populate('academicLoad')
                .populate('period')
                .populate('userWhoDidIt');
            
          res.status(200).json({message:"Todos los Indicadores", allIndicators});
            
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores"})
        }
    },

       getIndicatorById: async (req, res) =>{
        try {
            const indicatorsId = req.params.id;
            const indicator = await Indicators.findById(indicatorsId)
                .populate('academicLoad')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicador por ID", indicator})
        } catch (error) {
            res.status(500).json({message:"Error al obtener el Indicador por ID"})
        }
    },

     getIndicatorsByAcademicLoad: async (req, res)=>{

              try {
                    const academicLoadId = req.params.academicLoadId;
                    const indicator = await Indicators.find({ academicLoad: academicLoadId })
                        .populate('academicLoad')
                        .populate('period')
                        .populate('userWhoDidIt');
                    res.status(200).json({message:"Indicadores por Carga Académica", indicator })

            
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Carga Académica" , error: error.message})
        }
     },

      getIndicatorsByPeriod: async (req, res) => {
    try {
        const periodId = req.params.periodsId;

        
        if (!periodId) {
            return res.status(400).json({
                message: "El ID del periodo es requerido"
            });
        }


        // Buscar indicadores para ese periodo
        const indicators = await Indicators.find({ 
            period: periodId,
            active: true  
        })
        .populate('academicLoad')
        .populate('period')
        .populate('userWhoDidIt')
        .lean();

       
        if (!indicators || indicators.length === 0) {
            return res.status(200).json({
                message: "No se encontraron indicadores para este periodo",
                periodId: periodId,
                total: 0,
                indicators: []
            });
        }

        
        return res.status(200).json({
            message: "Indicadores encontrados",
            periodId: periodId,
            total: indicators.length,
            indicators
        });

    } catch (error) {
        console.error('Error en getIndicatorsByPeriod:', error);
        return res.status(500).json({
            message: "Error al obtener los Indicadores por Periodo",
            error: error.message
        });
    }
},

         // Obtener indicadores por usuario
    getIndicatorsByUser: async (req, res) => {
        try {
            const { usersId } = req.params;

        // indicadores activos para ese usuario
        const indicators = await Indicators.find({
            userWhoDidIt: usersId,
            active: true
        }).populate('academicLoad')
          .populate('period')
          .lean();

        
        if (!indicators || indicators.length === 0) {
            return res.status(200).json({
                message: "No se encontraron indicadores para este usuario",
                userId: usersId,
                indicators: []
            });
        }

        return res.status(200).json({
            message: "Indicadores encontrados",
            total: indicators.length,
            indicators
        });

        } catch (error) {
            console.error('Error en getIndicatorsByUser:', error);
            return res.status(500).json({
                message: "Error al obtener indicadores del usuario",
                error: error.message
            });
        }
    },
        getIndicatorsByYear: async (req, res) => {
    try {
        const year = req.params.years;
        
      
        if (!year) {
            return res.status(400).json({
                message: "El año es requerido",
            });
        }

        //  indicadores por año
        const indicators = await Indicators.find({ 
            year: year,
            active: true 
        })
        .populate('academicLoad')
        .populate('period')
        .populate('userWhoDidIt')
        .lean();

        // Si no hay resultados
        if (!indicators || indicators.length === 0) {
            return res.status(200).json({
                message: "No se encontraron indicadores para el año especificado",
                year: year,
                total: 0,
                indicators: []
            });
        }

        
        return res.status(200).json({
            message: "Indicadores encontrados",
            year: year,
            total: indicators.length,
            indicators
        });

    } catch (error) {
        console.error('Error en getIndicatorsByYear:', error);
        return res.status(500).json({
            message: "Error al obtener los Indicadores por Año",
            error: error.message
        });
    }
},


   /*  getIndicatorsByGroup: async (req, res) =>{
        try {
            const indicatorGroup = req.params.indicatorGroup
            const indicatorsByGroup = await indicators.find({cluster: indicatorGroup})
                .populate('School')
                .populate('validity')
                .populate('cluster')
                .populate('subject')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicadores por Grupo", indicatorsByGroup})
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Grupo"})
        }
    }, */

     /* getIndicatorsBySubject: async (req, res) =>{
        try {
            const indicatorSubject = req.params.indicatorSubject
            const indicatorsBySubject = await indicators.find({subject: indicatorSubject})
                .populate('School')
                .populate('validity')
                .populate('cluster')
                .populate('subject')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicadores por Asignatura", indicatorsBySubject})
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Asignatura"})
        }
    },
 */
     /*  getIndicatorsByPeriod: async (req, res) =>{
        try {
            const indicatorPeriod = req.params.indicatorPeriod
            const indicatorsByPeriod = await indicators.find({period: indicatorPeriod})
                .populate('School')
                .populate('validity')
                .populate('cluster')
                .populate('subject')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicadores por Periodo", indicatorsByPeriod})
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Periodo"})
        }
    }, */
     /*  getIndicatorsByUser: async (req, res) =>{
        try {
            const indicatorUser = req.params.indicatorUser
            const indicatorsByUser = await indicators.find({user: indicatorUser})
                .populate('School')
                .populate('validity')
                .populate('cluster')
                .populate('subject')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicadores por Usuario", indicatorsByUser})

        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Usuario"})
        }
    }, */

    /*  getIndicatorsByValidity: async (req, res) => {
        try {
            const validityId = req.params.validityId;
            const indicatorsByValidity = await indicators.find({validity: validityId})
                .populate('School')
                .populate('validity')
                .populate('cluster')
                .populate('subject')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicadores por Vigencia", indicatorsByValidity})
        } catch (error) {
            res.status(500).json({message:"Error al obtener los Indicadores por Vigencia", error: error.message})
        }
    }, */

      
createIndicator: async (req, res) => {
   try {
     const newIndicator = new Indicators(req.body);
     const savedIndicator =  await newIndicator.save();
     const populatedIndicator = await Indicators.findById(savedIndicator._id)
  .populate('academicLoad')
  .populate('period')
  .populate('userWhoDidIt');
     res.status(200).json({ message: "Indicador creado correctamente", populatedIndicator });
   } catch (error) {
     console.error('Error al crear indicador:', error);
     res.status(500).json({
       message: "Error al crear el Indicador",
       error: error.message
     });
   }
},

      updateIndicator: async (req, res) =>{
        try {
            
            const indicatorId = req.params.id;
            const updateindicator = await Indicators.findByIdAndUpdate(indicatorId, req.body, {new: true})
                .populate('academicLoad')
                .populate('period')
                .populate('userWhoDidIt');
            res.status(200).json({message:"Indicador actualizado correctamente", updateindicator})
        } catch (error) {
            res.status(500).json({message:"Error al actualizar el Indicador"})
        }
    },
      activeIndicator: async (req, res) => {
    try {
        const { id } = req.params;
        const indicator = await Indicators.findById(id);

        if (!indicator) {
            return res.status(404).json({ message: "Indicador no encontrado" });
        }

        if (indicator.active) {
            return res.status(400).json({ message: "El indicador ya se encuentra activo", indicator });
        }

        
        const updatedIndicator = await Indicators.findByIdAndUpdate(
            id,
            { $set: { active: true } },
            { new: true } // devolver documento actualizado
        )
        .populate('academicLoad')
        .populate('period')
        .populate('userWhoDidIt');

        return res.status(200).json({ message: "Indicador activado correctamente", indicator: updatedIndicator });

    } catch (error) {
        console.error("Error al activar indicador:", error);
        return res.status(500).json({ message: "Error al activar el Indicador", error: error.message });
    }
},

       deactiveIndicator: async (req, res) => {
        try {
            const { id } = req.params;
            const indicator = await Indicators.findById(id);

            if (!indicator) {
                return res.status(404).json({ message: "Indicador no encontrado" });
            }

            if (!indicator.active) {
                return res.status(400).json({ message: "El indicador ya se encuentra desactivado", indicator });
            }

            indicator.active = false;
            await indicator.save();

            return res.status(200).json({ message: "Indicador desactivado correctamente", indicator });

        } catch (error) {
            console.error("Error al desactivar indicador:", error);
            return res.status(500).json({ message: "Error al desactivar el Indicador", error: error.message });
        }
    },
     deleteIndicator: async (req, res) =>{
        try {
           
            const {id} = req.params;
            const deleteindicator = await Indicators.findByIdAndDelete(id)
            res.status(200).json({message:"Indicador eliminado correctamente", deleteindicator})   
        } catch (error) {
            res.status(500).json({message:"Error al eliminar el Indicador"})
        }
    },
    
  }
  export default httpIndicators;