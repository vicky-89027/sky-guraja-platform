import app from '../server/src/app.js';
import { seedDatabase } from '../server/src/db/seeds.js';

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    try {
      await seedDatabase();
      initialized = true;
    } catch (e) {
      console.error('Database seed error:', e);
    }
  }
  return app(req, res);
}
