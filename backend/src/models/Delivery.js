const pool = require('../config/db');

async function createDelivery({ customerId, destinationAddress, destinationLat, destinationLng, deliveryNotes }) {
  const { rows } = await pool.query(
    `INSERT INTO deliveries (customer_id, destination_address, destination_lat, destination_lng, delivery_notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [customerId, destinationAddress, destinationLat || null, destinationLng || null, deliveryNotes || null]
  );
  return rows[0];
}

async function listAll() {
  const { rows } = await pool.query('SELECT * FROM deliveries ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
  return rows[0] || null;
}

async function listForUser(userId, role) {
  const column = role === 'rider' ? 'rider_id' : 'customer_id';
  const { rows } = await pool.query(
    `SELECT * FROM deliveries WHERE ${column} = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function acceptDelivery(id, riderId) {
  const { rows } = await pool.query(
    `UPDATE deliveries SET rider_id = $1, status = 'accepted', accepted_at = now()
     WHERE id = $2 AND status = 'pending'
     RETURNING *`,
    [riderId, id]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const deliveredAt = status === 'delivered' ? 'now()' : 'delivered_at';
  const { rows } = await pool.query(
    `UPDATE deliveries SET status = $1, delivered_at = ${status === 'delivered' ? 'now()' : 'delivered_at'}
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
}

async function attachSapReference(id, sapRef) {
  const { rows } = await pool.query(
    `UPDATE deliveries SET sap_delivery_note_ref = $1 WHERE id = $2 RETURNING *`,
    [sapRef, id]
  );
  return rows[0] || null;
}

module.exports = {
  createDelivery,
  listAll,
  findById,
  listForUser,
  acceptDelivery,
  updateStatus,
  attachSapReference,
};
