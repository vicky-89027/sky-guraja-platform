import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('🚀 Starting SKY Guraja Unified Build for Deployment...');

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

    // Create 404.html fallback for GitHub Pages & static hosts
    const indexPath = path.join(destDir, 'index.html');
    const notFoundPath = path.join(destDir, '404.html');
    if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
      fs.copyFileSync(indexPath, notFoundPath);
      console.log('✅ Created 404.html SPA redirect for GitHub Pages / static hosting!');
    }

    console.log('✅ Successfully copied build artifacts to root /dist directory!');
  }

  console.log('🎉 Build completed with 0 errors!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
