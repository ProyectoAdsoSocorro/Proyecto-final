import Period from '../models/period.js';

// Helper para calcular porcentaje automático
const calculatePercentage = (cycle, number) => {
    if (cycle === 'normal') return 25;
    if (cycle === 'semestral') return 50;
    if (cycle === 'trimestral') {
        // Trimestres 1 y 2: 33.33%, Trimestre 3: 33.34% para sumar 100%
        return number === 3 ? 33.34 : 33.33;
    }
    return 0;
};

const validateNumberByCycle = (cycle, number) => {
    if (cycle === 'semestral' && (number < 1 || number > 2)) {
        return 'En ciclo semestral, el número debe ser 1 o 2';
    }
    if (cycle === 'trimestral' && (number < 1 || number > 3)) {
        return 'En ciclo trimestral, el número debe ser de 1 a 3';
    }
    if (cycle === 'normal' && (number < 1 || number > 4)) {
        return 'En ciclo normal, el número debe ser de 1 a 4';
    }
    return null;
};

//get 
export const getAll = async (req, res) => {
    try {
        const periods = await Period.find().populate('school', 'name');
        res.json(periods);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

// GET /api/periods/:id
export const getById = async (req, res) => {
    try {
        const period = await Period.findById(req.params.id);
        if (!period) return res.status(404).json({ message: 'Periodo no encontrado' });
        res.json(period);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el periodo', error: error.message });
    }
};

// GET /api/periods/year/:year
export const getByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const periods = await Period.find({ year: parseInt(year) }).populate('school', 'name');
        res.json(periods);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar períodos por año', error: error.message });
    }
};

// POST /api/periods
export const createPeriod = async (req, res) => {
    try {
        let { school, year, cycle, number, name, startDate, endDate } = req.body;

        // Validar número según ciclo
        const errorCiclo = validateNumberByCycle(cycle, number);
        if (errorCiclo) {
            return res.status(400).json({ message: errorCiclo });
        }

        // Calcular porcentaje automáticamente
        const percentage = calculatePercentage(cycle, number);

        // Validar solapamiento de fechas en el mismo colegio/año
        const solapamiento = await Period.findOne({
            school,
            year,
            $or: [
                { startDate: { $lt: endDate, $gte: startDate } },
                { endDate: { $gt: startDate, $lte: endDate } },
                { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
            ]
        });

        if (solapamiento) {
            return res.status(400).json({ message: 'Las fechas se solapan con otro período en este colegio y año' });
        }

        const nuevoPeriodo = new Period({
            school,
            year,
            cycle,
            number,
            name,
            startDate,
            endDate,
            percentage // Asignado automáticamente
        });

        await nuevoPeriodo.save();
        res.status(201).json(nuevoPeriodo);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un período con ese número en este colegio y año' });
        }
        res.status(400).json({ message: 'Error al crear el período', error: error.message });
    }
};

