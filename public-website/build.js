import { execSync } from 'node:child_process';
import process from 'node:process';

console.log('🚀 Building SKY Guraja Public Website...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Public website built successfully!');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
