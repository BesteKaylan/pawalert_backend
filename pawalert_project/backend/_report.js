const express = require('express');
const db = require('./_db');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Create new report
router.post('/', authMiddleware, (req, res) => {
  const { pet_name, pet_type, color, description, last_seen_location } = req.body;

  if (!pet_name || !last_seen_location) {
    return res.status(400).json({ error: 'pet_name and last_seen_location are required' });
  }

  const sql = `
    INSERT INTO reports (user_id, pet_name, pet_type, color, description, last_seen_location)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [req.user.id, pet_name, pet_type || null, color || null, description || null, last_seen_location],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({
        id: this.lastID,
        user_id: req.user.id,
        pet_name,
        pet_type,
        color,
        description,
        last_seen_location,
        status: 'active'
      });
    }
  );
});

// List all reports (basic version)
router.get('/', (req, res) => {
  const sql = `
    SELECT r.*, u.name as owner_name
    FROM reports r
    JOIN users u ON u.id = r.user_id
    ORDER BY r.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Get single report with its seen entries
router.get('/:id', (req, res) => {
  const reportId = req.params.id;
  const sqlReport = `
    SELECT r.*, u.name as owner_name
    FROM reports r
    JOIN users u ON u.id = r.user_id
    WHERE r.id = ?
  `;
  db.get(sqlReport, [reportId], (err, report) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const sqlSeen = `
      SELECT s.*, u.name as user_name
      FROM seen_reports s
      JOIN users u ON u.id = s.user_id
      WHERE s.report_id = ?
      ORDER BY s.created_at DESC
    `;
    db.all(sqlSeen, [reportId], (err2, seens) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json({ report, seens });
    });
  });
});

// Mark report as found
router.patch('/:id/status', authMiddleware, (req, res) => {
  const reportId = req.params.id;
  const { status } = req.body;

  if (!['active', 'found'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Only owner can change
  const sql = 'UPDATE reports SET status = ? WHERE id = ? AND user_id = ?';
  db.run(sql, [status, reportId, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) {
      return res.status(403).json({ error: 'Not allowed or report not found' });
    }
    res.json({ success: true });
  });
});

// Add a seen entry
router.post('/:id/seen', authMiddleware, (req, res) => {
  const reportId = req.params.id;
  const { note } = req.body;

  const sql = `
    INSERT INTO seen_reports (report_id, user_id, note)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [reportId, req.user.id, note || null], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    res.json({
      id: this.lastID,
      report_id: reportId,
      user_id: req.user.id,
      note
    });
  });
});

module.exports = router;