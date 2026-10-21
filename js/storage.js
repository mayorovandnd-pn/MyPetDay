(function () {
  'use strict'; const P=window.PetGame,key='createYourPet.session.v1',backup='createYourPet.session.backup.v1';
  let reliable=true;
  function decode(raw) {const s=JSON.parse(raw);const errors=P.validation.sessionErrors(s);if(errors.length)throw new Error(errors[0]);return P.state.sanitiseNavigation(s);}
  function write(s) {
    s.updatedAt=new Date().toISOString(); const data=JSON.stringify(s);
    try {decode(data);const old=localStorage.getItem(key);if(old){try{decode(old);localStorage.setItem(backup,old);}catch(_) { /* keep valid primary even if backup fails */ }}localStorage.setItem(key,data);reliable=true;return true;}catch(e){reliable=false;return false;}
  }
  function read() {
    let hadData=false;
    try {for(const k of [key,backup]) {const raw=localStorage.getItem(k);if(raw){hadData=true;try{return {session:decode(raw),backup:k===backup};}catch(_) { /* try backup */ }}}}catch(_){reliable=false;}
    return {session:null,invalid:hadData};
  }
  function clear() {try{localStorage.removeItem(key);localStorage.removeItem(backup);return true;}catch(_){reliable=false;return false;}}
  P.storage={write,read,clear,decode,get reliable(){return reliable;}};
})();
