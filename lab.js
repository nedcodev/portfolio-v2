/*=============== LAB: DEPARTURE BOARD WORLD CLOCK ===============*/
// A dot-matrix world clock in the NEDCODE yellow.
// - the board types itself in, row by row, like a real departure board
// - each row shows day/night and a +1 / -1 when that city is on another date
// - the visitor's own city lights up brighter, with a marker
// - 12H / 24H toggle and add / remove cities (remembered in the browser)
(() => {
  const root = document.getElementById('flapBoard');
  if (!root) return;

  /*---------- settings ----------*/
  const DEFAULT_CITIES = ['MONTREAL', 'LONDON', 'PARIS', 'DUBAI', 'TOKYO'];
  const MAX_CITIES = 8;
  const STORAGE_KEY = 'nedcode-lab-clock';

  // the typing sweep (timed to match the reference video: ~1.2s for a full board)
  const SWEEP_TICK_MS = 33; // every flickering character changes together, once per tick
  const SWEEP_LEAD = 6; // flickering characters that appear right away when a row starts
  const SWEEP_SETTLE_DELAY = 100; // the real text starts typing in this long after its row starts
  const SWEEP_ROW_DELAY = 100; // each row starts this much later than the one above

  // [ name as people write it, time zone, country, (optional) shorter name for the board ]
  // Board names are written in capitals without accents, 14 letters max.
  // When several cities share a time zone, the first one is used to label a visitor's own row.
  const CITY_DATA = [
    // ----- North America -----
    ['Montreal', 'America/Toronto', 'Canada'],
    ['Toronto', 'America/Toronto', 'Canada'],
    ['Ottawa', 'America/Toronto', 'Canada'],
    ['Vancouver', 'America/Vancouver', 'Canada'],
    ['Calgary', 'America/Edmonton', 'Canada'],
    ['Winnipeg', 'America/Winnipeg', 'Canada'],
    ['Halifax', 'America/Halifax', 'Canada'],
    ['Newfoundland', 'America/St_Johns', 'Canada'],
    ['New York', 'America/New_York', 'United States'],
    ['Washington DC', 'America/New_York', 'United States'],
    ['Miami', 'America/New_York', 'United States'],
    ['Chicago', 'America/Chicago', 'United States'],
    ['Denver', 'America/Denver', 'United States'],
    ['Phoenix', 'America/Phoenix', 'United States'],
    ['Los Angeles', 'America/Los_Angeles', 'United States'],
    ['San Francisco', 'America/Los_Angeles', 'United States'],
    ['Anchorage', 'America/Anchorage', 'United States'],
    ['Honolulu', 'Pacific/Honolulu', 'United States'],
    ['Mexico City', 'America/Mexico_City', 'Mexico'],
    ['Cancún', 'America/Cancun', 'Mexico'],
    ['Tijuana', 'America/Tijuana', 'Mexico'],
    // ----- Central America & Caribbean -----
    ['Guatemala City', 'America/Guatemala', 'Guatemala'],
    ['Belmopan', 'America/Belize', 'Belize'],
    ['San Salvador', 'America/El_Salvador', 'El Salvador'],
    ['Tegucigalpa', 'America/Tegucigalpa', 'Honduras'],
    ['Managua', 'America/Managua', 'Nicaragua'],
    ['San José', 'America/Costa_Rica', 'Costa Rica'],
    ['Panama City', 'America/Panama', 'Panama'],
    ['Havana', 'America/Havana', 'Cuba'],
    ['Kingston', 'America/Jamaica', 'Jamaica'],
    ['Port-au-Prince', 'America/Port-au-Prince', 'Haiti'],
    ['Santo Domingo', 'America/Santo_Domingo', 'Dominican Republic'],
    ['Nassau', 'America/Nassau', 'Bahamas'],
    ["St. John's", 'America/Antigua', 'Antigua and Barbuda'],
    ['Basseterre', 'America/St_Kitts', 'Saint Kitts and Nevis'],
    ['Roseau', 'America/Dominica', 'Dominica'],
    ['Castries', 'America/St_Lucia', 'Saint Lucia'],
    ['Kingstown', 'America/St_Vincent', 'Saint Vincent and the Grenadines'],
    ['Bridgetown', 'America/Barbados', 'Barbados'],
    ["St. George's", 'America/Grenada', 'Grenada'],
    ['Port of Spain', 'America/Port_of_Spain', 'Trinidad and Tobago'],
    // ----- South America -----
    ['Bogotá', 'America/Bogota', 'Colombia'],
    ['Caracas', 'America/Caracas', 'Venezuela'],
    ['Georgetown', 'America/Guyana', 'Guyana'],
    ['Paramaribo', 'America/Paramaribo', 'Suriname'],
    ['Quito', 'America/Guayaquil', 'Ecuador'],
    ['Lima', 'America/Lima', 'Peru'],
    ['La Paz', 'America/La_Paz', 'Bolivia'],
    ['São Paulo', 'America/Sao_Paulo', 'Brazil'],
    ['Brasília', 'America/Sao_Paulo', 'Brazil'],
    ['Manaus', 'America/Manaus', 'Brazil'],
    ['Asunción', 'America/Asuncion', 'Paraguay'],
    ['Montevideo', 'America/Montevideo', 'Uruguay'],
    ['Buenos Aires', 'America/Argentina/Buenos_Aires', 'Argentina'],
    ['Santiago', 'America/Santiago', 'Chile'],
    // ----- Europe -----
    ['London', 'Europe/London', 'United Kingdom'],
    ['Dublin', 'Europe/Dublin', 'Ireland'],
    ['Lisbon', 'Europe/Lisbon', 'Portugal'],
    ['Reykjavík', 'Atlantic/Reykjavik', 'Iceland'],
    ['Paris', 'Europe/Paris', 'France'],
    ['Madrid', 'Europe/Madrid', 'Spain'],
    ['Andorra la Vella', 'Europe/Andorra', 'Andorra', 'ANDORRA'],
    ['Monaco', 'Europe/Monaco', 'Monaco'],
    ['Brussels', 'Europe/Brussels', 'Belgium'],
    ['Amsterdam', 'Europe/Amsterdam', 'Netherlands'],
    ['Luxembourg', 'Europe/Luxembourg', 'Luxembourg'],
    ['Berlin', 'Europe/Berlin', 'Germany'],
    ['Bern', 'Europe/Zurich', 'Switzerland'],
    ['Vaduz', 'Europe/Vaduz', 'Liechtenstein'],
    ['Rome', 'Europe/Rome', 'Italy'],
    ['Vatican City', 'Europe/Vatican', 'Vatican City'],
    ['San Marino', 'Europe/San_Marino', 'San Marino'],
    ['Valletta', 'Europe/Malta', 'Malta'],
    ['Vienna', 'Europe/Vienna', 'Austria'],
    ['Prague', 'Europe/Prague', 'Czechia'],
    ['Bratislava', 'Europe/Bratislava', 'Slovakia'],
    ['Budapest', 'Europe/Budapest', 'Hungary'],
    ['Warsaw', 'Europe/Warsaw', 'Poland'],
    ['Copenhagen', 'Europe/Copenhagen', 'Denmark'],
    ['Oslo', 'Europe/Oslo', 'Norway'],
    ['Stockholm', 'Europe/Stockholm', 'Sweden'],
    ['Helsinki', 'Europe/Helsinki', 'Finland'],
    ['Tallinn', 'Europe/Tallinn', 'Estonia'],
    ['Riga', 'Europe/Riga', 'Latvia'],
    ['Vilnius', 'Europe/Vilnius', 'Lithuania'],
    ['Ljubljana', 'Europe/Ljubljana', 'Slovenia'],
    ['Zagreb', 'Europe/Zagreb', 'Croatia'],
    ['Sarajevo', 'Europe/Sarajevo', 'Bosnia and Herzegovina'],
    ['Belgrade', 'Europe/Belgrade', 'Serbia'],
    ['Podgorica', 'Europe/Podgorica', 'Montenegro'],
    ['Pristina', 'Europe/Belgrade', 'Kosovo'],
    ['Skopje', 'Europe/Skopje', 'North Macedonia'],
    ['Tirana', 'Europe/Tirane', 'Albania'],
    ['Athens', 'Europe/Athens', 'Greece'],
    ['Sofia', 'Europe/Sofia', 'Bulgaria'],
    ['Bucharest', 'Europe/Bucharest', 'Romania'],
    ['Chișinău', 'Europe/Chisinau', 'Moldova'],
    ['Kyiv', 'Europe/Kiev', 'Ukraine'],
    ['Minsk', 'Europe/Minsk', 'Belarus'],
    ['Moscow', 'Europe/Moscow', 'Russia'],
    ['Yekaterinburg', 'Asia/Yekaterinburg', 'Russia'],
    ['Novosibirsk', 'Asia/Novosibirsk', 'Russia'],
    ['Vladivostok', 'Asia/Vladivostok', 'Russia'],
    ['Istanbul', 'Europe/Istanbul', 'Turkey'],
    ['Nicosia', 'Asia/Nicosia', 'Cyprus'],
    // ----- Arab world -----
    ['Dubai', 'Asia/Dubai', 'United Arab Emirates'],
    ['Abu Dhabi', 'Asia/Dubai', 'United Arab Emirates'],
    ['Riyadh', 'Asia/Riyadh', 'Saudi Arabia'],
    ['Jeddah', 'Asia/Riyadh', 'Saudi Arabia'],
    ['Mecca', 'Asia/Riyadh', 'Saudi Arabia'],
    ['Doha', 'Asia/Qatar', 'Qatar'],
    ['Kuwait City', 'Asia/Kuwait', 'Kuwait'],
    ['Manama', 'Asia/Bahrain', 'Bahrain'],
    ['Muscat', 'Asia/Muscat', 'Oman'],
    ["Sana'a", 'Asia/Aden', 'Yemen'],
    ['Baghdad', 'Asia/Baghdad', 'Iraq'],
    ['Amman', 'Asia/Amman', 'Jordan'],
    ['Damascus', 'Asia/Damascus', 'Syria'],
    ['Beirut', 'Asia/Beirut', 'Lebanon'],
    ['Ramallah', 'Asia/Hebron', 'Palestine'],
    ['Cairo', 'Africa/Cairo', 'Egypt'],
    ['Alexandria', 'Africa/Cairo', 'Egypt'],
    ['Khartoum', 'Africa/Khartoum', 'Sudan'],
    ['Tripoli', 'Africa/Tripoli', 'Libya'],
    ['Tunis', 'Africa/Tunis', 'Tunisia'],
    ['Algiers', 'Africa/Algiers', 'Algeria'],
    ['Casablanca', 'Africa/Casablanca', 'Morocco'],
    ['Rabat', 'Africa/Casablanca', 'Morocco'],
    ['Marrakech', 'Africa/Casablanca', 'Morocco'],
    ['Nouakchott', 'Africa/Nouakchott', 'Mauritania'],
    ['Djibouti', 'Africa/Djibouti', 'Djibouti'],
    ['Mogadishu', 'Africa/Mogadishu', 'Somalia'],
    ['Moroni', 'Indian/Comoro', 'Comoros'],
    // ----- Rest of Middle East & Asia -----
    ['Tel Aviv', 'Asia/Jerusalem', 'Israel'],
    ['Tehran', 'Asia/Tehran', 'Iran'],
    ['Kabul', 'Asia/Kabul', 'Afghanistan'],
    ['Yerevan', 'Asia/Yerevan', 'Armenia'],
    ['Baku', 'Asia/Baku', 'Azerbaijan'],
    ['Tbilisi', 'Asia/Tbilisi', 'Georgia'],
    ['Karachi', 'Asia/Karachi', 'Pakistan'],
    ['Islamabad', 'Asia/Karachi', 'Pakistan'],
    ['Lahore', 'Asia/Karachi', 'Pakistan'],
    ['Mumbai', 'Asia/Kolkata', 'India'],
    ['New Delhi', 'Asia/Kolkata', 'India'],
    ['Bengaluru', 'Asia/Kolkata', 'India'],
    ['Kathmandu', 'Asia/Kathmandu', 'Nepal'],
    ['Thimphu', 'Asia/Thimphu', 'Bhutan'],
    ['Dhaka', 'Asia/Dhaka', 'Bangladesh'],
    ['Colombo', 'Asia/Colombo', 'Sri Lanka'],
    ['Malé', 'Indian/Maldives', 'Maldives'],
    ['Tashkent', 'Asia/Tashkent', 'Uzbekistan'],
    ['Almaty', 'Asia/Almaty', 'Kazakhstan'],
    ['Astana', 'Asia/Almaty', 'Kazakhstan'],
    ['Bishkek', 'Asia/Bishkek', 'Kyrgyzstan'],
    ['Dushanbe', 'Asia/Dushanbe', 'Tajikistan'],
    ['Ashgabat', 'Asia/Ashgabat', 'Turkmenistan'],
    ['Yangon', 'Asia/Yangon', 'Myanmar'],
    ['Bangkok', 'Asia/Bangkok', 'Thailand'],
    ['Vientiane', 'Asia/Vientiane', 'Laos'],
    ['Phnom Penh', 'Asia/Phnom_Penh', 'Cambodia'],
    ['Ho Chi Minh City', 'Asia/Ho_Chi_Minh', 'Vietnam', 'HO CHI MINH'],
    ['Hanoi', 'Asia/Ho_Chi_Minh', 'Vietnam'],
    ['Kuala Lumpur', 'Asia/Kuala_Lumpur', 'Malaysia'],
    ['Singapore', 'Asia/Singapore', 'Singapore'],
    ['Jakarta', 'Asia/Jakarta', 'Indonesia'],
    ['Bali', 'Asia/Makassar', 'Indonesia'],
    ['Jayapura', 'Asia/Jayapura', 'Indonesia'],
    ['Bandar Seri Begawan', 'Asia/Brunei', 'Brunei', 'BRUNEI'],
    ['Manila', 'Asia/Manila', 'Philippines'],
    ['Dili', 'Asia/Dili', 'Timor-Leste'],
    ['Shanghai', 'Asia/Shanghai', 'China'],
    ['Beijing', 'Asia/Shanghai', 'China'],
    ['Hong Kong', 'Asia/Hong_Kong', 'Hong Kong'],
    ['Taipei', 'Asia/Taipei', 'Taiwan'],
    ['Ulaanbaatar', 'Asia/Ulaanbaatar', 'Mongolia'],
    ['Seoul', 'Asia/Seoul', 'South Korea'],
    ['Pyongyang', 'Asia/Pyongyang', 'North Korea'],
    ['Tokyo', 'Asia/Tokyo', 'Japan'],
    ['Osaka', 'Asia/Tokyo', 'Japan'],
    // ----- Africa -----
    ['Lagos', 'Africa/Lagos', 'Nigeria'],
    ['Abuja', 'Africa/Lagos', 'Nigeria'],
    ['Accra', 'Africa/Accra', 'Ghana'],
    ['Abidjan', 'Africa/Abidjan', "Côte d'Ivoire"],
    ['Dakar', 'Africa/Dakar', 'Senegal'],
    ['Banjul', 'Africa/Banjul', 'Gambia'],
    ['Bissau', 'Africa/Bissau', 'Guinea-Bissau'],
    ['Conakry', 'Africa/Conakry', 'Guinea'],
    ['Freetown', 'Africa/Freetown', 'Sierra Leone'],
    ['Monrovia', 'Africa/Monrovia', 'Liberia'],
    ['Bamako', 'Africa/Bamako', 'Mali'],
    ['Ouagadougou', 'Africa/Ouagadougou', 'Burkina Faso'],
    ['Niamey', 'Africa/Niamey', 'Niger'],
    ['Lomé', 'Africa/Lome', 'Togo'],
    ['Porto-Novo', 'Africa/Porto-Novo', 'Benin'],
    ['Praia', 'Atlantic/Cape_Verde', 'Cabo Verde'],
    ["N'Djamena", 'Africa/Ndjamena', 'Chad'],
    ['Yaoundé', 'Africa/Douala', 'Cameroon'],
    ['Bangui', 'Africa/Bangui', 'Central African Republic'],
    ['Malabo', 'Africa/Malabo', 'Equatorial Guinea'],
    ['Libreville', 'Africa/Libreville', 'Gabon'],
    ['São Tomé', 'Africa/Sao_Tome', 'São Tomé and Príncipe'],
    ['Brazzaville', 'Africa/Brazzaville', 'Republic of the Congo'],
    ['Kinshasa', 'Africa/Kinshasa', 'DR Congo'],
    ['Luanda', 'Africa/Luanda', 'Angola'],
    ['Nairobi', 'Africa/Nairobi', 'Kenya'],
    ['Addis Ababa', 'Africa/Addis_Ababa', 'Ethiopia'],
    ['Asmara', 'Africa/Asmara', 'Eritrea'],
    ['Juba', 'Africa/Juba', 'South Sudan'],
    ['Kampala', 'Africa/Kampala', 'Uganda'],
    ['Kigali', 'Africa/Kigali', 'Rwanda'],
    ['Bujumbura', 'Africa/Bujumbura', 'Burundi'],
    ['Dar es Salaam', 'Africa/Dar_es_Salaam', 'Tanzania'],
    ['Lusaka', 'Africa/Lusaka', 'Zambia'],
    ['Lilongwe', 'Africa/Blantyre', 'Malawi'],
    ['Maputo', 'Africa/Maputo', 'Mozambique'],
    ['Harare', 'Africa/Harare', 'Zimbabwe'],
    ['Gaborone', 'Africa/Gaborone', 'Botswana'],
    ['Windhoek', 'Africa/Windhoek', 'Namibia'],
    ['Johannesburg', 'Africa/Johannesburg', 'South Africa'],
    ['Cape Town', 'Africa/Johannesburg', 'South Africa'],
    ['Maseru', 'Africa/Maseru', 'Lesotho'],
    ['Mbabane', 'Africa/Mbabane', 'Eswatini'],
    ['Antananarivo', 'Indian/Antananarivo', 'Madagascar'],
    ['Port Louis', 'Indian/Mauritius', 'Mauritius'],
    ['Victoria', 'Indian/Mahe', 'Seychelles'],
    // ----- Oceania -----
    ['Sydney', 'Australia/Sydney', 'Australia'],
    ['Canberra', 'Australia/Sydney', 'Australia'],
    ['Melbourne', 'Australia/Melbourne', 'Australia'],
    ['Brisbane', 'Australia/Brisbane', 'Australia'],
    ['Adelaide', 'Australia/Adelaide', 'Australia'],
    ['Darwin', 'Australia/Darwin', 'Australia'],
    ['Perth', 'Australia/Perth', 'Australia'],
    ['Auckland', 'Pacific/Auckland', 'New Zealand'],
    ['Wellington', 'Pacific/Auckland', 'New Zealand'],
    ['Suva', 'Pacific/Fiji', 'Fiji'],
    ['Port Moresby', 'Pacific/Port_Moresby', 'Papua New Guinea'],
    ['Honiara', 'Pacific/Guadalcanal', 'Solomon Islands'],
    ['Port Vila', 'Pacific/Efate', 'Vanuatu'],
    ["Nuku'alofa", 'Pacific/Tongatapu', 'Tonga'],
    ['Apia', 'Pacific/Apia', 'Samoa'],
    ['Funafuti', 'Pacific/Funafuti', 'Tuvalu'],
    ['Tarawa', 'Pacific/Tarawa', 'Kiribati'],
    ['Majuro', 'Pacific/Majuro', 'Marshall Islands'],
    ['Palikir', 'Pacific/Pohnpei', 'Micronesia'],
    ['Ngerulmud', 'Pacific/Palau', 'Palau'],
    ['Yaren', 'Pacific/Nauru', 'Nauru'],
  ];

  // "São Paulo" -> "SAO PAULO", "Port-au-Prince" -> "PORT AU PRINCE"
  function toBoard(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['’.,]/g, '')
      .replace(/-/g, ' ')
      .toUpperCase()
      .replace(/[^A-Z ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Board name -> { label, zone, country }
  const CITIES = {};
  CITY_DATA.forEach(([label, zone, country, short]) => {
    CITIES[short || toBoard(label)] = { label, zone, country };
  });

  /*---------- 5 x 7 dot font ----------*/
  const SUN = 'sun';
  const MOON = 'moon';
  const MARK = 'mark';
  const FONT = {
    ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
    0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
    3: ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
    4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
    5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    6: ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
    7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
    8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    9: ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
    ':': ['.....', '..#..', '..#..', '.....', '..#..', '..#..', '.....'],
    '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
    '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
    A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    D: ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'],
    E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
    F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
    G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
    H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
    K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
    L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
    N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
    O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
    Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
    R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
    X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
    Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
    [SUN]: ['..#..', '#...#', '.###.', '.###.', '.###.', '#...#', '..#..'],
    [MOON]: ['..##.', '.##..', '###..', '###..', '###..', '.##..', '..##.'],
    [MARK]: ['#....', '##...', '###..', '####.', '###..', '##...', '#....'],
  };
  const DIGITS = '0123456789';
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const MIXED = DIGITS + LETTERS;

  /*---------- elements ----------*/
  const screen = root.querySelector('.flap-screen');
  const canvas = root.querySelector('.flap-canvas');
  const ctx = canvas.getContext('2d');
  const removeLayer = root.querySelector('.flap-remove-layer');
  const srList = root.querySelector('.flap-sr');
  const formatButtons = root.querySelectorAll('[data-format]');
  const addButton = root.querySelector('.flap-add');
  const picker = root.querySelector('.flap-picker');
  const pickerInput = picker.querySelector('input');
  const pickerList = picker.querySelector('.flap-picker-list');
  const pickerNote = picker.querySelector('.flap-picker-note');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /*---------- time zone helpers ----------*/
  const formatters = {};
  // Local date and time in a zone, or null if this browser doesn't know the zone.
  function partsIn(zone, date) {
    if (!(zone in formatters)) {
      try {
        formatters[zone] = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          hourCycle: 'h23',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (e) {
        formatters[zone] = null; // unknown in this browser: the city is skipped
      }
    }
    if (!formatters[zone]) return null;
    const out = {};
    formatters[zone].formatToParts(date).forEach((p) => {
      out[p.type] = p.value;
    });
    return {
      day: Date.UTC(+out.year, +out.month - 1, +out.day),
      hour: +out.hour % 24, // some browsers write midnight as "24"
      minute: +out.minute,
    };
  }

  // Two names for the same zone (e.g. Asia/Kolkata vs Asia/Calcutta) compare equal.
  const canonicalCache = {};
  function canonical(zone) {
    if (!zone) return null;
    if (!(zone in canonicalCache)) {
      let id = zone;
      try {
        id = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
        }).resolvedOptions().timeZone;
      } catch (e) {}
      if (id === 'America/Montreal') id = 'America/Toronto';
      canonicalCache[zone] = id;
    }
    return canonicalCache[zone];
  }

  let visitorZone = null;
  try {
    visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch (e) {}
  const visitorCanon = canonical(visitorZone);

  // "SAN FRANCISCO" -> "San Francisco" (only used for names we build ourselves)
  function pretty(name) {
    return name.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // The visitor's own row, when their city isn't on the board.
  function visitorCity() {
    const known = Object.keys(CITIES).find(
      (n) => canonical(CITIES[n].zone) === visitorCanon,
    );
    if (known) return { name: known, label: CITIES[known].label };
    const last = toBoard(
      (visitorZone || '').split('/').pop().replace(/_/g, ' '),
    )
      .slice(0, 14)
      .trim();
    const name =
      last.length >= 3 && !/^(UTC|GMT|ETC)/.test(last) ? last : 'YOUR TIME';
    return { name, label: pretty(name) };
  }

  /*---------- saved settings ----------*/
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const cities = (
        saved && Array.isArray(saved.cities) ? saved.cities : []
      ).filter((n, i, arr) => CITIES[n] && arr.indexOf(n) === i);
      return {
        cities: cities.length
          ? cities.slice(0, MAX_CITIES)
          : DEFAULT_CITIES.slice(),
        hour12: !!(saved && saved.hour12),
      };
    } catch (e) {
      return { cities: DEFAULT_CITIES.slice(), hour12: false };
    }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }
  const settings = load();

  /*---------- what each row should say ----------*/
  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }
  function timeText(hour, minute) {
    if (!settings.hour12) return pad(hour) + ':' + pad(minute); // "14:28"
    const h = hour % 12 || 12;
    return (
      (h < 10 ? ' ' : '') + h + ':' + pad(minute) + (hour < 12 ? ' AM' : ' PM')
    ); // " 2:28 PM"
  }

  function buildRows(now) {
    const here = partsIn(visitorZone || 'UTC', now) || partsIn('UTC', now);
    const list = settings.cities.map((name) => ({
      name,
      label: CITIES[name].label,
      zone: CITIES[name].zone,
      auto: false,
    }));
    const youIndex = visitorCanon
      ? list.findIndex((c) => canonical(c.zone) === visitorCanon)
      : -1;
    if (visitorCanon && youIndex === -1) {
      const v = visitorCity();
      list.unshift({
        name: v.name,
        label: v.label,
        zone: visitorZone,
        auto: true,
      });
    }
    const youAt = youIndex === -1 ? (visitorCanon ? 0 : -1) : youIndex;

    const result = [];
    list.forEach((c, i) => {
      const t = partsIn(c.zone, now);
      if (!t) return; // this browser doesn't know the zone
      result.push({
        key: c.auto ? '@you' : c.name,
        name: c.name,
        label: c.label,
        auto: c.auto,
        you: i === youAt,
        day: t.hour >= 6 && t.hour < 18,
        dayDiff: Math.round((t.day - here.day) / 86400000),
        time: timeText(t.hour, t.minute),
      });
    });
    return result;
  }

  /*---------- layout (in "dot" units) ----------*/
  const CELL = 6; // 5 dots + 1 space
  const GAP = 3; // blank space between fields
  const ROW = 10; // 7 dots + 3 space
  let rows = [];
  let layout = []; // per row: list of cells {x, field, index, char, grid}
  let unitsWide = 0;
  let pitch = 4;
  let dpr = 1;

  function cityWidth() {
    return Math.max(10, ...rows.map((r) => r.name.length));
  }

  function rowFields(r, cw) {
    const time = r.time.padStart(settings.hour12 ? 8 : 5, ' ');
    const city = r.name.padEnd(cw, ' ');
    const off = r.dayDiff
      ? (r.dayDiff > 0 ? '+' : '-') + Math.min(9, Math.abs(r.dayDiff))
      : '  ';
    return [
      { field: 'mark', text: [r.you ? MARK : ' '], grid: false },
      { gap: true },
      { field: 'time', text: time.split(''), grid: true },
      { gap: true },
      { field: 'city', text: city.split(''), grid: true },
      { gap: true },
      { field: 'icon', text: [r.day ? SUN : MOON], grid: true },
      { field: 'off', text: off.split(''), grid: true },
    ];
  }

  function buildLayout() {
    const cw = cityWidth();
    layout = rows.map((r) => {
      let x = 0;
      const cells = [];
      rowFields(r, cw).forEach((f) => {
        if (f.gap) {
          x += GAP;
          return;
        }
        f.text.forEach((ch, index) => {
          cells.push({ x, field: f.field, index, char: ch, grid: f.grid });
          x += CELL;
        });
      });
      return cells;
    });
    unitsWide = layout.length
      ? Math.max(...layout.map((cells) => cells[cells.length - 1].x + 5))
      : 0;
  }

  /*---------- animation 1: the typing sweep ----------*/
  // Each row types itself in from the left. Ahead of the finished text runs a
  // short band of flickering characters; past the band the cells are still dark.
  let sweep = null; // { start, delays: Map(rowKey -> ms), end }

  // (it plays for everyone, also with "reduce motion" on: it's short and only
  // runs when the board appears or changes, like the board in the reference video)
  function startSweep(onlyKey) {
    const delays = new Map();
    let order = 0;
    rows.forEach((r) => {
      if (onlyKey && r.key !== onlyKey) return;
      delays.set(r.key, order++ * SWEEP_ROW_DELAY);
    });
    if (!delays.size) return;
    let end = 0;
    layout.forEach((cells, i) => {
      const d = delays.get(rows[i].key);
      if (d !== undefined)
        end = Math.max(
          end,
          d + SWEEP_SETTLE_DELAY + cells.length * SWEEP_TICK_MS,
        );
    });
    const start = performance.now();
    sweep = { start, delays, end: start + end }; // end is a moment in time, not a duration
    noiseTick = -1;
    // rows being swept land straight on their final text afterwards
    layout.forEach((cells, i) => {
      if (!delays.has(rows[i].key)) return;
      cells.forEach((cell) => {
        shown.set(rows[i].key + '|' + cell.field + '|' + cell.index, {
          char: cell.char,
          target: cell.char,
          until: 0,
        });
      });
    });
  }

  // The flickering characters, re-picked all together once per tick
  const noise = new Map();
  let noiseTick = -1;

  // What a cell shows right now during the sweep (undefined = not sweeping)
  function sweepChar(rowKey, cell, position, now) {
    if (!sweep) return undefined;
    const delay = sweep.delays.get(rowKey);
    if (delay === undefined) return undefined;
    const t = now - sweep.start - delay;
    if (t < 0) return ' '; // this row hasn't started yet
    const typed =
      t < SWEEP_SETTLE_DELAY
        ? 0
        : Math.floor((t - SWEEP_SETTLE_DELAY) / SWEEP_TICK_MS);
    const front = SWEEP_LEAD + Math.floor(t / SWEEP_TICK_MS); // the band grows out from the left
    if (position < typed) return cell.char; // already typed
    if (position < front) {
      if (cell.field === 'mark') return ' ';
      const id = rowKey + '|' + position;
      if (!noise.has(id))
        noise.set(id, MIXED[(Math.random() * MIXED.length) | 0]);
      return noise.get(id);
    }
    return ' '; // not reached yet
  }

  /*---------- animation 2: digits flicker when the minute changes ----------*/
  // What is currently shown in every cell, so only changed characters flicker.
  const shown = new Map(); // "rowKey|field|index" -> { char, target, until }
  function animate(rowKey, cell) {
    const id = rowKey + '|' + cell.field + '|' + cell.index;
    const prev = shown.get(id);
    if (prev && prev.target === cell.char) return;
    const canFlicker = prev && (cell.field === 'time' || cell.field === 'city');
    if (
      !canFlicker ||
      reduceMotion.matches ||
      cell.char === ' ' ||
      cell.char === ':'
    ) {
      shown.set(id, { char: cell.char, target: cell.char, until: 0 });
      return;
    }
    shown.set(id, {
      char: randomFor(cell),
      target: cell.char,
      until: performance.now() + 260 + Math.random() * 220,
    });
  }
  function randomFor(cell) {
    const pool = cell.field === 'time' ? DIGITS : LETTERS;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function applyTargets() {
    layout.forEach((cells, r) => {
      cells.forEach((cell) => animate(rows[r].key, cell));
    });
  }
  function flickering() {
    let busy = false;
    shown.forEach((s) => {
      if (s.until) {
        busy = true;
        s.char = /[0-9]/.test(s.target)
          ? DIGITS[(Math.random() * 10) | 0]
          : LETTERS[(Math.random() * 26) | 0];
      }
    });
    return busy;
  }

  /*---------- drawing ----------*/
  let sprites = null;
  let background = null; // the unlit dot grid, drawn once per resize

  function brandYellow() {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--fifteenth-color')
      .trim();
    return v || '#ffdc16';
  }

  function makeSprite(radius, core, glowAlpha, glowSize) {
    const size = Math.ceil(radius * glowSize * 2 * dpr) + 2;
    const s = document.createElement('canvas');
    s.width = s.height = size;
    const g = s.getContext('2d');
    const c = size / 2;
    if (glowAlpha > 0) {
      const grad = g.createRadialGradient(
        c,
        c,
        radius * dpr * 0.6,
        c,
        c,
        size / 2,
      );
      grad.addColorStop(0, hexToRgba(core, glowAlpha));
      grad.addColorStop(1, hexToRgba(core, 0));
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
    }
    g.fillStyle = core;
    g.beginPath();
    g.arc(c, c, radius * dpr, 0, Math.PI * 2);
    g.fill();
    return s;
  }
  function hexToRgba(color, a) {
    const m = color.replace('#', '');
    const full =
      m.length === 3
        ? m
            .split('')
            .map((x) => x + x)
            .join('')
        : m;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return `rgba(255,220,22,${a})`;
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  let lastSize = '';
  function resize() {
    const available =
      screen.clientWidth -
      parseFloat(getComputedStyle(screen).paddingRight || 0);
    if (!available || !unitsWide) return;
    // nothing about the size or shape changed: skip the expensive rebuild
    const size = [
      available,
      unitsWide,
      rows.length,
      settings.hour12,
      window.devicePixelRatio,
    ].join('|');
    if (size === lastSize && background) {
      placeRemoveButtons();
      draw();
      return;
    }
    lastSize = size;
    const sizingUnits = unitsWide + (settings.hour12 ? 0 : 3 * CELL);
    pitch = Math.min(4, available / sizingUnits);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = unitsWide * pitch;
    const h = (rows.length * ROW - 3) * pitch;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const r = pitch * 0.38;
    const yellow = brandYellow();
    sprites = {
      lit: makeSprite(r, yellow, 0.22, 2.2),
      you: makeSprite(r * 1.05, yellow, 0.42, 2.6),
      dim: makeSprite(r, hexToRgba(yellow, 0.7), 0.12, 2),
    };

    background = document.createElement('canvas');
    background.width = canvas.width;
    background.height = canvas.height;
    const b = background.getContext('2d');
    const dot = r * 0.85 * dpr;
    b.fillStyle = 'rgba(255,255,255,0.075)';
    b.beginPath(); // all unlit dots in one pass (much faster on slow phones)
    layout.forEach((cells, row) => {
      cells.forEach((cell) => {
        if (!cell.grid) return;
        for (let y = 0; y < 7; y++) {
          for (let x = 0; x < 5; x++) {
            const cx = (cell.x + x + 0.5) * pitch * dpr;
            const cy = (row * ROW + y + 0.5) * pitch * dpr;
            b.moveTo(cx + dot, cy);
            b.arc(cx, cy, dot, 0, Math.PI * 2);
          }
        }
      });
    });
    b.fill();
    placeRemoveButtons();
    draw();
  }

  function draw() {
    if (!sprites) return;
    const now = performance.now();
    if (sweep) {
      const tick = Math.floor((now - sweep.start) / SWEEP_TICK_MS);
      if (tick !== noiseTick) {
        noiseTick = tick;
        noise.clear();
      }
    }
    const colonOn = reduceMotion.matches || Date.now() % 1000 < 500;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);

    layout.forEach((cells, row) => {
      const r = rows[row];
      cells.forEach((cell, position) => {
        let ch = sweepChar(r.key, cell, position, now);
        if (ch === undefined) {
          const state = shown.get(r.key + '|' + cell.field + '|' + cell.index);
          ch = state ? state.char : cell.char;
          if (state && state.until && now >= state.until) {
            state.char = state.target;
            state.until = 0;
            ch = state.char;
          }
        }
        const glyph = FONT[ch];
        if (!glyph || ch === ' ') return;
        let sprite = r.you ? sprites.you : sprites.lit;
        if (ch === ':' && !colonOn) sprite = sprites.dim;
        if ((cell.field === 'off' || cell.field === 'icon') && !r.you)
          sprite = sprites.dim;
        const half = sprite.width / 2;
        for (let y = 0; y < 7; y++) {
          const line = glyph[y];
          for (let x = 0; x < 5; x++) {
            if (line[x] !== '#') continue;
            ctx.drawImage(
              sprite,
              Math.round((cell.x + x + 0.5) * pitch * dpr - half),
              Math.round((row * ROW + y + 0.5) * pitch * dpr - half),
            );
          }
        }
      });
    });
  }

  /*---------- screen reader text ----------*/
  function updateScreenReaderText() {
    srList.innerHTML = '';
    rows.forEach((r) => {
      const li = document.createElement('li');
      const extra = [];
      if (r.dayDiff > 0) extra.push('tomorrow');
      if (r.dayDiff < 0) extra.push('yesterday');
      extra.push(r.day ? 'daytime' : 'night');
      if (r.you) extra.push('your time zone');
      li.textContent = `${r.label}: ${r.time.trim()} (${extra.join(', ')})`;
      srList.appendChild(li);
    });
  }

  /*---------- remove buttons (one per row, shown on hover) ----------*/
  function placeRemoveButtons() {
    removeLayer.innerHTML = '';
    const canRemove = settings.cities.length > 1;
    rows.forEach((r, i) => {
      // the visitor's own city always shows, so it never gets a remove button
      if (r.auto || r.you || !canRemove) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flap-remove';
      btn.dataset.row = String(i);
      btn.setAttribute('aria-label', `Remove ${r.label}`);
      btn.innerHTML = '&times;';
      btn.style.top = canvas.offsetTop + (i * ROW + 3.5) * pitch + 'px';
      btn.style.left = canvas.offsetLeft + unitsWide * pitch + 6 + 'px';
      btn.addEventListener('click', () => removeCity(r.name));
      removeLayer.appendChild(btn);
    });
  }

  screen.addEventListener('mousemove', (e) => {
    const box = canvas.getBoundingClientRect();
    const row = Math.floor((e.clientY - box.top) / (ROW * pitch));
    removeLayer.querySelectorAll('.flap-remove').forEach((b) => {
      b.classList.toggle('is-shown', Number(b.dataset.row) === row);
    });
  });
  screen.addEventListener('mouseleave', () => {
    removeLayer
      .querySelectorAll('.flap-remove')
      .forEach((b) => b.classList.remove('is-shown'));
  });

  /*---------- updating ----------*/
  let lastMinute = -1;
  // sweepWhat: 'all' = whole board types in, a row key = only that row, null = no sweep
  function refresh(sweepWhat) {
    rows = buildRows(new Date());
    buildLayout();
    applyTargets();
    if (sweepWhat) startSweep(sweepWhat === 'all' ? null : sweepWhat);
    resize();
    updateScreenReaderText();
    lastMinute = Math.floor(Date.now() / 60000);
    kick();
  }

  let timer = null;
  function tick() {
    if (Math.floor(Date.now() / 60000) !== lastMinute) {
      const before = layout.length + ':' + unitsWide;
      rows = buildRows(new Date());
      buildLayout();
      applyTargets();
      if (before !== layout.length + ':' + unitsWide) resize();
      updateScreenReaderText();
      lastMinute = Math.floor(Date.now() / 60000);
    }
    if (sweep && performance.now() > sweep.end) sweep = null;
    const busy = flickering() || !!sweep;
    draw();
    timer = setTimeout(
      tick,
      busy ? SWEEP_TICK_MS : 500 - (Date.now() % 500) + 5,
    );
  }
  function kick() {
    clearTimeout(timer);
    timer = setTimeout(tick, 0);
  }

  /*---------- controls: 12H / 24H ----------*/
  function showFormat() {
    formatButtons.forEach((b) => {
      b.setAttribute(
        'aria-pressed',
        String((b.dataset.format === '12') === settings.hour12),
      );
    });
  }
  formatButtons.forEach((b) => {
    b.addEventListener('click', () => {
      const wants12 = b.dataset.format === '12';
      if (wants12 === settings.hour12) return;
      settings.hour12 = wants12;
      save();
      showFormat();
      refresh('all');
    });
  });

  /*---------- controls: add / remove cities ----------*/
  function removeCity(name) {
    if (settings.cities.length <= 1) return;
    settings.cities = settings.cities.filter((n) => n !== name);
    save();
    refresh(null);
    addButton.focus();
  }

  function addCity(name) {
    if (
      !CITIES[name] ||
      settings.cities.includes(name) ||
      settings.cities.length >= MAX_CITIES
    )
      return;
    settings.cities.push(name);
    save();
    closePicker();
    refresh(name);
  }

  // accents and capitals don't matter when searching ("sao" finds São Paulo)
  function fold(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  const PICKER_ORDER = Object.keys(CITIES).sort((a, b) =>
    CITIES[a].label.localeCompare(CITIES[b].label, 'en'),
  );

  function renderPicker() {
    const full = settings.cities.length >= MAX_CITIES;
    pickerInput.hidden = full;
    pickerList.innerHTML = '';
    if (full) {
      pickerNote.hidden = false;
      pickerNote.textContent = `The board is full (${MAX_CITIES} cities). Remove one first.`;
      return;
    }
    const q = fold(pickerInput.value.trim());
    const now = new Date();
    let count = 0;
    PICKER_ORDER.forEach((name) => {
      const city = CITIES[name];
      if (settings.cities.includes(name)) return;
      if (q && !fold(city.label).includes(q) && !fold(city.country).includes(q))
        return;
      const t = partsIn(city.zone, now);
      if (!t) return;
      count++;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      const label = document.createElement('span');
      label.className = 'flap-picker-name';
      label.textContent = city.label;
      if (fold(city.country) !== fold(city.label)) {
        const country = document.createElement('span');
        country.className = 'flap-picker-country';
        country.textContent = city.country;
        label.appendChild(country);
      }
      const time = document.createElement('span');
      time.className = 'flap-picker-time';
      time.textContent = timeText(t.hour, t.minute).trim();
      btn.append(label, time);
      btn.addEventListener('click', () => addCity(name));
      li.appendChild(btn);
      pickerList.appendChild(li);
    });
    pickerNote.hidden = count > 0;
    pickerNote.textContent = 'No city found.';
  }

  function openPicker() {
    picker.hidden = false;
    addButton.setAttribute('aria-expanded', 'true');
    pickerInput.value = '';
    renderPicker();
    if (!pickerInput.hidden) pickerInput.focus();
  }
  function closePicker() {
    picker.hidden = true;
    addButton.setAttribute('aria-expanded', 'false');
  }

  addButton.addEventListener('click', () =>
    picker.hidden ? openPicker() : closePicker(),
  );
  pickerInput.addEventListener('input', renderPicker);
  pickerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = pickerList.querySelector('button');
      if (first) first.click();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !picker.hidden) {
      closePicker();
      addButton.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!picker.hidden && !picker.contains(e.target) && e.target !== addButton)
      closePicker();
  });

  /*---------- start ----------*/
  showFormat();
  refresh('all');
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => resize()).observe(screen);
  } else {
    window.addEventListener('resize', resize);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') kick();
  });
})();
