import { execSync } from 'node:child_process';
import process from 'node:process';

console.log('🚀 Building SKY Guraja Server for Vercel...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Server built successfully!');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
