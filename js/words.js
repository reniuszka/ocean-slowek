// Baza wyrazów: [poprawnie, błędnie, poziom trudności 1-3, kategoria, podpowiedź (opcjonalnie)]
// Poziom 1 → 7–9 lat, 2 → 10–12 lat, 3 → 13–16 lat (starsze grupy dostają też łatwiejsze wyrazy).

export const CATEGORIES = {
  o_u: {
    label: 'ó / u',
    short: '„ó” lub „u”',
    rule: '„ó” piszemy, gdy wymienia się na o, e lub a (stół – stoły) oraz w końcówkach -ów, -ówka, -ówna.',
  },
  rz_z: {
    label: 'rz / ż',
    short: '„rz” lub „ż”',
    rule: '„rz” piszemy po spółgłoskach b, p, d, t, g, k, ch, j, w i gdy wymienia się na r. „ż” – gdy wymienia się na g, h, z, s.',
  },
  ch_h: {
    label: 'ch / h',
    short: '„ch” lub „h”',
    rule: '„ch” piszemy na końcu wyrazu i gdy wymienia się na sz. „h” – gdy wymienia się na g, z, ż.',
  },
  ae: {
    label: 'ą / ę',
    short: '„ą” lub „ę”',
    rule: 'Nosówki „ą” i „ę” piszemy, choć słyszymy „om”, „on”, „en” – sprawdzaj w innej formie wyrazu.',
  },
  nie: {
    label: '„nie” z…',
    short: 'pisownia „nie”',
    rule: '„Nie” z czasownikami piszemy osobno, a z przymiotnikami w stopniu równym i rzeczownikami – razem.',
  },
  razem: {
    label: 'razem / osobno',
    short: 'razem czy osobno',
    rule: 'Wyrażenia przyimkowe (w ogóle, na pewno, z powrotem) piszemy osobno – trzeba je zapamiętać.',
  },
  czeste: {
    label: 'częste błędy',
    short: 'częste błędy',
    rule: 'To wyrazy, w których najczęściej popełniamy błędy – warto je zapamiętać!',
  },
};

