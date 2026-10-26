#!/usr/bin/env node
/**
 * Direct Upload helper for hima-ucars-popup.
 * Step 1 (MCP): create assets-upload-session with /tmp/popup-manifest.json
 * Step 2 (this script): upload buckets with session JWT via curl
 * Step 3 (MCP): PUT script with completion JWT + assets config
 *
 * Usage: node deploy-direct-upload.mjs upload <uploadJwt> <bucketsJsonPath>
 *        bucketsJsonPath is JSON array of hash arrays
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ACCOUNT = 'aab1b19f03d068bd901bf0d0d990d687';
const ROOT = '/workspace/flash-popup/site/public';
const files = JSON.parse(fs.readFileSync('/tmp/popup-files.json', 'utf8'));
const byHash = Object.fromEntries(files.map(f => [f.hash, f]));

const MIME = {
  html: 'text/html; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  ico: 'image/x-icon',
  json: 'application/json',
  txt: 'text/plain; charset=utf-8',
};

async function uploadBuckets(uploadJwt, buckets) {
  let completionJwt = null;
  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    console.log(`Uploading bucket ${i + 1}/${buckets.length} (${bucket.length} files)...`);
    const boundary = '----CFAssets' + Date.now() + i;
    const parts = [];
    for (const hash of bucket) {
      const meta = byHash[hash];
      if (!meta) throw new Error('Unknown hash ' + hash);
      const buf = fs.readFileSync(meta.full);
      const b64 = buf.toString('base64');
      const ct = MIME[meta.ext] || 'application/octet-stream';
      parts.push(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${hash}"\r\n` +
        `Content-Type: ${ct}\r\n\r\n` +
        `${b64}\r\n`
      );
    }
    parts.push(`--${boundary}--\r\n`);
    const body = Buffer.from(parts.join(''), 'utf8');
    const bodyPath = `/tmp/bucket-${i}.bin`;
    fs.writeFileSync(bodyPath, body);
    const outPath = `/tmp/bucket-${i}-resp.json`;
    execFileSync('curl', [
      '-sS', '-X', 'POST',
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/assets/upload?base64=true`,
      '-H', `Authorization: Bearer ${uploadJwt}`,
      '-H', `Content-Type: multipart/form-data; boundary=${boundary}`,
      '--data-binary', `@${bodyPath}`,
      '-o', outPath,
      '-w', '%{http_code}',
    ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    // re-run capturing status properly
  }
}

const cmd = process.argv[2];
if (cmd === 'upload') {
  const jwt = process.argv[3];
  const buckets = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
  // Prefer sequential single-file uploads for reliability with large images
  let completionJwt = jwt;
  const flat = buckets.flat();
  // unique hashes only
  const uniq = [...new Set(flat)];
  console.log(`Need to upload ${uniq.length} unique hashes across ${buckets.length} buckets`);
  for (let bi = 0; bi < buckets.length; bi++) {
    const bucket = buckets[bi];
    console.log(`\n=== Bucket ${bi + 1}/${buckets.length}: ${bucket.length} files ===`);
    const boundary = '----CFAssets' + Date.now() + bi;
    const chunks = [];
    for (const hash of bucket) {
      const meta = byHash[hash];
      if (!meta) throw new Error('Unknown hash ' + hash);
      const buf = fs.readFileSync(meta.full);
      const b64 = buf.toString('base64');
      const ct = MIME[meta.ext] || 'application/octet-stream';
      console.log(`  + ${meta.path} (${meta.size} bytes, ${ct})`);
      chunks.push(Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${hash}"\r\nContent-Type: ${ct}\r\n\r\n${b64}\r\n`,
        'utf8'
      ));
    }
    chunks.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
    const body = Buffer.concat(chunks);
    const bodyPath = `/tmp/cf-bucket-${bi}.bin`;
    fs.writeFileSync(bodyPath, body);
    const respPath = `/tmp/cf-bucket-${bi}-resp.json`;
    const status = execFileSync('curl', [
      '-sS', '-X', 'POST',
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/assets/upload?base64=true`,
      '-H', `Authorization: Bearer ${jwt}`,
      '-H', `Content-Type: multipart/form-data; boundary=${boundary}`,
      '--data-binary', `@${bodyPath}`,
      '-o', respPath,
      '-w', '%{http_code}',
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
    const resp = JSON.parse(fs.readFileSync(respPath, 'utf8'));
    console.log(`  HTTP ${status} success=${resp.success} jwt=${!!resp.result?.jwt}`);
    if (!resp.success) {
      console.error(JSON.stringify(resp, null, 2));
      process.exit(1);
    }
    if (resp.result?.jwt) completionJwt = resp.result.jwt;
  }
  fs.writeFileSync('/tmp/cf-completion-jwt.txt', completionJwt);
  console.log('\nCompletion JWT written to /tmp/cf-completion-jwt.txt');
  console.log('DONE');
} else {
  console.log('Usage: node deploy-direct-upload.mjs upload <uploadJwt> <buckets.json>');
}
