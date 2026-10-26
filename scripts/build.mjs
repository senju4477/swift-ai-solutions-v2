import { spawnSync } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const result=spawnSync(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{stdio:'inherit',env:process.env});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
const staticPreview=process.env.SWIFT_STATIC_EXPORT==='1'||process.env.SITES_MANAGED_LINUX_CONTAINER==='1';
if(!staticPreview){
  if(existsSync('public'))cpSync('public','.next/standalone/public',{recursive:true});
  cpSync('.next/static','.next/standalone/.next/static',{recursive:true});
}
