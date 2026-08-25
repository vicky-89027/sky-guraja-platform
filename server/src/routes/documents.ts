import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `doc_${Date.now()}_${uuidv4().substring(0, 8)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { category } = req.query;
    let sql = `
      SELECT d.*, u.full_name as uploaded_by_name
      FROM documents d
      LEFT JOIN users u ON u.id = d.uploaded_by_id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (category) {
      sql += ` AND d.category = ?`;
      params.push(category);
    }
    sql += ` ORDER BY d.created_at DESC`;

    const docs = await DB.query<any>(sql, params);
    return res.json({ success: true, data: docs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/upload', authenticateToken, forbidAuditorMutation, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { title, category = 'OTHER', relatedEntityType, relatedEntityId, isPublic = 0 } = req.body;
    const file = req.file;

    if (!file || !title) {
      return res.status(400).json({ success: false, message: 'File and title are required.' });
    }

    const docId = `doc-${uuidv4().substring(0, 8)}`;
    const relativeFilePath = `/uploads/${file.filename}`;

    await DB.run(
      `INSERT INTO documents (id, title, category, file_path, file_size, mime_type, uploaded_by_id, related_entity_type, related_entity_id, is_public, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [docId, title, category, relativeFilePath, file.size, file.mimetype, req.user?.id, relatedEntityType || null, relatedEntityId || null, isPublic ? 1 : 0]
    );

    await logAudit({
      user: req.user,
      action: 'UPLOAD_DOCUMENT',
      entityType: 'DOCUMENT',
      entityId: docId,
      newValue: { title, category, fileName: file.originalname, size: file.size },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { docId, filePath: relativeFilePath }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
