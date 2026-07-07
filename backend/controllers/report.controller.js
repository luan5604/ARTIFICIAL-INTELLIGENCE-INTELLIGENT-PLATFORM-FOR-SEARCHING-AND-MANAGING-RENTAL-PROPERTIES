const db = require('../models');
const Report = db.Report;

const createReport = async (req, res) => {
  try {
    const { reported_user_id, conversation_id, post_id, reason, description } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    const report = await Report.create({
      reporter_id: req.user.id,
      reported_user_id,
      conversation_id,
      post_id,
      reason,
      description,
      status: 'PENDING'
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const userRole = req.user.Role.role_name;
    const reports = await Report.findAll({
      include: [
        { model: db.User, as: 'reporter', include: [{ model: db.Profile }] },
        { model: db.User, as: 'reportedUser', include: [{ model: db.Profile }] },
        { 
          model: db.Post,
          include: [{
            model: db.Room,
            include: [{
              model: db.Property
            }]
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Filter reports based on role
    let filteredReports = reports;
    if (userRole === 'CHU_TRO') {
      filteredReports = reports.filter(r => 
        r.reported_user_id === req.user.id || 
        r.Post?.Room?.Property?.landlord_id === req.user.id
      );
    } else if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(filteredReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    if (req.user.Role.role_name !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admin can update report status' });
    }

    const { status } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json({ message: 'Report status updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    if (req.user.Role.role_name !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admin can delete reports' });
    }

    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus,
  deleteReport
};
