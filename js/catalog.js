(function () {
  'use strict';
  const P = window.PetGame = window.PetGame || {};
  P.escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rows = [
    ['get_up','get up','gets up','routine'],['get_dressed','get dressed','gets dressed','routine'],
    ['have_breakfast','have breakfast','has breakfast','routine'],['brush_teeth','brush my teeth','brushes {possessive} teeth','routine'],
    ['go_to_school','go to school','goes to school','routine'],['have_lunch','have lunch','has lunch','routine'],
    ['play_in_park','play in the park','plays in the park','routine'],['have_dinner','have dinner','has dinner','routine'],
    ['go_to_bed','go to bed','goes to bed','routine'],['go_swimming','go swimming','goes swimming','both'],
    ['read_books','read books','reads books','both'],['play_tennis','play tennis','plays tennis','both'],
    ['watch_tv','watch TV','watches TV','both'],['play_board_games','play board games','plays board games','both'],
    ['play_computer_games','play computer games','plays computer games','both'],['play_football','play football','plays football','both'],
    ['chat_online','chat online','chats online','hobby'],['listen_to_music','listen to music','listens to music','hobby'],
    ['read_magazines','read magazines','reads magazines','hobby'],['go_for_bike_ride','go for a bike ride','goes for a bike ride','hobby'],
    ['hang_out_with_friends','hang out with friends','hangs out with friends','hobby'],['write_blog','write a blog','writes a blog','hobby'],
    ['make_videos','make videos','makes videos','hobby'],['make_cakes','make cakes','makes cakes','hobby'],
    ['take_photos','take photos','takes photos','hobby'],['play_instrument','play an instrument','plays an instrument','hobby'],
    ['go_shopping','go shopping','goes shopping','hobby'],['download_songs','download songs','downloads songs','hobby']
  ];
  P.activities = rows.map(([id,label,thirdPerson,role], i) => ({id,label,thirdPerson,basePhrase:id==='brush_teeth'?'brush {possessive} teeth':label,category:role==='routine'?'routine':'free_time',roles:role==='both'?['routine','hobby']:[role],availableInMode:role==='hobby'?['hobbies']:['daily','hobbies'],icon:'activity_'+id,enabled:true,sortOrder:i}));
  P.activityMap = Object.fromEntries(P.activities.map(a=>[a.id,a]));
  Object.setPrototypeOf(P.activityMap,null);
  const options = pairs => pairs.map(([id,label])=>({id,label}));
  P.catalog = {
    animals: options([['cat','Cat'],['dog','Dog'],['fox','Fox'],['rabbit','Rabbit'],['raccoon','Raccoon'],['red_panda','Red panda'],['mini_pig','Mini-pig']]),
    neck: options([['none','No collar'],['collar_teal','Teal collar'],['collar_mustard','Mustard collar'],['collar_striped','Striped collar'],['bandana_sage','Sage bandana'],['bandana_terracotta','Terracotta bandana'],['bandana_checked','Checked bandana']]),
    head: options([['none','No hat'],['cap','Cap'],['headphones','Headphones'],['beanie','Beanie']]),
    bowls: options([['ceramic','Ceramic'],['striped','Striped'],['paw_print','Paw print'],['modern','Modern'],['colourful','Colourful']]),
    toys: options([['ball','Ball'],['rope','Rope'],['teddy','Teddy'],['squeaky','Squeaky toy'],['puzzle','Puzzle toy'],['mouse','Little mouse']]),
    rooms: options([['cozy','Cozy room'],['gamer','Gamer room'],['forest','Forest room'],['space','Space room'],['sporty','Sporty room'],['creative','Creative room']]),
    beds: options([['cushion','Cushion'],['basket','Basket'],['oval','Oval bed']]),
    rugs: options([['round','Round rug'],['striped','Striped rug'],['leaf','Leaf rug']]),
    walls: options([['moon','Moon'],['mountain','Mountains'],['abstract','Abstract art']]),
    frequencies: options([['always','Always'],['often','Often'],['sometimes','Sometimes'],['never','Never']])
  };
  P.steps = [{id:'animal',title:'Choose your pet.',short:'Pet'}, {id:'name',title:'What is your pet’s name?',short:'Name'}, {id:'customise',title:'A little bit of personality.',short:'Style'}, {id:'bowl',title:'Choose a bowl.',short:'Bowl'}, {id:'toy',title:'Find its favourite toy.',short:'Toy'}, {id:'room',title:'Make it feel at home.',short:'Room'}, {id:'routine',title:'Build its day.',short:'My day'}, {id:'hobbies',title:'What does it do in its free time?',short:'Free time'}, {id:'review',title:'Meet your pet!',short:'Meet'}];
  P.stepsFor = mode => P.steps.filter(s=>mode==='hobbies'||s.id!=='hobbies');
  P.optionLabel = (group,id) => (P.catalog[group].find(x=>x.id===id)||{}).label || id;
  P.clone = value => JSON.parse(JSON.stringify(value));
  let counter = 0;
  P.uid = () => (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : 'local-'+Date.now().toString(36)+'-'+(++counter)+'-'+Math.random().toString(36).slice(2,9);
})();
