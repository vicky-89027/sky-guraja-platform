import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import contributionsRoutes from './routes/contributions';
import expensesRoutes from './routes/expenses';
import campaignsRoutes from './routes/campaigns';
import membersRoutes from './routes/members';
import ledgerRoutes from './routes/ledger';
import eventsRoutes from './routes/events';
import meetingsRoutes from './routes/meetings';
import documentsRoutes from './routes/documents';
import auditLogsRoutes from './routes/auditLogs';
import reportsRoutes from './routes/reports';
import settingsRoutes from './routes/settings';
import publicRoutes from './routes/public';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads static directory
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contributions', contributionsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    organization: 'Sri Krishna Yadav Youth Guraja',
    service: 'Fund Management & Community Operations Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend client dist if present
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
  });
}

export default app;
