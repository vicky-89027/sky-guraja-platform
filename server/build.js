import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('🚀 Building in server context...');

try {
  // If public-website exists in parent, build it
  const parentPublic = path.resolve('..', 'public-website');
  if (fs.existsSync(parentPublic)) {
    execSync('npm run build --prefix ../public-website', { stdio: 'inherit' });
    const src = path.resolve('..', 'public-website', 'dist');
    const dest = path.resolve('dist');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  } else {
    execSync('npm run build', { stdio: 'inherit' });
  }
  console.log('✅ Build completed successfully!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
