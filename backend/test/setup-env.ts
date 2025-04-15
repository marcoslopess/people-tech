import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

console.log('\n📦 Rodando migrations com SQLite...');
execSync('npx prisma migrate deploy', { stdio: 'inherit' });
