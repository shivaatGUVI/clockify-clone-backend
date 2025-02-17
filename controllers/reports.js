const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');

// Weekly Report
router.post('/weekly', async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.body;
        const filter = { date: { $gte: new Date(startDate), $lte: new Date(endDate) } };
        
        if (userId) filter.userId = userId;
        
        const weeklyReport = await TimeEntry.aggregate([
            { $match: filter },
            { $group: { _id: { week: { $week: '$date' } }, totalHours: { $sum: '$hours' } } }
        ]);
        
        res.json(weeklyReport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Apply Filter API
router.post('/applyFilter', async (req, res) => {
    try {
        const { userId, projectId, startDate, endDate, minHours, maxHours } = req.body;
        const filter = { date: { $gte: new Date(startDate), $lte: new Date(endDate) } };
        
        if (userId) filter.userId = userId;
        if (projectId) filter.projectId = projectId;
        if (minHours !== undefined) filter.hours = { ...filter.hours, $gte: minHours };
        if (maxHours !== undefined) filter.hours = { ...filter.hours, $lte: maxHours };
        
        const filteredResults = await TimeEntry.find(filter);
        res.json(filteredResults);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
