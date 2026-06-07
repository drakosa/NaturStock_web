const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function main() {
  // Clean dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  // Files/dirs to copy (exclude node_modules, scripts, git, env, dist)
  const entries = fs.readdirSync(ROOT);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'scripts' || entry === '.git' ||
        entry === 'dist' || entry === '.env' || entry === 'package-lock.json') {
      continue;
    }
    copyRecursive(path.join(ROOT, entry), path.join(DIST, entry));
  }

  // Generate config.js from template with env vars
  const templatePath = path.join(DIST, 'config.template.js');
  const configPath = path.join(DIST, 'config.js');
  if (fs.existsSync(templatePath)) {
    let template = fs.readFileSync(templatePath, 'utf8');
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mwffklvdkalrcwuxizkg.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_oswhLhzhe6cAHNOmeIe3xQ_rz0bScru';
    template = template.replace(/__SUPABASE_URL__/g, supabaseUrl);
    template = template.replace(/__SUPABASE_ANON_KEY__/g, supabaseAnonKey);
    fs.writeFileSync(configPath, template);
    fs.rmSync(templatePath);
  }

  console.log('✅ Build completado. Output en:', DIST);
}

main();
