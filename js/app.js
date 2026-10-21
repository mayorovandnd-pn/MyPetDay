(function () {
  'use strict'; const P=window.PetGame,app=document.getElementById('app');
  const settings={players:1,mode:'daily',heroAnimal:'cat'};
  const u={error:'',timeActivity:null,compareCategory:'routine',compareFilter:'all',hint:false,roomDetails:false};
  let session=null,loaded=P.storage.read(),saved=loaded.session,nameTimer=null,toastTimer=null,exporting=false;
  const draft=()=>session&&(session.editDraft||session.draftPet);
  function toast(message) {const box=document.getElementById('toast');box.textContent=message;box.hidden=false;document.getElementById('announcer').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{box.hidden=true;},4000);}
  function persist() {if(session) {P.storage.write(session);document.getElementById('save-state').textContent=P.storage.reliable?'Your little world is saved on this device.':'Saved for this tab only. Save a session file to keep it.';} }
  function focusKey(el) {if(!el||!app.contains(el))return null;if(el.id)return {id:el.id};if(el.dataset.field)return {field:el.dataset.field,value:el.value};if(el.dataset.frequency)return {frequency:el.dataset.frequency,value:el.value};if(el.dataset.time)return {time:el.dataset.time,value:el.value};if(el.dataset.action)return {action:el.dataset.action,id:el.dataset.id};return null;}
  function restoreFocus(key) {if(!key)return;let el;if(key.id)el=document.getElementById(key.id);else el=Array.from(app.querySelectorAll('button,input,select')).find(e=>(key.field?e.dataset.field===key.field&&e.value===key.value:key.frequency?e.dataset.frequency===key.frequency&&e.value===key.value:key.time?e.dataset.time===key.time&&e.value===key.value:e.dataset.action===key.action&&e.dataset.id===key.id));if(el)el.focus({preventScroll:true});}
  function render(moveFocus=false) {
    const key=moveFocus?null:focusKey(document.activeElement);
    if(!session)app.innerHTML=P.ui.setup(saved,settings);
    else {P.state.sanitiseNavigation(session);app.innerHTML=P.ui[session.screen](session,u);}
    document.getElementById('restart').hidden=!session&&!saved;document.getElementById('save-session').hidden=!session;
    if(moveFocus){app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}else restoreFocus(key);
  }
  async function confirm(title,description,confirmLabel='Start again',cancelLabel='Keep playing') {
    const dialog=document.getElementById('confirm-dialog'),previous=document.activeElement;
    document.getElementById('dialog-title').textContent=title;document.getElementById('dialog-description').textContent=description;
    document.getElementById('dialog-confirm').textContent=confirmLabel;document.getElementById('dialog-cancel').textContent=cancelLabel;
    return new Promise(resolve=>{dialog.addEventListener('close',()=>{previous?.focus();resolve(dialog.returnValue==='confirm');},{once:true});dialog.returnValue='';dialog.showModal();document.getElementById('dialog-cancel').focus();});
  }
  async function restart() {
    if((session||saved)&&!await confirm('Start again?','Your pets and their stories will be removed.'))return;
    clearTimeout(nameTimer);P.storage.clear();session=null;saved=null;u.error='';u.timeActivity=null;document.getElementById('save-state').textContent='Your game stays on this device.';render(true);
  }
  function stepError(id) {
    const p=draft();
    if(id==='name')return P.nameError(p.name);
    if(id==='routine'){if(p.routine.length<6)return 'Choose at least 6 activities.';if(p.routine.some(e=>e.time===null))return 'Choose a time for each activity.';}
    if(id==='hobbies'){if(p.hobbies.length<3)return 'Choose at least 3 activities.';if(p.hobbies.some(e=>!e.frequency))return 'Choose how often for each activity.';}
    return '';
  }
  function moveStep(direction) {
    const steps=P.stepsFor(session.mode),index=steps.findIndex(s=>s.id===session.currentStep);
    if(direction>0){const error=stepError(session.currentStep);if(error){u.error=error;render();document.getElementById('step-error').scrollIntoView({block:'nearest'});return;}}
    if(index===0&&direction<0){if(session.editDraft){cancelEdit();return;}if(session.pets.length){session.screen='gallery';persist();render(true);}else restart();return;}
    session.currentStep=steps[Math.max(0,Math.min(steps.length-1,index+direction))].id;u.error='';u.timeActivity=null;persist();render(true);
  }
  async function cancelEdit() {
    const original=session.pets.find(p=>p.id===session.editDraft.id);
    if(JSON.stringify(original)!==JSON.stringify(session.editDraft)&&!await confirm('Discard your changes?','Your saved pet will stay just as it was.','Discard','Keep editing'))return;
    P.state.cancelEdit(session);u.error='';persist();render(true);
  }
  function setField(path,value) {
    const p=draft();if(!p)return;
    if(path==='favouriteHobbyId'){p.favouriteHobbyId=value||null;return;}
    const parts=path.split('.');if(parts.length===2)p[parts[0]][parts[1]]=value;else p[path]=value;
  }
  app.addEventListener('input',e=>{
    if(!e.target.matches('[data-name]'))return;
    const p=draft();p.name=e.target.value;u.error='';document.getElementById('step-error').hidden=true;
    document.getElementById('pet-name-preview').firstElementChild.textContent=p.name||'Your new friend';
    document.getElementById('live-scene').innerHTML=P.scene(p);clearTimeout(nameTimer);nameTimer=setTimeout(persist,300);
  });
  app.addEventListener('change',e=>{
    const el=e.target;
    if(el.dataset.setup){settings[el.dataset.setup]=el.dataset.setup==='players'?Number(el.value):el.value;render();return;}
    if(!session)return;
    if(el.dataset.field){setField(el.dataset.field,el.value);u.error='';persist();render();if(el.dataset.field==='toy'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.getElementById('live-scene')?.classList.add('pet-bounce');}return;}
    if(el.dataset.time){const entry=draft().routine.find(x=>x.activityId===el.dataset.time);entry.time=Number(el.value);u.timeActivity=null;u.error='';persist();render();app.querySelector(`[data-action="routine-time"][data-id="${entry.activityId}"]`)?.focus({preventScroll:true});return;}
    if(el.dataset.frequency){const p=draft(),h=p.hobbies.find(x=>x.activityId===el.dataset.frequency);h.frequency=el.value;if(h.frequency==='never'&&p.favouriteHobbyId===h.activityId){p.favouriteHobbyId=null;toast('Choose another favourite hobby.');}u.error='';persist();render();}
  });
  app.addEventListener('toggle',e=>{if(e.target.classList?.contains('room-details'))u.roomDetails=e.target.open;},true);
  app.addEventListener('click',async e=>{
    const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
    const action=button.dataset.action,id=button.dataset.id;
    try {
      if(action==='hero-animal'){settings.heroAnimal=id;render();return;}
      if(action==='import'){document.getElementById('import-session').click();return;}
      if(action==='start') {if(saved&&!await confirm('Create a new pet?','Your saved game will be replaced.','Create a new pet','Keep my game'))return;session=P.state.newSession(settings.players,settings.mode);saved=null;u.error='';persist();render(true);return;}
      if(action==='resume'){session=P.clone(saved);saved=null;persist();render(true);if(loaded.backup)toast('Your saved game was recovered.');return;}
      if(!session)return;
      const p=draft();
      switch(action) {
        case 'next': moveStep(1);return;
        case 'back': moveStep(-1);return;
        case 'step': {const steps=P.stepsFor(session.mode);if(steps.findIndex(x=>x.id===id)<=steps.findIndex(x=>x.id===session.currentStep)){session.currentStep=id;u.error='';u.timeActivity=null;}break;}
        case 'suggest-name': p.name=button.dataset.nameValue;break;
        case 'close-time': u.timeActivity=null;break;
        case 'routine-add': if(!p.routine.some(x=>x.activityId===id)&&p.routine.length<10)p.routine.push({activityId:id,time:null});u.timeActivity=id;u.error='';break;
        case 'routine-time': u.timeActivity=u.timeActivity===id?null:id;break;
        case 'routine-remove': p.routine=p.routine.filter(x=>x.activityId!==id);if(u.timeActivity===id)u.timeActivity=null;break;
        case 'hobby-add': if(!p.hobbies.some(x=>x.activityId===id)&&p.hobbies.length<6)p.hobbies.push({activityId:id,frequency:null});u.error='';break;
        case 'hobby-remove': p.hobbies=p.hobbies.filter(x=>x.activityId!==id);if(p.favouriteHobbyId===id)p.favouriteHobbyId=null;break;
        case 'save': {if(!p)return;const result=P.state.save(session);u.error='';toast(`${result.name} is saved!`);break;}
        case 'next-player': P.state.nextPlayer(session);u.error='';break;
        case 'gallery': session.screen=session.numberOfPlayers===1?'profile':'gallery';break;
        case 'continue': session.screen='creator';u.error='';break;
        case 'profile': session.screen='profile';break;
        case 'view': session.presentation.petId=id;session.screen='profile';break;
        case 'edit': P.state.beginEdit(session,id);u.error='';break;
        case 'cancel-edit': await cancelEdit();return;
        case 'select-pair': if(session.selectedPetIds.includes(id))session.selectedPetIds=session.selectedPetIds.filter(x=>x!==id);else if(session.selectedPetIds.length<2)session.selectedPetIds.push(id);else toast('Choose two pets. Deselect one to choose another.');break;
        case 'compare': if(!P.state.complete(session))return;if(session.numberOfPlayers===2)session.selectedPetIds=session.pets.map(p=>p.id);if(session.selectedPetIds.length!==2){toast('Choose two different pets.');return;}session.screen='compare';u.compareCategory='routine';u.compareFilter='all';break;
        case 'compare-category': u.compareCategory=id;break;
        case 'compare-filter': u.compareFilter=id;break;
        case 'present': session.presentation={petId:id,section:'identity',promptIndex:0};session.screen='presentation';u.hint=false;break;
        case 'present-section': session.presentation.section=id;session.presentation.promptIndex=0;u.hint=false;break;
        case 'toggle-hint': u.hint=!u.hint;break;
        case 'prompt-back': session.presentation.promptIndex=Math.max(0,session.presentation.promptIndex-1);u.hint=false;break;
        case 'prompt-next': {const pet=session.pets.find(x=>x.id===session.presentation.petId),prompts=P.ui.prompts(pet,session.mode).filter(q=>q.section===session.presentation.section);if(session.presentation.promptIndex<prompts.length-1)session.presentation.promptIndex++;else {const sections=['identity','routine',...(session.mode==='hobbies'?['hobbies']:[])],i=sections.indexOf(session.presentation.section);if(i<sections.length-1){session.presentation.section=sections[i+1];session.presentation.promptIndex=0;}else {toast('Well done! You brought your pet’s story to life.');session.screen=session.numberOfPlayers>1?'gallery':'profile';}}u.hint=false;break;}
        case 'export-card': if(exporting)return;exporting=true;button.disabled=true;toast('Making your pet card…');try{await P.exportCard(session.pets.find(p=>p.id===id),session.mode);toast('Your pet card is ready.');}catch(_){toast('We could not download the card. Try again.');}finally{exporting=false;button.disabled=false;}return;
        default:return;
      }
      persist();const navigating=['save','next-player','gallery','continue','profile','view','edit','compare','present','present-section','prompt-next','prompt-back','step'].includes(action);render(navigating);
      if(action==='routine-add'||action==='routine-time'){document.getElementById('routine-'+id)?.scrollIntoView({block:'nearest',behavior:'instant'});app.querySelector(`[data-time="${id}"]`)?.focus({preventScroll:true});}
    }catch(err){u.error=err.message||'Something went wrong. Try again.';render();toast(u.error);}
  });
  document.getElementById('restart').addEventListener('click',restart);
  document.getElementById('save-session').addEventListener('click',()=>{if(session){persist();P.downloadSession(session);toast('Your session file is ready.');}});
  document.getElementById('brand-home').addEventListener('click',e=>{e.preventDefault();if(session){if(session.editDraft){toast('Save your changes or cancel the edit first.');return;}if(session.numberOfPlayers>1&&session.pets.length)session.screen='gallery';else if(!draft())session.screen='profile';else{toast('Your little story is still growing. Keep creating!');return;}persist();}render(true);});
  document.getElementById('import-session').addEventListener('change',async e=>{
    const file=e.target.files[0];e.target.value='';if(!file)return;
    try {if(file.size>262144)throw new Error('This file is too big. Choose a saved game.');const imported=P.storage.decode(await file.text());if((session||saved)&&!await confirm('Open this saved game?','It will replace the game on this device.','Open game','Keep my game'))return;session=imported;saved=null;u.error='';u.timeActivity=null;persist();render(true);toast('Your little world is back.');}catch(err){toast(err.message==='This saved game cannot be opened here.'?err.message:'This file is not a saved game.');}
  });
  document.getElementById('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.getElementById('app-root').requestFullscreen)await document.getElementById('app-root').requestFullscreen();else throw new Error();}catch(_){toast('Full screen is not available here.');}});
  document.addEventListener('fullscreenchange',()=>{document.getElementById('fullscreen').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
  window.addEventListener('pagehide',persist);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persist();});
  window.addEventListener('beforeunload',e=>{if(session&&!P.storage.reliable){e.preventDefault();e.returnValue='';}});
  const catalogueMissing=P.activities.some(a=>!P.icon(a.icon))||Object.keys(P.art||{}).length!==104;
  if(catalogueMissing){app.innerHTML='<p class="notice">The art pack could not be loaded. Keep all game files together and open index.html again.</p>';return;}
  render();if(loaded.invalid)toast('This saved game cannot be opened. You can open a session file.');
  // Small read-only QA hooks; game data stays local.
  P.getSession=()=>session?P.clone(session):null;
})();
