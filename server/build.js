import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('🚀 Building in server context...');

try {
  // If public-website exists in parent, build it
  const parentPublic = path.resolve('..', 'public-website');
  if (fs.existsSync(parentPublic)) {
    const buildCommands = [
      'npm run build --prefix ../public-website',
      'npx --prefix ../public-website vite build ../public-website',
      'npx vite build ../public-website'
    ];
    let ok = false;
    for (const cmd of buildCommands) {
      try {
        console.log(`Executing: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
        ok = true;
        break;
      } catch (err) {
        console.warn(`Command failed: ${cmd}`);
      }
    }
    if (!ok) {
      throw new Error('Failed to build public-website from server context');
    }

    const src = path.resolve('..', 'public-website', 'dist');
    const dest = path.resolve('dist');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  } else {
    execSync('npm run build', { stdio: 'inherit' });
  }
  console.log('✅ Build completed successfully in server context!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
