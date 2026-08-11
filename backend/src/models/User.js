const pool = require('../config/db');

async function createUser({ role, name, email, phone, passwordHash, universityId }) {
  const { rows } = await pool.query(
    `INSERT INTO users (role, name, email, phone, password_hash, university_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, role, name, email, phone, university_id, created_at`,
    [role, name, email, phone, passwordHash, universityId || null]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, role, name, email, phone, university_id, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function listByRole(role) {
  const { rows } = await pool.query(
    'SELECT id, role, name, email, phone FROM users WHERE role = $1 ORDER BY name',
    [role]
  );
  return rows;
}

module.exports = { createUser, findByEmail, findById, listByRole };
