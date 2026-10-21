(function () {
  'use strict';
  const P=window.PetGame;
  const has=(group,id)=>P.catalog[group].some(o=>o.id===id);
  P.normaliseName=value=>String(value||'').trim().replace(/\s+/gu,' ');
  P.nameError=function(value) {
    const name=P.normaliseName(value);
    if(!name) return 'Give your pet a name.';
    if(Array.from(name).length>20) return 'Use 20 characters or fewer.';
    if(!/^[\p{L}\p{N} '\-]+$/u.test(name)||!/[\p{L}\p{N}]/u.test(name)) return "Use letters, numbers, spaces, - or '.";
    return '';
  };
  function petErrors(pet,mode,complete=true) {
    const errors=[];
    if(!pet||typeof pet!=='object') return ['This pet cannot be opened.'];
    if(typeof pet.id!=='string'||!pet.id||pet.id.length>120) errors.push('Invalid pet reference.');
    if(!Number.isInteger(pet.playerNumber)||pet.playerNumber<1||pet.playerNumber>4) errors.push('Invalid player number.');
    if(typeof pet.name!=='string'||(complete&&P.nameError(pet.name))||(!complete&&pet.name!==''&&P.nameError(pet.name)&&Array.from(pet.name).length>100)) errors.push(complete?P.nameError(pet.name)||'Invalid name.':'Invalid name.');
    if(pet.pronoun!=='it') errors.push('Invalid pet reference.');
    for(const [group,id] of [['animals',pet.animalType],['neck',pet.accessory?.neck],['head',pet.accessory?.head],['bowls',pet.bowl],['toys',pet.toy],['rooms',pet.room?.theme],['beds',pet.room?.bed],['rugs',pet.room?.rug],['walls',pet.room?.wallDecoration]]) if(!has(group,id)) errors.push('An option is not available.');
    for(const [key,role,max,min] of [['routine','routine',10,6],['hobbies','hobby',6,3]]) {
      const arr=pet[key]; if(!Array.isArray(arr)){errors.push('Missing activities.');continue;}
      const needs=key==='routine'||mode==='hobbies';
      if(arr.length>max||(complete&&needs&&arr.length<min)) errors.push(`Choose ${min}–${max} ${key==='hobbies'?'free-time activities':'activities for its day'}.`);
      if(new Set(arr.map(e=>e?.activityId)).size!==arr.length) errors.push('Choose each activity once.');
      for(const entry of arr) {
        if(!entry||!P.activityMap[entry.activityId]?.roles.includes(role)||!P.activityMap[entry.activityId]?.availableInMode.includes(mode)) {errors.push('An activity is not available.');continue;}
        if(key==='routine'&&!(entry.time===null&&!complete)&&(!Number.isInteger(entry.time)||entry.time<6||entry.time>22)) errors.push('Choose a time.');
        if(key==='hobbies'&&!(entry.frequency===null&&!complete)&&!has('frequencies',entry.frequency)) errors.push('Choose how often.');
      }
    }
    if(mode==='daily'&&(pet.hobbies?.length||pet.favouriteHobbyId!==null)) errors.push('Free time is not used in this mode.');
    if(pet.favouriteHobbyId!==null&&!pet.hobbies?.some(h=>h.activityId===pet.favouriteHobbyId&&h.frequency&&h.frequency!=='never')) errors.push('Choose a favourite from its hobbies.');
    return [...new Set(errors)];
  }
  function sessionErrors(s) {
    const errors=[];
    if(!s||typeof s!=='object'||s.schemaVersion!==1) return ['This saved game cannot be opened here.'];
    if(!['daily','hobbies'].includes(s.mode)||!Number.isInteger(s.numberOfPlayers)||s.numberOfPlayers<1||s.numberOfPlayers>4||!Number.isInteger(s.currentPlayer)||s.currentPlayer<1||s.currentPlayer>s.numberOfPlayers) return ['This file is not a saved game.'];
    if(typeof s.sessionId!=='string'||s.sessionId.length>120||typeof s.updatedAt!=='string'||!Number.isFinite(Date.parse(s.updatedAt))) errors.push('Invalid saved game.');
    if(!Array.isArray(s.pets)||s.pets.length>s.numberOfPlayers) return ['Invalid pets.'];
    if(new Set(s.pets.map(p=>p?.id)).size!==s.pets.length||new Set(s.pets.map(p=>p?.playerNumber)).size!==s.pets.length) errors.push('Duplicate pets.');
    for(const pet of s.pets) {errors.push(...petErrors(pet,s.mode));if(pet.playerNumber>s.numberOfPlayers)errors.push('Invalid player.');}
    for(const draft of [s.draftPet,s.editDraft]) if(draft!==null) {errors.push(...petErrors(draft,s.mode,false));if(draft?.playerNumber>s.numberOfPlayers)errors.push('Invalid draft.');}
    if(s.draftPet&&(s.draftPet.playerNumber!==s.currentPlayer||s.pets.some(p=>p.playerNumber===s.draftPet.playerNumber))) errors.push('Invalid current pet.');
    if(s.editDraft&&(!s.editContext||s.editContext.petId!==s.editDraft.id||!s.pets.some(p=>p.id===s.editDraft.id&&p.playerNumber===s.editDraft.playerNumber))) errors.push('Invalid edit.');
    if(!Array.isArray(s.selectedPetIds)||s.selectedPetIds.length>2||new Set(s.selectedPetIds).size!==s.selectedPetIds.length||s.selectedPetIds.some(id=>!s.pets.some(p=>p.id===id))) errors.push('Invalid selection.');
    if(!s.presentation||!['identity','routine','hobbies'].includes(s.presentation.section)||!Number.isInteger(s.presentation.promptIndex)||s.presentation.promptIndex<0||s.presentation.promptIndex>100||(s.presentation.petId!==null&&!s.pets.some(p=>p.id===s.presentation.petId))) errors.push('Invalid presentation.');
    return [...new Set(errors)];
  }
  P.validation={petErrors,sessionErrors,has};
})();
