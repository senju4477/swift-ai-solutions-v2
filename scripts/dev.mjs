import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
// Optional ignored local QA profile; normal development uses Next.js dev.
const profilePath='.sites-runtime/swift-preview.json';
const profile=existsSync(profilePath)?JSON.parse(readFileSync(profilePath,'utf8')):{};
const args=profile.mode==='production'?['scripts/start.mjs']:[require.resolve('next/dist/bin/next'),'dev','-H','0.0.0.0','-p',process.env.PORT||'4173'];
const child=spawn(process.execPath,args,{stdio:'inherit',env:{...process.env,PORT:process.env.PORT||'4173'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('error',error=>{process.stderr.write(error.message+'\n');process.exit(1);});
child.on('exit',code=>process.exit(code??1));