const RAW = [
  // ó / u
  ['łódź', 'łudź', 1, 'o_u', 'łódź – łodzie'],
  ['stół', 'stuł', 1, 'o_u', 'stół – stoły'],
  ['mróz', 'mruz', 1, 'o_u', 'mróz – mrozy'],
  ['ogród', 'ogrud', 1, 'o_u', 'ogród – ogrody'],
  ['sól', 'sul', 1, 'o_u', 'sól – solić'],
  ['wóz', 'wuz', 1, 'o_u', 'wóz – wozy'],
  ['dół', 'duł', 1, 'o_u', 'dół – doły'],
  ['ból', 'bul', 1, 'o_u', 'ból – boleć'],
  ['kółko', 'kułko', 1, 'o_u', 'kółko – koło'],
  ['góra', 'gura', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['król', 'krul', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['królik', 'krulik', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['córka', 'curka', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['róża', 'ruża', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['pióro', 'piuro', 1, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['zupa', 'zópa', 1, 'o_u'],
  ['koszula', 'koszóla', 1, 'o_u', 'Końcówka -ula zawsze przez „u”.'],
  ['chmura', 'chmóra', 1, 'o_u'],
  ['ulica', 'ólica', 1, 'o_u', 'Na początku wyrazu piszemy „u”.'],
  ['uczeń', 'óczeń', 1, 'o_u', 'Na początku wyrazu piszemy „u”.'],
  ['mucha', 'mócha', 1, 'o_u'],
  ['butelka', 'bótelka', 1, 'o_u'],
  ['cukierek', 'cókierek', 1, 'o_u'],
  ['ołówek', 'ołuwek', 2, 'o_u', 'Końcówka -ówek przez „ó”.'],
  ['pszczółka', 'pszczułka', 2, 'o_u', 'pszczółka – pszczoła'],
  ['żółw', 'żułw', 2, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['bób', 'bub', 2, 'o_u', 'bób – bobu'],
  ['ósemka', 'usemka', 2, 'o_u', 'ósemka – osiem'],
  ['wiewiórka', 'wiewiurka', 2, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['jaskółka', 'jaskułka', 2, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['ogórek', 'ogurek', 2, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['skóra', 'skura', 2, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['burza', 'bórza', 2, 'o_u'],
  ['skuter', 'skóter', 2, 'o_u'],
  ['kogut', 'kogót', 2, 'o_u', 'Końcówka -ut przez „u”.'],
  ['kaptur', 'kaptór', 2, 'o_u', 'Końcówka -ur przez „u”.'],
  ['pomidor', 'pomidór', 2, 'o_u', 'pomidor – bez „ó”!'],
  ['chór', 'chur', 3, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['źródło', 'źrudło', 3, 'o_u', 'Ten wyraz trzeba zapamiętać.'],
  ['żuraw', 'żóraw', 3, 'o_u'],

  // rz / ż
  ['rzeka', 'żeka', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['drzewo', 'dżewo', 1, 'rz_z', 'Po „d” piszemy „rz”.'],
  ['talerz', 'tależ', 1, 'rz_z', 'Końcówka -erz przez „rz”.'],
  ['lekarz', 'lekaż', 1, 'rz_z', 'Końcówka -arz przez „rz”.'],
  ['żaba', 'rzaba', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['żyrafa', 'rzyrafa', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['plaża', 'plarza', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['jeż', 'jerz', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['nóż', 'nórz', 1, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['rzodkiewka', 'żodkiewka', 2, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['kalendarz', 'kalendaż', 2, 'rz_z', 'Końcówka -arz przez „rz”.'],
  ['pisarz', 'pisaż', 2, 'rz_z', 'Końcówka -arz przez „rz”.'],
  ['orzech', 'ożech', 2, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['krzesło', 'kszesło', 2, 'rz_z', 'Po „k” piszemy „rz”.'],
  ['przyjaciel', 'pszyjaciel', 2, 'rz_z', 'Po „p” piszemy „rz”.'],
  ['grzyb', 'gżyb', 2, 'rz_z', 'Po „g” piszemy „rz”.'],
  ['dworzec', 'dwożec', 2, 'rz_z', 'dworzec – dwór (rz → r)'],
  ['żółty', 'rzółty', 2, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['książka', 'ksiąrzka', 2, 'rz_z', 'książka – księga (ż → g)'],
  ['łyżka', 'łyrzka', 2, 'rz_z', 'Ten wyraz trzeba zapamiętać.'],
  ['dobrze', 'dobże', 3, 'rz_z', 'dobrze – dobry (rz → r)'],
  ['mierzyć', 'mieżyć', 3, 'rz_z', 'mierzyć – miara (rz → r)'],
  ['parzyć', 'pażyć', 3, 'rz_z', 'parzyć – para (rz → r)'],
  ['bliżej', 'blirzej', 3, 'rz_z', 'bliżej – blisko (ż → s)'],
  ['niżej', 'nirzej', 3, 'rz_z', 'niżej – nisko (ż → s)'],
  ['drożej', 'drorzej', 3, 'rz_z', 'drożej – drogo (ż → g)'],

  // ch / h
  ['chleb', 'hleb', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['chomik', 'homik', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['choinka', 'hoinka', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['ucho', 'uho', 1, 'ch_h', 'ucho – uszy (ch → sz)'],
  ['dach', 'dah', 1, 'ch_h', 'Na końcu wyrazu piszemy „ch”.'],
  ['ruch', 'ruh', 1, 'ch_h', 'Na końcu wyrazu piszemy „ch”.'],
  ['chusteczka', 'husteczka', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['herbata', 'cherbata', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['hulajnoga', 'chulajnoga', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['hipopotam', 'chipopotam', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['huśtawka', 'chuśtawka', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['hokej', 'chokej', 1, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['hamak', 'chamak', 2, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['harcerz', 'charcerz', 2, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['historia', 'chistoria', 2, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['hałas', 'chałas', 2, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['bohater', 'bochater', 3, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['druh', 'druch', 3, 'ch_h', 'druh – drużyna (h → ż)'],
  ['chrząszcz', 'hrząszcz', 3, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],
  ['wataha', 'watacha', 3, 'ch_h', 'Ten wyraz trzeba zapamiętać.'],

  // ą / ę
  ['ręka', 'renka', 1, 'ae', 'ręka – ręce'],
  ['ząb', 'zomb', 1, 'ae', 'ząb – zęby'],
  ['dąb', 'domb', 1, 'ae', 'dąb – dęby'],
  ['wąż', 'wonż', 1, 'ae', 'wąż – węże'],
  ['proszę', 'prosze', 1, 'ae', 'Pamiętaj o ogonku w „ę”!'],
  ['zając', 'zajonc', 2, 'ae', 'Ten wyraz trzeba zapamiętać.'],
  ['mądry', 'mondry', 2, 'ae', 'mądry – mędrzec'],
  ['pięć', 'pieńć', 2, 'ae', 'Ten wyraz trzeba zapamiętać.'],
  ['kąpiel', 'kompiel', 2, 'ae', 'Ten wyraz trzeba zapamiętać.'],
  ['księżyc', 'ksienżyc', 2, 'ae', 'Ten wyraz trzeba zapamiętać.'],
  ['wziąć', 'wziąść', 3, 'ae', 'wziąć – wezmę (nie ma tu „ś”!)'],
  ['włączać', 'włanczać', 3, 'ae', 'włączać – włącznik'],

  // nie
  ['nie wiem', 'niewiem', 1, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['nie lubię', 'nielubię', 1, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['nie mam', 'niemam', 1, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['nie chcę', 'niechcę', 1, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['niedźwiedź', 'nie dźwiedź', 1, 'nie', 'To jeden wyraz – razem!'],
  ['nie umiem', 'nieumiem', 2, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['nie było', 'niebyło', 2, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['nie pójdę', 'niepójdę', 2, 'nie', '„Nie” z czasownikiem – osobno.'],
  ['niemiły', 'nie miły', 2, 'nie', '„Nie” z przymiotnikiem w stopniu równym – razem.'],
  ['nieładny', 'nie ładny', 2, 'nie', '„Nie” z przymiotnikiem w stopniu równym – razem.'],
  ['nie lepszy', 'nielepszy', 3, 'nie', '„Nie” ze stopniem wyższym – osobno.'],
  ['nie najlepszy', 'nienajlepszy', 3, 'nie', '„Nie” ze stopniem najwyższym – osobno.'],
  ['nienawidzić', 'nie nawidzić', 3, 'nie', 'Wyjątek! Ten czasownik piszemy razem.'],

  // razem / osobno
  ['do widzenia', 'dowidzenia', 1, 'razem', 'Piszemy osobno.'],
  ['po polsku', 'popolsku', 1, 'razem', 'Piszemy osobno.'],
  ['w ogóle', 'wogóle', 2, 'razem', 'Piszemy osobno.'],
  ['na pewno', 'napewno', 2, 'razem', 'Piszemy osobno.'],
  ['na razie', 'narazie', 2, 'razem', 'Piszemy osobno.'],
  ['od razu', 'odrazu', 2, 'razem', 'Piszemy osobno.'],
  ['po prostu', 'poprostu', 2, 'razem', 'Piszemy osobno.'],
  ['w końcu', 'wkońcu', 2, 'razem', 'Piszemy osobno.'],
  ['na dworze', 'nadworze', 2, 'razem', 'Piszemy osobno.'],
  ['naprawdę', 'na prawdę', 3, 'razem', 'Piszemy razem!'],
  ['naprzeciwko', 'na przeciwko', 3, 'razem', 'Piszemy razem!'],
  ['z powrotem', 'spowrotem', 3, 'razem', 'Piszemy osobno i przez „z”.'],
  ['na zewnątrz', 'nazewnątrz', 3, 'razem', 'Piszemy osobno.'],
  ['przede wszystkim', 'przedewszystkim', 3, 'razem', 'Piszemy osobno.'],

  // częste błędy
  ['rozumiem', 'rozumię', 2, 'czeste', 'rozumiem – rozumiesz'],
  ['poszedłem', 'poszłem', 3, 'czeste', 'Poprawnie: poszedłem, poszłam.'],
  ['wszedłem', 'weszłem', 3, 'czeste', 'Poprawnie: wszedłem, weszłam.'],
  ['w cudzysłowie', 'w cudzysłowiu', 3, 'czeste', 'Ten wyraz trzeba zapamiętać.'],
];

// Ikonka obok wyrazu (klucz = poprawna pisownia). Ta sama ikonka pojawia się przy obu wersjach,
// więc podpowiada znaczenie, ale nie zdradza, która pisownia jest dobra. Brak wpisu = brak ikonki
// (lepiej brak ikonki niż myląca – np. nie ma emoji stołu, rzodkiewki ani huśtawki).
const ICONS = {
  // ó / u
  łódź: '🛶', mróz: '🥶', ogród: '🏡', sól: '🧂', dół: '🕳️', ból: '🤕', kółko: '⭕',
  góra: '⛰️', król: '🤴', królik: '🐰', córka: '👧', róża: '🌹', pióro: '🪶', zupa: '🍲', koszula: '👔',
  chmura: '☁️', ulica: '🚦', uczeń: '🎒', mucha: '🪰', butelka: '🍼', cukierek: '🍬', ołówek: '✏️',
  pszczółka: '🐝', żółw: '🐢', bób: '🫘', ósemka: '8️⃣', wiewiórka: '🐿️', jaskółka: '🐦', ogórek: '🥒',
  burza: '⛈️', skuter: '🛵', kogut: '🐓', kaptur: '🧥', pomidor: '🍅', chór: '🎤',
  źródło: '💧', żuraw: '🏗️',
  // rz / ż
  rzeka: '🏞️', drzewo: '🌳', talerz: '🍽️', lekarz: '🧑‍⚕️', żaba: '🐸', żyrafa: '🦒', plaża: '🏖️', jeż: '🦔',
  nóż: '🔪', kalendarz: '📅', pisarz: '✍️', orzech: '🥜', krzesło: '🪑', przyjaciel: '🤝',
  grzyb: '🍄', dworzec: '🚉', żółty: '🟡', książka: '📖', łyżka: '🥄', dobrze: '👍', mierzyć: '📏',
  parzyć: '☕', niżej: '⬇️', drożej: '📈',
  // ch / h
  chleb: '🍞', chomik: '🐹', choinka: '🎄', ucho: '👂', dach: '🏠', ruch: '🏃', chusteczka: '🤧',
  herbata: '🍵', hulajnoga: '🛴', hipopotam: '🦛', hokej: '🏒', harcerz: '⛺',
  historia: '📜', hałas: '📢', bohater: '🦸', druh: '⛺', chrząszcz: '🪲', wataha: '🐺',
  // ą / ę
  ręka: '✋', ząb: '🦷', dąb: '🌳', wąż: '🐍', proszę: '🙏', zając: '🐇', mądry: '🦉', pięć: '5️⃣',
  kąpiel: '🛁', księżyc: '🌙', wziąć: '🤲', włączać: '💡',
  // nie
  'nie wiem': '🤷', 'nie lubię': '👎', 'nie chcę': '🙅', niedźwiedź: '🐻', 'nie umiem': '😕',
  'nie pójdę': '🚫', niemiły: '😠', 'nie najlepszy': '🥈', nienawidzić: '😡',
  // razem / osobno
  'do widzenia': '👋', 'po polsku': '🗣️', 'na pewno': '✅', 'od razu': '⚡',
  'po prostu': '👌', 'w końcu': '🏁', 'na dworze': '🌤️', naprawdę: '💯', 'z powrotem': '🔙',
  'na zewnątrz': '🚪', 'przede wszystkim': '🥇',
  // częste błędy
  rozumiem: '💡', poszedłem: '🚶', wszedłem: '🚪', 'w cudzysłowie': '💬',
};

export const WORD_PAIRS = RAW.map(([good, bad, diff, cat, hint]) => ({ good, bad, diff, cat, hint, icon: ICONS[good] || '' }));

export const AGE_GROUPS = {
  '7-9': { label: '7–9 lat', maxDiff: 1, fallTime: 10.5, spawnEvery: 3.8 },
  '10-12': { label: '10–12 lat', maxDiff: 2, fallTime: 8.5, spawnEvery: 3.1 },
  '13-16': { label: '13–16 lat', maxDiff: 3, fallTime: 7, spawnEvery: 2.6 },
};
