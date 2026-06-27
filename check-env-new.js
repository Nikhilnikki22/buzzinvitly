require('dotenv').config({ path: '.env.local' });
const url = process.env.DATABASE_URL;
console.log('DATABASE_URL:', url);
console.log('Using pooler?', url.includes('pooler.supabase.com') ? '✅ YES' : '❌ NO');
console.log('User:', url.match(/postgresql:\/\/([^:]+):/)?.[1]);
console.log('Host:', url.match(/@([^:]+):/)?.[1]);
