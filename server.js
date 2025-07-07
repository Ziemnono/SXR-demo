import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static('dist'));

// Store connected devices
const connectedDevices = new Map();

io.on('connection', (socket) => {
  console.log('Device connected:', socket.id);

  socket.on('register-device', (data) => {
    const { deviceType, deviceId } = data;
    connectedDevices.set(socket.id, { deviceType, deviceId, socket });
    console.log(`${deviceType} registered:`, deviceId);
    
    // Notify all devices about the connection
    socket.broadcast.emit('device-connected', { deviceType, deviceId });
  });

  socket.on('screen-share', (data) => {
    // Forward screen data to mobile devices
    socket.broadcast.emit('screen-update', data);
  });

  socket.on('voice-command', (data) => {
    console.log('Voice command received:', data.command);
    // Forward voice command to laptop
    socket.broadcast.emit('execute-command', data);
  });

  socket.on('remote-action', (data) => {
    console.log('Remote action:', data.action);
    // Forward remote action to laptop
    socket.broadcast.emit('execute-action', data);
  });

  socket.on('disconnect', () => {
    const device = connectedDevices.get(socket.id);
    if (device) {
      console.log(`${device.deviceType} disconnected:`, device.deviceId);
      connectedDevices.delete(socket.id);
      socket.broadcast.emit('device-disconnected', { 
        deviceType: device.deviceType, 
        deviceId: device.deviceId 
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});