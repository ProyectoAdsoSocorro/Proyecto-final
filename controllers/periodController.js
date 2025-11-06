import Period from '../models/period.js';

// Validar que por porcentajes no pasen del 100%
const validateTotalPercentage = async (schoolId, year, periodId = null) => {
    const periods = await Period.find(
        {
            school: schoolId,
            year,
            ...(periodId ? { _id: { $ne: periodId } } : {})
        }
    );
    const sum = periods.reduce((acc, p) => acc + p.percentage, 0);
    return sum;
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
        const { school, year, cycle, number, name, startDate, endDate, percentage } = req.body;

        // Validar número según ciclo
        const errorCiclo = validateNumberByCycle(cycle, number);
        if (errorCiclo) {
            return res.status(400).json({ message: errorCiclo });
        }

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

        // Validar porcentaje total
        const sumaActual = await validateTotalPercentage(school, year);
        if (sumaActual + percentage > 100) {
            return res.status(400).json({
                message: `La suma de porcentajes excedería el 100%. Actual: ${sumaActual}%, nuevo: ${percentage}%`
            });
        }

        const nuevoPeriodo = new Period(req.body);
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
        const { school, year, cycle, number, percentage } = req.body;

        // Validar número según ciclo
        if (cycle && number !== undefined) {
            const errorCiclo = validateNumberByCycle(cycle, number);
            if (errorCiclo) {
                return res.status(400).json({ message: errorCiclo });
            }
        }

        // Validar porcentaje total (excluyendo el actual)
        const sumaActual = await validateTotalPercentage(school, year, id);
        if (percentage !== undefined && sumaActual + percentage > 100) {
            return res.status(400).json({
                message: `La suma de porcentajes excedería el 100%. Actual (sin este): ${sumaActual}%, nuevo: ${percentage}%`
            });
        }

        const periodoActualizado = await Period.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!periodoActualizado) {
            return res.status(404).json({ message: 'Período no encontrado' });
        }

        res.json(periodoActualizado);
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
        const periodo = await Period.findByIdAndUpdate(
            req.params.id,
            { active: true },
            { new: true }
        );
        if (!periodo) return res.status(404).json({ message: 'Período no encontrado' });
        res.json({ message: 'Período activado', periodo });
    } catch (error) {
        res.status(500).json({ message: 'Error al activar el período', error: error.message });
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
