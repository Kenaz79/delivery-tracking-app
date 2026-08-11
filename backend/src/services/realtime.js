// Wires up Socket.io: rider location broadcasting + delivery room subscriptions.
// Called once from src/index.js with the shared `io` instance.

function attachRealtime(io) {
  io.on('connection', (socket) => {
    console.log('client connected', socket.id);

    // Client (rider, customer, or dashboard) joins the room for a delivery
    // to receive location + status updates for it.
    socket.on('delivery:subscribe', (deliveryId) => {
      socket.join(`delivery:${deliveryId}`);
    });

    socket.on('delivery:unsubscribe', (deliveryId) => {
      socket.leave(`delivery:${deliveryId}`);
    });

    // Rider app sends periodic location updates while a delivery is active.
    // payload: { deliveryId, lat, lng, timestamp }
    socket.on('rider:location', (payload) => {
      if (!payload || !payload.deliveryId) return;
      io.to(`delivery:${payload.deliveryId}`).emit('rider:location', payload);
    });

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
    });
  });
}

module.exports = { attachRealtime };
