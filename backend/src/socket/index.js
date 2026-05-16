import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);
    
    // Emit online status
    io.emit('user:online', { userId: socket.userId });

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join admin room if user is admin
    if (socket.userRole === 'admin') {
      socket.join('admin');
    }

    // Handle typing indicator
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        userId: socket.userId,
        conversationId,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        userId: socket.userId,
        conversationId,
      });
    });

    // Handle sending messages
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content, attachments } = data;

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          content,
          attachments: attachments || [],
        });

        // Populate sender info
        await message.populate('sender', 'name avatar role');

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          $inc: {
            'unreadCount.customer': socket.userRole === 'admin' ? 1 : 0,
            'unreadCount.admin': socket.userRole === 'customer' ? 1 : 0,
          },
        });

        // Emit message to conversation room
        io.to(`conversation:${conversationId}`).emit('message:new', message);

        // Notify admin if customer sent message
        if (socket.userRole === 'customer') {
          io.to('admin').emit('message:notification', {
            conversationId,
            message,
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle joining conversation
    socket.on('conversation:join', async ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
      
      // Mark messages as read
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: socket.userId },
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

      // Reset unread count
      const updateField = socket.userRole === 'admin' 
        ? 'unreadCount.admin' 
        : 'unreadCount.customer';
      
      await Conversation.findByIdAndUpdate(conversationId, {
        [updateField]: 0,
      });

      socket.emit('conversation:joined', { conversationId });
    });

    // Handle leaving conversation
    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit('user:offline', { userId: socket.userId });
    });
  });

  return io;
};

export default initializeSocket;
