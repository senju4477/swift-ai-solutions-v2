import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const staticPreview=process.env.SWIFT_STATIC_EXPORT==='1'||process.env.SITES_MANAGED_LINUX_CONTAINER==='1';
// Static reviews cannot host SMTP routes. Restore the route even if that build fails.
const emailRoute='app/api/enquiry/route.js';
const temporary=staticPreview&&existsSync(emailRoute)?mkdtempSync(join(tmpdir(),'swift-email-route-')):null;
if(temporary)renameSync(emailRoute,join(temporary,'route.js'));
let result;
try{
  result=spawnSync(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{stdio:'inherit',env:process.env});
}finally{
  if(temporary){renameSync(join(temporary,'route.js'),emailRoute);rmSync(temporary,{recursive:true});}
}
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
if(!staticPreview){
  if(existsSync('public'))cpSync('public','.next/standalone/public',{recursive:true});
  cpSync('.next/static','.next/standalone/.next/static',{recursive:true});
}
