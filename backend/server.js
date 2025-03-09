import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, { cors: { origin: "*" } });

const { PORT, JWT_SECRET, PGDATABASE, PGHOST, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Middleware: Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Route: User Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = uuidv4();

  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO users (user_id, email, password_hash, name, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [user_id, email, hashedPassword, name]
    );
    client.release();

    const token = jwt.sign({ user_id, email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user_id, token });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Route: User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT user_id, password_hash FROM users WHERE email = $1', [email]);
    client.release();

    if (result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: result.rows[0].user_id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user_id: result.rows[0].user_id, token });
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
});

// Route: Create Project
app.post('/api/projects', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const { user_id } = req.user;
  const project_id = uuidv4();

  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO projects (project_id, owner_user_id, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
      [project_id, user_id, name]
    );
    await client.query('INSERT INTO project_members (project_id, user_id, role, joined_at) VALUES ($1, $2, $3, NOW())', [
      project_id,
      user_id,
      'admin',
    ]);
    client.release();

    res.status(201).json({ project_id, name, owner_user_id: user_id });
  } catch (error) {
    res.status(500).json({ error: 'Project creation failed' });
  }
});

// Route: Get Project Details
app.get('/api/projects/:project_id', authenticateToken, async (req, res) => {
  const { project_id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM projects WHERE project_id = $1', [project_id]);
    client.release();

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project details' });
  }
});

// WebSocket: Handle Project Real-time Updates
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('project_update', (data) => {
    io.emit('project_update', data);
  });

  socket.on('user_presence', (data) => {
    io.emit('user_presence', data);
  });

  socket.on('new_comment', (data) => {
    io.emit('new_comment', data);
  });

  socket.on('notification_update', (data) => {
    io.emit('notification_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT || 1337, () => {
  console.log(`Server running on port ${PORT || 1337}`);
});