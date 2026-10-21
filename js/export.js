(function () {
  'use strict';const P=window.PetGame;
  function download(blob,name) {const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  const filename=name=>(name||'pet').replace(/[^\p{L}\p{N}_-]/gu,'_').slice(0,40)||'pet';
  P.downloadSession=session=>download(new Blob([JSON.stringify(session,null,2)],{type:'application/json'}),'my-pet-session.json');
  P.exportCard=async function(pet,mode) {
    const E=P.escape,rows=P.grammar.sortedRoutine(pet).map(e=>({text:P.grammar.routineSentence(pet,e),extra:P.grammar.partOfDay(e.time)}));
    const hobbies=mode==='hobbies'?pet.hobbies.map(e=>({text:P.grammar.hobbySentence(pet,e),extra:e.frequency})):[];
    const measure=document.createElement('canvas').getContext('2d');if(!measure)throw new Error('Canvas unavailable');
    measure.font='25px "Trebuchet MS", "Segoe UI", sans-serif';
    const prepare=row=>{const lines=[];let current='';for(const word of row.text.split(' ')){const candidate=current?current+' '+word:word;if(current&&measure.measureText(candidate).width>850){lines.push(current);current=word;}else current=candidate;}if(current)lines.push(current);return {...row,lines,height:Math.max(58,lines.length*32+18)};};
    const dayRows=rows.map(prepare),hobbyRows=hobbies.map(prepare),height=885+dayRows.reduce((n,r)=>n+r.height,0)+(hobbyRows.length?90+hobbyRows.reduce((n,r)=>n+r.height,0):0),width=1200;
    measure.font='55px "Trebuchet MS", "Segoe UI", sans-serif';const titleSize=Math.min(55,Math.floor(55*1080/measure.measureText('Meet '+pet.name+'!').width));
    const scene=P.scene(pet,{decorative:true}).replace(/width="[^"]*"/,'width="1080"').replace(/height="[^"]*"/,'height="608"');
    let y=850;
    const drawRow=row=>{const output=row.lines.map((line,i)=>`<text x="78" y="${y+i*32}" font-size="25" fill="#234E52">${E(line)}</text>`).join('')+`<text x="1120" y="${y}" font-size="17" text-anchor="end" fill="#6D675F">${E(row.extra)}</text>`;y+=row.height;return output;};
    let content=dayRows.map(drawRow).join('');if(hobbyRows.length){y+=30;content+=`<text x="78" y="${y}" font-size="29" font-weight="bold" fill="#234E52">FREE TIME</text>`;y+=60;content+=hobbyRows.map(drawRow).join('');}
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="1200" height="${height}" fill="#F6F0E4"/><g font-family="Trebuchet MS,Segoe UI,sans-serif"><text x="60" y="55" font-size="18" letter-spacing="3" fill="#6D675F">CREATE YOUR PET · PLAYER ${pet.playerNumber}</text><text x="60" y="120" font-size="${titleSize}" font-weight="bold" fill="#234E52">Meet ${E(pet.name)}!</text><svg x="60" y="150" width="1080" height="608" viewBox="0 0 960 540">${scene.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg><text x="78" y="800" font-size="29" font-weight="bold" fill="#234E52">MY DAY</text>${content}</g></svg>`;
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
    try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');context.drawImage(image,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('No card');download(blob,filename(pet.name)+'-pet-card.png');}finally{URL.revokeObjectURL(url);}
  };
})();