// PUT /api/periods/:id
export const updatePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const { school, year, cycle, number, startDate, endDate } = req.body;

        // Obtener el período actual
        const currentPeriod = await Period.findById(id);
        if (!currentPeriod) {
            return res.status(404).json({ message: 'Período no encontrado' });
        }

        let updateData = { ...req.body };

        // Validar número según ciclo si se proporciona
        if (cycle || number) {
            const newCycle = cycle || currentPeriod.cycle;
            const newNumber = number || currentPeriod.number;

            const errorCiclo = validateNumberByCycle(newCycle, newNumber);
            if (errorCiclo) {
                return res.status(400).json({ message: errorCiclo });
            }

            updateData.percentage = calculatePercentage(newCycle, newNumber);
        }

        // Validar fechas si se proporcionan
        const newStartDate = startDate ? new Date(startDate) : currentPeriod.startDate;
        const newEndDate = endDate ? new Date(endDate) : currentPeriod.endDate;

        // Validar que la fecha de fin sea posterior a la de inicio
        if (newEndDate <= newStartDate) {
            return res.status(400).json({
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        // Validar solapamiento con otros períodos (excluyendo el actual)
        if (startDate || endDate) {
            const schoolToCheck = school || currentPeriod.school;
            const yearToCheck = year || currentPeriod.year;

            const solapamiento = await Period.findOne({
                _id: { $ne: id }, // Excluir el período actual
                school: schoolToCheck,
                year: yearToCheck,
                $or: [
                    // El nuevo período empieza dentro de otro período existente
                    { startDate: { $lte: newStartDate }, endDate: { $gt: newStartDate } },
                    // El nuevo período termina dentro de otro período existente
                    { startDate: { $lt: newEndDate }, endDate: { $gte: newEndDate } },
                    // El nuevo período contiene completamente a otro período
                    { startDate: { $gte: newStartDate }, endDate: { $lte: newEndDate } }
                ]
            });

            if (solapamiento) {
                return res.status(400).json({
                    message: `Las fechas se solapan con el período "${solapamiento.name}" (${solapamiento.startDate.toISOString().split('T')[0]} - ${solapamiento.endDate.toISOString().split('T')[0]})`
                });
            }
        }

        // Evitar que el usuario manipule el porcentaje manualmente
        let percentageWarning = null;
        if (req.body.percentage) {
            percentageWarning = 'No se puede editar el porcentaje manualmente. El porcentaje está predefinido según el ciclo y número del período.';
            delete updateData.percentage;
            const finalCycle = cycle || currentPeriod.cycle;
            const finalNumber = number || currentPeriod.number;
            updateData.percentage = calculatePercentage(finalCycle, finalNumber);
        }

        const periodoActualizado = await Period.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!periodoActualizado) {
            return res.status(404).json({ message: 'Período no encontrado' });
        }

        // Incluir advertencia si se intentó cambiar el porcentaje
        const response = {
            ...periodoActualizado.toObject()
        };

        if (percentageWarning) {
            response.warning = percentageWarning;
        }

        res.json(response);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un período con ese número en este colegio y año' });
        }
        res.status(400).json({ message: 'Error al actualizar el período', error: error.message });
    }
};

// PUT /api/periods/:id/activate
export const activatePeriod = async (req, res) => {
    try {
        const period = await Period.findById(req.params.id);
        if (!period) return res.status(404).json({ message: 'Período no encontrado' });

        // Si ya existe otro período activo para el mismo colegio y año
        const other = await Period.findOne({ school: period.school, year: period.year, active: true, _id: { $ne: period._id } }).lean();
        const force = String(req.query.force || '').toLowerCase() === 'true';

        if (other && !force) {
            // Devolver error con detalles del período activo existente
            return res.status(400).json({
                message: 'Ya existe otro período activo para este colegio y año',
                activePeriodId: other._id,
                activePeriodName: other.name || null,
                year: other.year
            });
        }

        if (other && force) {
            // Forzar: desactivar el otro período activo
            await Period.updateOne({ _id: other._id }, { active: false });
        }

        // Activar este periodo
        period.active = true;
        await period.save();

        const resp = { message: force ? 'Período activado (forzado), otro período desactivado' : 'Período activado correctamente', period };
        if (other && force) resp.deactivatedPeriodId = other._id;
        res.json(resp);
    } catch (error) {
        console.error('Error al activar período:', error);
        res.status(500).json({ message: 'Error al activar el período' });
    }
};

// PUT /api/periods/:id/deactivate
export const deactivatePeriod = async (req, res) => {
    try {
        const periodo = await Period.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );
        if (!periodo) return res.status(404).json({ message: 'Período no encontrado' });
        res.json({ message: 'Período desactivado', periodo });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el período', error: error.message });
    }
};

// DELETE /api/periods/:id
export const deletePeriod = async (req, res) => {
    try {
        const periodo = await Period.findByIdAndDelete(req.params.id);
        if (!periodo) return res.status(404).json({ message: 'Período no encontrado' });
        res.json({ message: 'Período eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el período', error: error.message });
    }
};
