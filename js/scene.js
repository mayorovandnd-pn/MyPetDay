(function () {
  'use strict';
  var G = window.PetGame = window.PetGame || {}, sequence = 0;
  var anchors = {
    cat: { neck: [160, 182, 102, 62], head: [160, 76, 112, 72] },
    dog: { neck: [160, 181, 102, 62], head: [160, 76, 112, 72] },
    fox: { neck: [160, 181, 102, 62], head: [160, 76, 110, 70] },
    rabbit: { neck: [160, 181, 98, 61], head: [160, 88, 96, 59] },
    raccoon: { neck: [160, 181, 101, 62], head: [160, 77, 110, 70] },
    red_panda: { neck: [160, 182, 104, 62], head: [160, 77, 112, 72] },
    mini_pig: { neck: [160, 185, 105, 62], head: [160, 74, 116, 72] }
  };
  G.artMetadata = { count: 104, anchors: anchors, roomSize: [960, 540], petSize: [320, 320] };
  function escape(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (s) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]; }); }
  function asset(id) {
    var a = G.art || {}, key = String(id || '').replace(/\.svg$/, '').replace(/^assets\//, '');
    if (a[key]) return a[key];
    if (key.indexOf('activity_') === 0) key = key.slice(9);
    var prefixes = ['activities/', 'ui/', 'pets/', 'accessories/', 'bowls/', 'toys/', 'rooms/items/'];
    for (var i = 0; i < prefixes.length; i++) if (a[prefixes[i] + key]) return a[prefixes[i] + key];
    return null;
  }
  function body(id, prefix) {
    var a = asset(id);
    if (!a) return '';
    return a.body.replace(/\bid="([^"]+)"/g, 'id="' + prefix + '$1"').replace(/url\(#([^)]+)\)/g, 'url(#' + prefix + '$1)').replace(/href="#([^"]+)"/g, 'href="#' + prefix + '$1"');
  }
  G.icon = function (id, size) {
    var a = asset(id); if (!a) return '';
    var n = Number(size) || 32, prefix = 'pet-icon-' + (++sequence) + '-';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + a.viewBox + '" width="' + n + '" height="' + n + '" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">' + body(id, prefix) + '</svg>';
  };
  function placed(id, x, y, w, h, prefix) {
    var a = asset(id); if (!a) return '';
    var vb = a.viewBox.split(' ').map(Number);
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (w / vb[2]) + ' ' + (h / vb[3]) + ')">' + body(id, prefix) + '</g>';
  }
  function animal(pet, expression, prefix) {
    var type = anchors[pet.animalType] ? pet.animalType : 'cat', a = anchors[type];
    var b = body('pet_' + type, prefix);
    var exp = ['neutral', 'happy', 'excited'].indexOf(expression) >= 0 ? expression : 'neutral';
    b = b.replace(/<g data-expression="([^"]+)"(?: style="display:none")?>/g, function (_, state) { return '<g data-expression="' + state + '"' + (state === exp ? '' : ' style="display:none"') + '>'; });
    var accessory = pet.accessory || {};
    if (accessory.head && accessory.head !== 'none') {
      var headY = type === 'rabbit' && accessory.head !== 'headphones' ? 98 : a.head[1];
      var head = placed('head_' + accessory.head.replace(/^head_/, ''), a.head[0] - a.head[2] / 2, headY - a.head[3] / 2, a.head[2], a.head[3], prefix + 'head-');
      // Caps sit behind the ears; headphones surround the ear bases.
      if (accessory.head === 'headphones') b += head;
      else {
        var ears = b.match(/<g data-part="ears">([\s\S]*?)<\/g>/);
        b += head + (ears ? '<defs><clipPath id="' + prefix + 'ear-front"><rect x="0" y="0" width="320" height="' + (type === 'rabbit' ? 88 : 90) + '"/></clipPath></defs><g clip-path="url(#' + prefix + 'ear-front)">' + ears[0] + '</g>' : '');
      }
    }
    if (accessory.neck && accessory.neck !== 'none') b += placed('neck_' + accessory.neck.replace(/^neck_/, ''), a.neck[0] - a.neck[2] / 2, a.neck[1] - a.neck[3] / 2, a.neck[2], a.neck[3], prefix + 'neck-');
    return '<g class="pet-character">' + b + '</g>';
  }
  G.scene = G.composeScene = function (pet, options) {
    pet = pet || {}; options = options || {};
    var room = pet.room || {}, theme = ['cozy', 'gamer', 'forest', 'space', 'sporty', 'creative'].indexOf(room.theme) >= 0 ? room.theme : 'cozy';
    var prefix = 'pet-scene-' + (++sequence) + '-', only = !!options.animalOnly;
    var label = escape((pet.name || 'Your pet') + ', a ' + (pet.animalType || 'cat').replace('_', ' ') + (only ? '' : ' in a ' + theme + ' room'));
    var content = '';
    if (only) content = animal(pet, options.expression, prefix);
    else {
      ['background', 'floor', 'furniture'].forEach(function (layer) { content += body('rooms/' + theme + '/' + layer, prefix + layer + '-'); });
      content += placed('rug_' + (room.rug || 'round'), 280, 420, 400, 110, prefix + 'rug-');
      content += placed('bed_' + (room.bed || 'cushion'), 80, 330, 220, 165, prefix + 'bed-');
      content += body('rooms/' + theme + '/decor', prefix + 'decor-');
      content += placed('wall_' + (room.wallDecoration || 'moon'), 690, 75, 150, 112.5, prefix + 'wall-');
      content += '<g transform="translate(320 185)">' + animal(pet, options.expression, prefix) + '</g>';
      content += placed('bowl_' + (pet.bowl || 'ceramic'), 225, 405, 150, 112.5, prefix + 'bowl-');
      content += placed('toy_' + (pet.toy || 'ball'), 665, 423, 130, 97.5, prefix + 'toy-');
    }
    return '<svg class="pet-scene' + (only ? ' animal-only' : '') + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (only ? '320 320' : '960 540') + '" preserveAspectRatio="xMidYMid meet" ' + (options.decorative ? 'aria-hidden="true"' : 'role="img" aria-label="' + label + '"') + '><title>' + label + '</title>' + content + '</svg>';
  };
})();
