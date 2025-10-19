import Group from '../models/group.model.js';
//import Student from '../models/student.model.js';
//import Guardian from '../models/guardian.model.js';

//import SchoolBranch from '../models/schoolBranch.model.js';
//import SchoolUser from '../models/schoolUser.model.js';

const GroupController = {

    createGroup: async (req, res) => {
        console.log('Attempting to create a new group...');
        try {
            const newGroup = new Group(req.body);
            const savedGroup = await newGroup.save();

            res.status(201).json({
                success: true,
                message: "Group created successfully",
                data: savedGroup
            });
        } catch (error) {
            console.error('Error in createGroup:', error);
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'A group with the same combination of Branch, Year, and Grade already exists.'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error creating group.'
            });
        }
    },


    createGroupInBranch: async (req, res) => {
        const { branchId } = req.params;
        console.log(`Attempting to create a new group in branch ID: ${branchId}`);
        try {
            const groupData = { ...req.body, schoolBranch: branchId };
            const newGroup = new Group(groupData);
            const savedGroup = await newGroup.save();

            res.status(201).json({
                success: true,
                message: `Group created successfully in branch ${branchId}`,
                data: savedGroup
            });
        } catch (error) {
            console.error('Error in createGroupInBranch:', error);
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'A group with the same combination of Branch, Year, and Grade already exists.'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error creating group in branch.'
            });
        }
    },

    getGroupsByYear: async (req, res) => {
        const { year } = req.params;
        console.log(`Fetching groups for year: ${year}`);
        try {
            const groups = await Group.find({ year: Number(year) })
                .populate('schoolBranch', 'name city')
                .populate('groupDirector', 'firstName lastName');

            res.status(200).json({
                success: true,
                message: `Found ${groups.length} groups for the year ${year}.`,
                data: groups
            });
        } catch (error) {
            console.error('Error in getGroupsByYear:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching groups by year.'
            });
        }
    },


    getGroupsByBranch: async (req, res) => {
        const { branchId } = req.params;
        console.log(`Fetching groups for branch ID: ${branchId}`);
        try {
            const groups = await Group.find({ schoolBranch: branchId })
                .populate('groupDirector', 'firstName lastName email')
                .sort({ year: -1, level: 1 });

            res.status(200).json({
                success: true,
                message: `Found ${groups.length} groups for branch ${branchId}.`,
                data: groups
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'The provided branch ID has an invalid format.'
                });
            }
            console.error('Error in getGroupsByBranch:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching groups by branch.'
            });
        }
    },


    getGroupById: async (req, res) => {
        const { id } = req.params;
        console.log(`Fetching group with ID: ${id}`);
        try {
            const group = await Group.findById(id)
                .populate('schoolBranch', 'name city address')
                .populate('groupDirector', 'firstName lastName email');

            if (!group) {
                return res.status(404).json({
                    success: false,
                    message: `Group with ID ${id} not found.`
                });
            }
            res.status(200).json({
                success: true,
                message: "Group found successfully.",
                data: group
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'The provided group ID has an invalid format.'
                });
            }
            console.error('Error in getGroupById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching group.'
            });
        }
    },


    updateGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Updating group with ID: ${id}`);
        try {
            const updatedGroup = await Group.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedGroup) {
                return res.status(404).json({
                    success: false,
                    message: `Group with ID ${id} not found.`
                });
            }
            res.status(200).json({
                success: true,
                message: "Group updated successfully.",
                data: updatedGroup
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Uniqueness error: The data conflicts with an existing group.'
                });
            }
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'The provided group ID has an invalid format.'
                });
            }
            console.error('Error in updateGroup:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating the group.'
            });
        }
    },


    activateGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Activating group with ID: ${id}`);
        try {
            const group = await Group.findByIdAndUpdate(id, { isActive: true }, { new: true });
            if (!group) {
                return res.status(404).json({ success: false, message: `Group with ID ${id} not found.` });
            }
            res.status(200).json({ success: true, message: 'Group activated successfully.', data: group });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ success: false, message: 'Invalid group ID format.' });
            }
            console.error('Error in activateGroup:', error);
            res.status(500).json({ success: false, message: 'Error activating group.' });
        }
    },


    deactivateGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Deactivating group with ID: ${id}`);
        try {
            const group = await Group.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!group) {
                return res.status(404).json({ success: false, message: `Group with ID ${id} not found.` });
            }
            res.status(200).json({ success: true, message: 'Group deactivated successfully.', data: group });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ success: false, message: 'Invalid group ID format.' });
            }
            console.error('Error in deactivateGroup:', error);
            res.status(500).json({ success: false, message: 'Error deactivating group.' });
        }
    },


    deleteGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Deleting group with ID: ${id}`);
        try {
            const studentCount = await Student.countDocuments({ group: id });
            if (studentCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: `Cannot delete group. It has ${studentCount} assigned students.`
                });
            }

            const deletedGroup = await Group.findByIdAndDelete(id);
            if (!deletedGroup) {
                return res.status(404).json({ success: false, message: `Group with ID ${id} not found.` });
            }
            res.status(200).json({ success: true, message: "Group deleted successfully." });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ success: false, message: 'Invalid group ID format.' });
            }
            console.error('Error in deleteGroup:', error);
            res.status(500).json({ success: false, message: 'Error deleting group.' });
        }
    },


    getStudentsByGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Fetching students for group ID: ${id}`);
        try {
            const students = await Student.find({ group: id }).select('firstName lastName email');
            res.status(200).json({
                success: true,
                message: `Found ${students.length} students for group ${id}.`,
                data: students
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ success: false, message: 'Invalid group ID format.' });
            }
            console.error('Error in getStudentsByGroup:', error);
            res.status(500).json({ success: false, message: 'Error fetching students.' });
        }
    },


    getGuardiansByGroup: async (req, res) => {
        const { id } = req.params;
        console.log(`Fetching guardians for group ID: ${id}`);
        try {
            const studentsInGroup = await Student.find({ group: id }).select('_id');
            const studentIds = studentsInGroup.map(s => s._id);

            const guardians = await Guardian.find({ studentsInCare: { $in: studentIds } })
                .populate('studentsInCare', 'firstName lastName');

            res.status(200).json({
                success: true,
                message: `Found ${guardians.length} guardians related to group ${id}.`,
                data: guardians
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ success: false, message: 'Invalid group ID format.' });
            }
            console.error('Error in getGuardiansByGroup:', error);
            res.status(500).json({ success: false, message: 'Error fetching guardians.' });
        }
    }
};

export default GroupController;