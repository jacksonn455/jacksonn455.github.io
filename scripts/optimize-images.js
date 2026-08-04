#!/usr/bin/env node
/*
 * Otimiza imagens de assets/img/ in-place: redimensiona e reencoda em WebP.
 * Idempotente - imagens ja dentro do limite ficam inalteradas.
 *
 *   npm run images              # processa tudo
 *   npm run images -- --dry     # so relata, nao escreve
 *
 * Use ao adicionar uma imagem nova ao portfolio.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'assets/img');
const MAX_WIDTH = 1200;
const QUALITY = 78;
const DRY = process.argv.includes('--dry');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });

const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');

(async () => {
  const files = walk(DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  let before = 0;
  let after = 0;
  let changed = 0;

  for (const file of files) {
    const input = fs.readFileSync(file); // buffer evita segurar o handle no Windows
    const meta = await sharp(input).metadata();
    const target = path.join(
      path.dirname(file),
      slug(path.basename(file, path.extname(file))) + '.webp',
    );

    const needsResize = (meta.width || 0) > MAX_WIDTH;
    const needsConvert = meta.format !== 'webp';
    const needsRename = target !== file;

    before += input.length;

    if (!needsResize && !needsConvert && !needsRename) {
      after += input.length;
      continue;
    }

    const out = await sharp(input)
      .rotate()
      .resize({ width: Math.min(MAX_WIDTH, meta.width || MAX_WIDTH), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer();

    after += out.length;
    changed++;

    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const relTarget = path.relative(ROOT, target).replace(/\\/g, '/');
    const pct = (100 - (out.length / input.length) * 100).toFixed(0);
    console.log(
      `${DRY ? '[dry] ' : ''}${rel} -> ${relTarget}  ${(input.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB (-${pct}%)`,
    );

    if (!DRY) {
      fs.writeFileSync(target, out);
      if (needsRename) fs.unlinkSync(file);
    }
  }

  console.log(
    `\n${changed}/${files.length} imagem(ns) processada(s) - ` +
      `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB`,
  );
  if (changed && !DRY) {
    console.log('Lembre-se de atualizar src/width/height no index.html se algum nome mudou.');
  }
})();
