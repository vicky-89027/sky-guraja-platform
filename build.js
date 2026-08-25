import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('🚀 Starting SKY Guraja Universal Multi-Target Build...');

try {
  // 1. Build public website
  execSync('npm run build --workspace=public-website', { stdio: 'inherit' });

  const srcDir = path.resolve('public-website', 'dist');
  const targetDirs = [
    path.resolve('dist'),
    path.resolve('server', 'dist'),
    path.resolve('client', 'dist')
  ];

  if (fs.existsSync(srcDir)) {
    for (const target of targetDirs) {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      fs.cpSync(srcDir, target, { recursive: true });

      const indexPath = path.join(target, 'index.html');
      const notFoundPath = path.join(target, '404.html');
      if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
      }
      console.log(`✅ Synced website artifacts to: ${target}`);
    }
  }

  console.log('🎉 Universal build completed with 0 errors!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
