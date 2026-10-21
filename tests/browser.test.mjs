// Dependency-free Edge/Chrome CDP acceptance. Start a headless browser on port 9223.
import {writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=process.env.PET_QA_PORT||9223;
const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page=targets.find(t=>t.type==='page');
if(!page)throw Error('No browser page');
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let next=0;const pending=new Map(),errors=[];
ws.addEventListener('message',e=>{const data=JSON.parse(e.data);if(data.id){const p=pending.get(data.id);pending.delete(data.id);if(data.error)p.reject(Error(data.error.message));else p.resolve(data.result);}if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text+': '+(data.params.exceptionDetails.exception?.description||''));});
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
async function run(expression){const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1366,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});await pause(650);
await run(`(async()=>{const b=document.getElementById('restart');if(b&&!b.hidden){b.click();await Promise.resolve();if(document.getElementById('confirm-dialog').open)document.getElementById('dialog-confirm').click();await new Promise(r=>setTimeout(r,20));}localStorage.clear();location.reload();})()`);await pause(450);
assert.equal(await run(`document.querySelectorAll('.hero-scene svg').length`),1);
const artifactDir=process.env.PET_QA_ARTIFACTS||path.join(root,'tests','artifacts');mkdirSync(artifactDir,{recursive:true});
async function screenshot(name){const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});writeFileSync(path.join(artifactDir,name+'.png'),Buffer.from(data,'base64'));}
await screenshot('welcome-desktop');
const helpers=`const click=(action,id)=>{const e=Array.from(document.querySelectorAll('[data-action]')).find(e=>e.dataset.action===action&&(!id||e.dataset.id===id));if(!e||e.disabled)throw Error('Missing active button '+action+' '+id);e.click();};const change=(selector,value)=>{const e=document.querySelector(selector);if(!e)throw Error('Missing input '+selector);if(e.type==='radio')e.checked=true;else e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};const name=(text)=>{const e=document.getElementById('pet-name');e.value=text;e.dispatchEvent(new Event('input',{bubbles:true}));};`;
async function playScenario(players,mode) {
  await run(`(async()=>{const b=document.getElementById('restart');if(b&&!b.hidden){b.click();await Promise.resolve();if(document.getElementById('confirm-dialog').open)document.getElementById('dialog-confirm').click();await new Promise(r=>setTimeout(r,20));}localStorage.clear();location.reload();})()`);await pause(300);
  await run(`(()=>{${helpers}change('[data-setup="players"][value="${players}"]','${players}');change('[data-setup="mode"][value="${mode}"]','${mode}');click('start');})()`);
  for(let n=1;n<=players;n++) {
    await run(`(()=>{${helpers}change('[data-field="animalType"][value="${['cat','fox','rabbit','red_panda'][n-1]}"]','${['cat','fox','rabbit','red_panda'][n-1]}');click('next');name('Friend ${n}');click('next');change('[data-field="accessory.neck"][value="bandana_sage"]','bandana_sage');click('next');click('next');click('next');change('[data-field="room.theme"][value="${['cozy','forest','space','creative'][n-1]}"]','${['cozy','forest','space','creative'][n-1]}');click('next');click('next');if(!document.getElementById('step-error').textContent.includes('6'))throw Error('Minimum routine not enforced');const n=${n};const ids=['get_up','have_breakfast','go_to_school','have_lunch','play_in_park','go_to_bed'];ids.forEach((id,i)=>{click('routine-add',id);change('[data-time="'+id+'"][value="'+[7+n%2,8,9,12,16,21][i]+'"]',String([7+n%2,8,9,12,16,21][i]));});click('next');${mode==='hobbies'?`for(const [id,f] of [['listen_to_music','often'],['write_blog','never'],['read_books','always']]){click('hobby-add',id);change('[data-frequency="'+id+'"][value="'+f+'"]',f);}click('next');`:''}click('save');if(PetGame.getSession().pets.length!==${n})throw Error('Save failed');${n<players?"click('next-player');":''}})()`);
  }
  assert.equal(await run('PetGame.getSession().pets.length'),players);
  assert.equal(await run('PetGame.validation.sessionErrors(PetGame.getSession()).length'),0);
  if(players>1) {
    await run(`(()=>{${helpers}click('gallery');${players>2?`const pets=PetGame.getSession().pets;click('select-pair',pets[0].id);click('select-pair',pets[1].id);`:''}click('compare');if(document.querySelectorAll('.comparison-row').length<6)throw Error('No compare rows');})()`);
  }
  await run(`(()=>{${helpers}${players>1?`click('gallery');const id=PetGame.getSession().pets[0].id;click('present',id);`:`click('present',PetGame.getSession().pets[0].id);`}if(document.querySelector('.hint-text'))throw Error('Hint should be hidden');click('toggle-hint');if(!document.querySelector('.hint-text'))throw Error('No speaking hint');})()`);
  console.log(`PASS browser ${mode}, ${players} players`);
}
for(const mode of ['daily','hobbies'])for(const n of [1,2,3,4])await playScenario(n,mode);
// Preserve and reload a finished session, then edit one pet without touching the others.
const before=await run('JSON.stringify(PetGame.getSession().pets.slice(1))');
await run(`(()=>{${helpers}click('gallery');click('edit',PetGame.getSession().pets[0].id);click('next');name('Scout');})()`);
await pause(400);await send('Page.reload');await pause(400);
await run(`(()=>{${helpers}click('resume');if(document.getElementById('pet-name').value!=='Scout')throw Error('Edit draft was not restored');for(let i=0;i<7;i++)click('next');click('save');})()`);
assert.equal(await run('PetGame.getSession().pets[0].name'),'Scout');assert.equal(await run('JSON.stringify(PetGame.getSession().pets.slice(1))'),before);
console.log('PASS edit/reload preserves other pets');
// All six four-player pairs.
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)await run(`(()=>{${helpers}if(!document.querySelector('.gallery-page'))click('gallery');const current=PetGame.getSession().selectedPetIds;current.forEach(id=>click('select-pair',id));const pets=PetGame.getSession().pets;click('select-pair',pets[${i}].id);click('select-pair',pets[${j}].id);click('compare');if(!document.querySelector('.comparison-table'))throw Error('Pair failed');})()`);
console.log('PASS all six pairs');
await screenshot('compare-desktop');
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
assert.ok(await run('document.documentElement.scrollWidth<=window.innerWidth+1'),'Mobile compare overflow');await screenshot('compare-mobile');
await run(`(async()=>{const b=document.getElementById('restart');if(b&&!b.hidden){b.click();await Promise.resolve();if(document.getElementById('confirm-dialog').open)document.getElementById('dialog-confirm').click();await new Promise(r=>setTimeout(r,20));}localStorage.clear();location.reload();})()`);await pause(300);
assert.ok(await run('document.documentElement.scrollWidth<=window.innerWidth+1'),'Mobile welcome overflow');await screenshot('welcome-mobile');
await send('Emulation.setDeviceMetricsOverride',{width:1366,height:900,deviceScaleFactor:1,mobile:false});
await playScenario(1,'hobbies');
await run(`(()=>{${helpers}click('profile');})()`);await screenshot('profile-desktop');
await run(`(()=>{${helpers}click('edit',PetGame.getSession().pets[0].id);})()`);await screenshot('creator-desktop');
await run(`(()=>{${helpers}click('next');name('Milo');for(let i=0;i<5;i++)click('next');})()`);await screenshot('routine-desktop');
// Verify PNG render pipeline in the browser without requiring a download dialog.
const png=await run(`(async()=>{let captured=null;const native=document.createElement.bind(document);document.createElement=function(tag,...args){const el=native(tag,...args);if(tag==='a'){el.click=function(){captured={href:this.href,name:this.download};};}return el;};try{await PetGame.exportCard(PetGame.getSession().pets[0],'hobbies');if(!captured)throw Error('No PNG produced');const blob=await (await fetch(captured.href)).blob();return {type:blob.type,size:blob.size,name:captured.name};}finally{document.createElement=native;}})()`);
assert.equal(png.type,'image/png');assert.ok(png.size>10000);console.log('PASS browser PNG export '+png.size+' bytes');
assert.deepEqual(errors,[],'Browser runtime exceptions');
console.log('All browser checks passed. Screenshots: '+artifactDir);
ws.close();
