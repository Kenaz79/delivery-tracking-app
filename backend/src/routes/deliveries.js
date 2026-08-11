const express = require('express');
const Delivery = require('../models/Delivery');
const { requireAuth, requireRole } = require('../middleware/auth');
const sapByD = require('../services/sap-byd-adapter');
const notifications = require('../services/notifications');

const router = express.Router();

// POST /api/deliveries — customer creates a delivery request
router.post('/', requireAuth, requireRole('customer', 'manager'), async (req, res) => {
  try {
    const { destinationAddress, destinationLat, destinationLng, deliveryNotes } = req.body;
    if (!destinationAddress) {
      return res.status(400).json({ error: 'destinationAddress is required' });
    }

    const delivery = await Delivery.createDelivery({
      customerId: req.user.id,
      destinationAddress,
      destinationLat,
      destinationLng,
      deliveryNotes,
    });

    // Push to SAP ByD in the background — don't block the response on it.
    sapByD
      .pushDeliveryNote(delivery)
      .then((sapRef) => Delivery.attachSapReference(delivery.id, sapRef))
      .catch((err) => console.error('SAP ByD push failed (non-blocking):', err.message));

    res.status(201).json(delivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// GET /api/deliveries — manager sees all, rider/customer see their own
router.get('/', requireAuth, async (req, res) => {
  try {
    const deliveries =
      req.user.role === 'manager'
        ? await Delivery.listAll()
        : await Delivery.listForUser(req.user.id, req.user.role);
    res.json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list deliveries' });
  }
});

// GET /api/deliveries/:id
router.get('/:id', requireAuth, async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
  res.json(delivery);
});

// POST /api/deliveries/:id/accept — rider accepts a pending delivery
router.post('/:id/accept', requireAuth, requireRole('rider'), async (req, res) => {
  const delivery = await Delivery.acceptDelivery(req.params.id, req.user.id);
  if (!delivery) {
    return res.status(409).json({ error: 'Delivery is no longer available' });
  }

  await notifications.notifyCustomer(delivery.customer_id, {
    title: 'Rider assigned',
    body: 'A rider has accepted your delivery and is on the way.',
  });

  req.app.get('io').to(`delivery:${delivery.id}`).emit('delivery:status', delivery);
  res.json(delivery);
});

// POST /api/deliveries/:id/status — update status (in_transit, delivered, cancelled)
router.post('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ['in_transit', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }

  const delivery = await Delivery.updateStatus(req.params.id, status);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

  if (status === 'delivered') {
    await notifications.notifyManager({
      title: 'Delivery completed',
      body: `Delivery ${delivery.id} was marked as received.`,
    });
  }

  req.app.get('io').to(`delivery:${delivery.id}`).emit('delivery:status', delivery);
  res.json(delivery);
});

module.exports = router;
