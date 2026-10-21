(function () {
  'use strict';
  const P=window.PetGame;
  function activity(id) { if(!P.activityMap[id]) throw new Error('UNKNOWN_ACTIVITY'); return P.activityMap[id]; }
  function timeLabel(time) { if(!Number.isInteger(time)||time<6||time>22) throw new Error('INVALID_TIME'); return (time%12||12)+' o’clock'; }
  function partOfDay(time) { return time<12?'Morning':time<18?'Afternoon':'Evening'; }
  const phrase = (id,plural) => (plural?activity(id).basePhrase:activity(id).thirdPerson).replace('{possessive}',plural?'their':'its');
  P.grammar={timeLabel,partOfDay,thirdPerson:id=>phrase(id,false),basePhrase:(id,plural=false)=>activity(id).basePhrase.replace('{possessive}',plural?'their':'its'),
    routineSentence:(pet,entry,useName=true)=>`${useName?pet.name:'It'} ${phrase(entry.activityId,false)} at ${timeLabel(entry.time)}.`,
    hobbySentence:(pet,entry,useName=true)=>`${useName?pet.name:'It'} ${entry.frequency} ${phrase(entry.activityId,false)}.`,
    question:(id,kind)=>`${kind==='time'?'What time':'How often'} does it ${activity(id).basePhrase.replace('{possessive}','its')}?`,
    pluralStarter:id=>`Both pets ${phrase(id,true)}…`,
    sortedRoutine:pet=>pet.routine.map((e,i)=>({...e,_order:i})).sort((a,b)=>a.time-b.time||a._order-b._order)
  };
})();
