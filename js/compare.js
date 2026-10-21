(function () {
  'use strict'; const P=window.PetGame;
  P.comparePets=function(left,right,mode) {
    const result=[];
    for(const category of ['routine',...(mode==='hobbies'?['hobbies']:[])]) {
      const a=new Map(left[category].map(e=>[e.activityId,e])),b=new Map(right[category].map(e=>[e.activityId,e]));
      for(const activity of P.activities) if(a.has(activity.id)||b.has(activity.id)) {
        const field=category==='routine'?'time':'frequency',lv=a.get(activity.id)?.[field]??null,rv=b.get(activity.id)?.[field]??null;
        result.push({category,key:activity.id,label:activity.label,leftValue:lv,rightValue:rv,status:lv===null||rv===null?'not_shown':lv===rv?'same':'different',sharedActivity:lv!==null&&rv!==null});
      }
    }
    const fields=[['animalType','Animal','animals'],['accessory.neck','Collar or bandana','neck'],['accessory.head','Hat or headphones','head'],['bowl','Bowl','bowls'],['toy','Toy','toys'],['room.theme','Room','rooms'],['room.bed','Bed','beds'],['room.rug','Rug','rugs'],['room.wallDecoration','Wall art','walls']];
    const get=(p,path)=>path.split('.').reduce((o,k)=>o[k],p);
    for(const [key,label,group] of fields) {const lv=get(left,key),rv=get(right,key);result.push({category:'looks',key,label,group,leftValue:lv,rightValue:rv,status:lv===rv?'same':'different',sharedActivity:false});}
    return result;
  };
})();
