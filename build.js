import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('🚀 Starting SKY Guraja Unified Build for Vercel...');

try {
  // Run public-website build
  execSync('npm run build --workspace=public-website', { stdio: 'inherit' });

  const srcDir = path.resolve('public-website', 'dist');
  const destDir = path.resolve('dist');

  if (fs.existsSync(srcDir)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log('✅ Successfully copied build artifacts to root /dist directory!');
  }

  console.log('🎉 Build completed with 0 errors!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
