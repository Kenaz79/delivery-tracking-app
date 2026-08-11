require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { attachRealtime } = require('./services/realtime');
const authRoutes = require('./routes/auth');
const deliveryRoutes = require('./routes/deliveries');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make io available inside route handlers via req.app.get('io')
app.set('io', io);
attachRealtime(io);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/users', userRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
