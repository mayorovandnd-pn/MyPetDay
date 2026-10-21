import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),port=process.env.PET_QA_PORT||9223;
const page=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page');
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map(),exceptions=[],external=[];
ws.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const p=pending.get(data.id);pending.delete(data.id);if(data.error)p.reject(Error(data.error.message));else p.resolve(data.result);}if(data.method==='Runtime.exceptionThrown')exceptions.push(data.params.exceptionDetails.text);if(data.method==='Network.requestWillBeSent'&&/^https?:/.test(data.params.request.url))external.push(data.params.request.url);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
async function run(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const helper=`const click=(a,id)=>{const e=Array.from(document.querySelectorAll('[data-action]')).find(e=>e.dataset.action===a&&(!id||e.dataset.id===id));if(!e||e.disabled)throw Error('Missing button '+a);e.click();};`;
async function reset(){await run(`(async()=>{const b=document.getElementById('restart');if(b&&!b.hidden){b.click();await Promise.resolve();if(document.getElementById('confirm-dialog').open)document.getElementById('dialog-confirm').click();await new Promise(r=>setTimeout(r,30));}localStorage.clear();location.reload();})()`);await delay(400);}
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('DOM.enable');
await send('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});await delay(350);await reset();
await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
await send('Page.reload');await delay(350);assert.ok(await run(`!!document.querySelector('.hero-scene svg')`));assert.deepEqual(external,[]);console.log('PASS offline file:// load with zero network requests');
await run(`(()=>{${helper}click('start');document.querySelector('[data-field="animalType"][value="cat"]').focus();})()`);
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
assert.equal(await run(`PetGame.getSession().draftPet.animalType`),'dog');assert.equal(await run(`document.activeElement.dataset.field`),'animalType');console.log('PASS native keyboard radio selection and focus retention');
await run(`document.getElementById('restart').focus();document.getElementById('restart').click()`);assert.equal(await run(`document.getElementById('confirm-dialog').open`),true);
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await delay(50);
assert.equal(await run(`PetGame.getSession().draftPet.animalType`),'dog');assert.equal(await run(`document.activeElement.id`),'restart');console.log('PASS Escape cancels destructive reset and restores focus');
await run(`(()=>{${helper}click('next');const e=document.getElementById('pet-name');e.value='<script>';e.dispatchEvent(new Event('input',{bubbles:true}));click('next');})()`);
assert.equal(await run(`PetGame.getSession().currentStep`),'name');assert.ok((await run(`document.getElementById('step-error').textContent`)).includes('Use letters'));assert.equal(await run(`document.querySelectorAll('#app script').length`),0);console.log('PASS invalid name is escaped and navigation blocked');
await reset();
// Force the browser's Storage implementation to fail: the game must remain usable.
await run(`window.__qaStorage={get:Storage.prototype.getItem,set:Storage.prototype.setItem};Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError')};Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')};`);
await run(`(()=>{${helper}click('start');click('next');const e=document.getElementById('pet-name');e.value='Coco';e.dispatchEvent(new Event('input',{bubbles:true}));click('next');})()`);
assert.equal(await run(`PetGame.getSession().draftPet.name`),'Coco');assert.match(await run(`document.getElementById('save-state').textContent`),/this tab only/);assert.equal(await run(`PetGame.storage.reliable`),false);console.log('PASS storage denied keeps the game playable with an honest save status');
// Restore native storage and flush before reloading (avoid native leave-page dialog in headless QA).
await run(`Storage.prototype.getItem=window.__qaStorage.get;Storage.prototype.setItem=window.__qaStorage.set;PetGame.storage.write(PetGame.getSession());`);
// Open an actual JSON fixture through the file input.
await send('Page.reload');await delay(350);
const fixture=await run(`(()=>{const s=PetGame.state.newSession(2,'hobbies'),p=s.draftPet;p.name='Scout';p.routine=PetGame.activities.filter(a=>a.roles.includes('routine')).slice(0,6).map((a,i)=>({activityId:a.id,time:7+i}));p.hobbies=[{activityId:'listen_to_music',frequency:'often'},{activityId:'write_blog',frequency:'never'},{activityId:'read_books',frequency:'always'}];PetGame.state.save(s);PetGame.state.nextPlayer(s);s.draftPet.name='Coco';return JSON.stringify(s);})()`);
const dir=process.env.PET_QA_ARTIFACTS||path.join(root,'tests','artifacts');mkdirSync(dir,{recursive:true});const fixturePath=path.join(dir,'qa-session.json');writeFileSync(fixturePath,fixture);
async function upload(file){const doc=await send('DOM.getDocument');const query=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#import-session'});await send('DOM.setFileInputFiles',{nodeId:query.nodeId,files:[file]});await delay(250);}
await upload(fixturePath);
if(await run(`document.getElementById('confirm-dialog').open`)){await run(`document.getElementById('dialog-confirm').click()`);await delay(80);}
assert.equal(await run(`PetGame.getSession().pets[0].name`),'Scout');assert.equal(await run(`PetGame.getSession().draftPet.name`),'Coco');assert.equal(await run(`PetGame.getSession().currentPlayer`),2);console.log('PASS JSON import restores confirmed pets, next draft and queue');
const before=await run(`JSON.stringify(PetGame.getSession())`),badPath=path.join(dir,'qa-invalid.json');writeFileSync(badPath,'{"schemaVersion":1}');await upload(badPath);
assert.equal(await run(`JSON.stringify(PetGame.getSession())`),before);assert.match(await run(`document.getElementById('toast').textContent`),/not a saved game/);console.log('PASS invalid import leaves active session untouched');
// Edit an earlier pet while the next player's incomplete draft is preserved.
await run(`(()=>{${helper}click('gallery');click('edit',PetGame.getSession().pets[0].id);click('next');const e=document.getElementById('pet-name');e.value='Pixel';e.dispatchEvent(new Event('input',{bubbles:true}));click('cancel-edit');})()`);
assert.equal(await run(`document.getElementById('confirm-dialog').open`),true);
await run(`document.getElementById('dialog-confirm').click()`);await delay(60);
assert.equal(await run(`PetGame.getSession().pets[0].name`),'Scout');assert.equal(await run(`PetGame.getSession().draftPet.name`),'Coco');assert.equal(await run(`PetGame.getSession().currentPlayer`),2);console.log('PASS cancel edit keeps both earlier pet and next player draft');
await run(`(()=>{${helper}click('continue');for(let i=0;i<6;i++)click('next');})()`);
for(const [width,height] of [[1366,768],[1024,768],[768,1024],[390,844]]){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<720});assert.ok(await run(`document.documentElement.scrollWidth<=window.innerWidth+1`),'Overflow at '+width);}
console.log('PASS routine responsive widths 1366 / 1024 / 768 / 390');
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await run(`matchMedia('(prefers-reduced-motion: reduce)').matches`),true);assert.equal(await run(`getComputedStyle(document.querySelector('.primary')).transitionDuration`),'0s');console.log('PASS reduced motion disables transitions');
await send('Emulation.setDeviceMetricsOverride',{width:683,height:384,deviceScaleFactor:2,mobile:false});assert.ok(await run(`document.documentElement.scrollWidth<=window.innerWidth+1`),'200% equivalent viewport overflow');console.log('PASS 200% equivalent viewport reflows');
await send('Emulation.setDeviceMetricsOverride',{width:1366,height:900,deviceScaleFactor:1,mobile:false});await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
assert.deepEqual(exceptions,[]);assert.deepEqual(external,[]);console.log('All resilience checks passed.');ws.close();
