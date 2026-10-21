(function () {
  'use strict'; const P=window.PetGame;
  function newPet(playerNumber) {return {id:P.uid(),playerNumber,name:'',pronoun:'it',animalType:'cat',accessory:{neck:'none',head:'none'},bowl:'ceramic',toy:'ball',room:{theme:'cozy',bed:'cushion',rug:'round',wallDecoration:'moon'},routine:[],hobbies:[],favouriteHobbyId:null};}
  function newSession(numberOfPlayers,mode) {return {schemaVersion:1,sessionId:P.uid(),mode,numberOfPlayers,currentPlayer:1,screen:'creator',currentStep:'animal',pets:[],draftPet:newPet(1),editDraft:null,editContext:null,selectedPetIds:[],presentation:{petId:null,section:'identity',promptIndex:0},updatedAt:new Date().toISOString()};}
  function complete(s) {return s.pets.length===s.numberOfPlayers;}
  function save(s) {
    if(!s.editDraft&&!s.draftPet) {const existing=s.pets.find(p=>p.playerNumber===s.currentPlayer);if(existing)return existing;throw new Error('Create a pet first.');}
    const pet=P.clone(s.editDraft||s.draftPet);pet.name=P.normaliseName(pet.name);
    const errors=P.validation.petErrors(pet,s.mode);if(errors.length)throw new Error(errors[0]);
    if(s.editDraft) {const i=s.pets.findIndex(p=>p.id===pet.id);if(i<0)throw new Error('Pet not found.');s.pets[i]=pet;const context=s.editContext;s.editDraft=null;s.editContext=null;s.screen=context.returnScreen||'gallery';s.currentStep=context.returnStep||'animal';}
    else {if(!s.pets.some(p=>p.id===pet.id))s.pets.push(pet);s.draftPet=null;s.screen='profile';s.presentation.petId=pet.id;}
    return pet;
  }
  function nextPlayer(s) {if(s.editDraft||!s.pets.some(p=>p.playerNumber===s.currentPlayer)||s.currentPlayer>=s.numberOfPlayers)throw new Error('Save your pet first.');s.currentPlayer++;s.draftPet=newPet(s.currentPlayer);s.screen='creator';s.currentStep='animal';}
  function beginEdit(s,id) {const p=s.pets.find(p=>p.id===id);if(!p)throw new Error('Pet not found.');s.editContext={petId:id,returnScreen:s.screen,returnStep:s.currentStep};s.editDraft=P.clone(p);s.screen='creator';s.currentStep='animal';}
  function cancelEdit(s) {if(!s.editContext)return;s.screen=s.editContext.returnScreen;s.currentStep=s.editContext.returnStep;s.editDraft=null;s.editContext=null;}
  function sanitiseNavigation(s) {
    if(!['creator','profile','gallery','compare','presentation'].includes(s.screen))s.screen=s.draftPet||s.editDraft?'creator':'profile';
    if(!P.stepsFor(s.mode).some(step=>step.id===s.currentStep))s.currentStep='animal';
    if(s.screen==='creator'&&!s.draftPet&&!s.editDraft)s.screen='profile';
    if(['compare','gallery'].includes(s.screen)&&s.numberOfPlayers===1)s.screen='profile';
    if(s.screen==='compare'&&(!complete(s)||s.selectedPetIds.length!==2))s.screen='gallery';
    if(['profile','presentation'].includes(s.screen)&&!s.pets.length)s.screen='creator';
    if(s.pets.length&&!s.pets.some(p=>p.id===s.presentation.petId))s.presentation.petId=s.pets[0].id;
    return s;
  }
  P.state={newPet,newSession,complete,save,nextPlayer,beginEdit,cancelEdit,sanitiseNavigation};
})();
