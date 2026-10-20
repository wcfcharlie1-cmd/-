/*
 * 初版候選資料集。
 * 基本識別資料與圖片識別碼用於示範配對流程；traitScores 是初始配對模型標籤，
 * 不是官方人格判定，發布前應逐筆對照官方圖鑑／作品並核查來源。
 */
(function () {
  const traitKeys = ['approach', 'social', 'values', 'challenge', 'lifestyle', 'companion'];
  const rows = [
    [1,'妙蛙種子','Bulbasaur',['草','毒'],'bulbasaur',['plant','amphibian','cute'],[3,3,4,2,2,4]],
    [4,'小火龍','Charmander',['火'],'charmander',['reptile','dragon','cute'],[3,3,3,4,4,3]],
    [7,'傑尼龜','Squirtle',['水'],'squirtle',['reptile','aquatic','cute'],[3,3,3,3,3,3]],
    [25,'皮卡丘','Pikachu',['電'],'pikachu',['rodent','electric','cute'],[3,4,4,3,4,4]],
    [26,'雷丘','Raichu',['電'],'pikachu',['rodent','electric'],[3,3,3,3,4,3]],
    [37,'六尾','Vulpix',['火'],'vulpix',['canine','fox','cute'],[3,3,3,2,3,4]],
    [38,'九尾','Ninetales',['火'],'vulpix',['canine','fox','mystical'],[4,2,3,2,2,4]],
    [52,'喵喵','Meowth',['一般'],'meowth',['feline','cute'],[4,3,3,3,4,3]],
    [54,'可達鴨','Psyduck',['水'],'psyduck',['aquatic','bird','cute'],[2,3,3,2,2,3]],
    [58,'卡蒂狗','Growlithe',['火'],'growlithe',['canine','cute'],[3,4,4,3,4,4]],
    [59,'風速狗','Arcanine',['火'],'growlithe',['canine','fire'],[3,4,4,4,4,4]],
    [63,'凱西','Abra',['超能力'],'abra',['mystical'],[4,1,2,1,2,2]],
    [65,'胡地','Alakazam',['超能力'],'abra',['humanoid','mystical'],[4,2,2,3,2,2]],
    [94,'耿鬼','Gengar',['幽靈','毒'],'gastly',['ghost','mischievous','mystical'],[3,3,3,4,4,3]],
    [133,'伊布','Eevee',['一般'],'eevee',['mammal','cute'],[3,4,4,3,4,4]],
    [134,'水伊布','Vaporeon',['水'],'eevee',['aquatic','cute'],[3,3,3,2,3,4]],
    [135,'雷伊布','Jolteon',['電'],'eevee',['mammal','electric'],[3,3,3,4,4,3]],
    [136,'火伊布','Flareon',['火'],'eevee',['mammal','cute'],[3,4,4,3,3,4]],
    [131,'拉普拉斯','Lapras',['水','冰'],'lapras',['aquatic','gentle','mystical'],[3,4,4,2,3,4]],
    [143,'卡比獸','Snorlax',['一般'],'snorlax',['mammal','cute'],[2,3,3,1,1,4]],
    [147,'迷你龍','Dratini',['龍'],'dratini',['dragon','aquatic','cute'],[3,3,3,3,4,3]],
    [149,'快龍','Dragonite',['龍','飛行'],'dratini',['dragon','flying','gentle'],[3,4,4,4,4,4]],
    [150,'超夢','Mewtwo',['超能力'],'mewtwo',['humanoid','mystical'],[4,1,2,4,2,1]],
    [151,'夢幻','Mew',['超能力'],'mew',['mystical','cute'],[4,4,4,3,4,4]],
    [152,'菊草葉','Chikorita',['草'],'chikorita',['plant','cute'],[2,4,4,1,3,4]],
    [155,'火球鼠','Cyndaquil',['火'],'cyndaquil',['mammal','cute'],[3,3,3,3,3,3]],
    [158,'小鋸鱷','Totodile',['水'],'totodile',['reptile','aquatic','cute'],[2,4,3,4,4,3]],
    [175,'波克比','Togepi',['妖精'],'togepi',['cute','mystical'],[2,4,4,1,3,4]],
    [196,'太陽伊布','Espeon',['超能力'],'eevee',['feline','mystical'],[4,3,3,3,3,4]],
    [197,'月亮伊布','Umbreon',['惡'],'eevee',['feline','mystical'],[4,3,4,3,2,4]],
    [252,'木守宮','Treecko',['草'],'treecko',['reptile','plant'],[4,2,3,3,3,2]],
    [255,'火稚雞','Torchic',['火'],'torchic',['bird','cute'],[2,4,3,3,4,4]],
    [258,'水躍魚','Mudkip',['水'],'mudkip',['aquatic','amphibian','cute'],[3,4,4,3,4,4]],
    [282,'沙奈朵','Gardevoir',['超能力','妖精'],'ralts',['humanoid','mystical'],[4,4,4,2,2,4]],
    [359,'阿勃梭魯','Absol',['惡'],'absol',['canine','mystical'],[4,2,3,4,2,3]],
    [445,'烈咬陸鯊','Garchomp',['龍','地面'],'gible',['dragon','reptile'],[3,2,3,4,4,3]],
    [447,'利歐路','Riolu',['格鬥'],'riolu',['canine','cute'],[3,4,4,4,4,4]],
    [448,'路卡利歐','Lucario',['格鬥','鋼'],'riolu',['canine','humanoid'],[4,4,4,4,3,4]],
    [479,'洛托姆','Rotom',['電','幽靈'],'rotom',['electric','machine','mystical'],[4,2,2,4,4,2]],
    [570,'索羅亞','Zorua',['惡'],'zorua',['canine','fox','mystical','cute'],[4,3,3,3,4,3]],
    [571,'索羅亞克','Zoroark',['惡'],'zorua',['canine','fox','mystical'],[4,3,3,4,3,3]],
    [607,'燭光靈','Litwick',['幽靈','火'],'litwick',['ghost','mystical','cute'],[3,2,2,2,2,2]],
    [609,'水晶燈火靈','Chandelure',['幽靈','火'],'litwick',['ghost','mystical'],[4,2,2,4,2,2]],
    [610,'牙牙','Axew',['龍'],'axew',['dragon','reptile','cute'],[2,3,3,4,4,3]],
    [658,'甲賀忍蛙','Greninja',['水','惡'],'froakie',['amphibian','humanoid'],[4,3,3,4,4,3]],
    [700,'仙子伊布','Sylveon',['妖精'],'eevee',['mammal','cute','mystical'],[3,4,4,2,3,4]],
    [722,'木木梟','Rowlet',['草','飛行'],'rowlet',['bird','cute','plant'],[3,4,3,2,3,4]],
    [744,'岩狗狗','Rockruff',['岩石'],'rockruff',['canine','cute'],[2,4,4,3,4,4]],
    [778,'謎擬Q','Mimikyu',['幽靈','妖精'],'mimikyu',['ghost','cute','mystical'],[3,4,4,2,2,4]],
    [831,'毛辮羊','Wooloo',['一般'],'wooloo',['mammal','cute'],[2,4,4,1,3,4]],
    [835,'來電汪','Yamper',['電'],'yamper',['canine','electric','cute'],[2,4,4,3,4,4]],
    [906,'新葉喵','Sprigatito',['草'],'sprigatito',['feline','plant','cute'],[3,3,3,3,4,4]],
    [909,'呆火鱷','Fuecoco',['火'],'fuecoco',['reptile','cute'],[2,4,4,3,4,4]],
    [912,'湧躍鴨','Quaxly',['水'],'quaxly',['bird','cute'],[4,3,3,3,4,3]],
    [921,'布撥','Pawmi',['電'],'pawmi',['rodent','electric','cute'],[3,4,4,3,4,4]],
    [936,'紅蓮鎧騎','Armarouge',['火','超能力'],'charcadet',['humanoid','fire','mystical'],[4,3,3,4,3,3]],
    [937,'蒼炎刃鬼','Ceruledge',['火','幽靈'],'charcadet',['humanoid','ghost','fire'],[4,2,3,4,3,3]],
    [957,'小鍛匠','Tinkatink',['妖精','鋼'],'tinkatink',['humanoid','machine','cute'],[4,3,4,4,3,3]],
    [778,'謎擬Q','Mimikyu',['幽靈','妖精'],'mimikyu',['ghost','cute','mystical'],[3,4,4,2,2,4]],
    [300,'向尾喵','Skitty',['一般'],'skitty',['feline','cute'],[2,4,3,2,4,4]],
    [334,'七夕青鳥','Altaria',['龍','飛行'],'swablu',['bird','dragon','gentle'],[3,4,4,2,3,4]],
    [447,'利歐路','Riolu',['格鬥'],'riolu',['canine','cute'],[3,4,4,4,4,4]],
    [197,'月亮伊布','Umbreon',['惡'],'eevee',['feline','mystical'],[4,3,4,3,2,4]],
    [371,'寶貝龍','Bagon',['龍'],'bagon',['dragon','reptile'],[2,3,3,4,4,3]],
    [744,'岩狗狗','Rockruff',['岩石'],'rockruff',['canine','cute'],[2,4,4,3,4,4]],
    [778,'謎擬Q','Mimikyu',['幽靈','妖精'],'mimikyu',['ghost','cute','mystical'],[3,4,4,2,2,4]],
    [1000,'賽富豪','Gholdengo',['鋼','幽靈'],'gholdengo',['machine','ghost','mystical'],[3,4,3,3,4,4]]
  ];

  const labelMap = {
    approach: '處事方式', social: '人際互動', values: '價值觀',
    challenge: '面對挑戰', lifestyle: '生活方式', companion: '理想夥伴特質'
  };

  window.TRAIT_DIMENSIONS = [
    { key: 'approach', label: '處事方式', hint: '分析、規劃、行動與探索' },
    { key: 'social', label: '人際互動', hint: '獨立、合作、帶領與支持' },
    { key: 'values', label: '價值觀', hint: '友情、信任、自由、關懷與成長' },
    { key: 'challenge', label: '面對挑戰', hint: '謹慎、冒險、堅持與突破' },
    { key: 'lifestyle', label: '生活方式', hint: '規律、活躍、安靜與變化' },
    { key: 'companion', label: '理想夥伴特質', hint: '守護、冒險、陪伴與支持' },
    { key: 'bio', label: '生物偏好', hint: '你喜歡的生物外型與原型' }
  ];

  window.BIO_CATEGORIES = [
    {key:'canine',label:'犬類／狐狸',emoji:'🐕'},
    {key:'feline',label:'貓科',emoji:'🐈'},
    {key:'bird',label:'鳥類',emoji:'🕊️'},
    {key:'aquatic',label:'水生生物',emoji:'🐟'},
    {key:'reptile',label:'爬蟲類',emoji:'🦎'},
    {key:'amphibian',label:'兩棲類',emoji:'🐸'},
    {key:'insect',label:'昆蟲',emoji:'🦋'},
    {key:'dragon',label:'龍類',emoji:'🐉'},
    {key:'plant',label:'植物系',emoji:'🌱'},
    {key:'ghost',label:'幽靈／神祕',emoji:'👻'},
    {key:'cute',label:'圓潤可愛型',emoji:'✨'},
    {key:'machine',label:'機械／礦物',emoji:'⚙️'},
    {key:'humanoid',label:'人形／格鬥型',emoji:'🧑'},
    {key:'rodent',label:'鼠類／小型哺乳類',emoji:'🐭'},
    {key:'mammal',label:'其他哺乳類',emoji:'🐾'},
    {key:'mystical',label:'幻想生物',emoji:'🔮'}
  ];

  window.POKEMON_DATA = rows.map(([id, nameZh, nameEn, types, family, bioTags, values]) => {
    const scores = {};
    traitKeys.forEach((key, i) => { scores[key] = values[i]; });
    return {
      id, nameZh, nameEn, types, family, bioTags, traitScores: scores,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      officialUrl: `https://tw.portal-pokemon.com/play/pokedex/${String(id).padStart(4, '0')}`,
      evidenceType: 'initial_model',
      evidenceNote: '初版配對特徵為系統整理的暫定標籤，不是官方人格判定；發布正式版本前應逐筆對照官方圖鑑及相關作品。',
      dataNote: '此候選資料為第一版示範資料，尚未覆蓋全國圖鑑所有物種。'
    };
  }).filter((pokemon, index, list) => list.findIndex(p => p.id === pokemon.id) === index);
})();
