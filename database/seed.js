const {
  sequelize,
  Role,
  User,
  Destination,
  Category,
  Tour,
  TourSchedule,
  TourImage,
  Review,
  Contact,
  Setting,
  Itinerary,
  Theme,
  Guide,
  SignatureExperience,
  CustomerStory
} = require('../models');

async function seedDatabase() {
  try {
    console.log('🔄 Syncing Database Tables with new Tranoi Travel Schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables synced successfully.');

    // 1. Roles
    console.log('🌱 Seeding Roles...');
    const adminRole = await Role.create({ name: 'admin', description: 'System Administrator' });
    const userRole = await Role.create({ name: 'customer', description: 'Registered Customer' });

    // 2. Users
    console.log('🌱 Seeding Users...');
    const adminUser = await User.create({
      roleId: adminRole.id,
      name: 'Tranoi Concierge Team',
      email: 'admin@wanderlust.com',
      password: 'admin123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '+84 24 3999 8888',
      address: 'Tranoi Travel HQ, Ba Dinh, Hanoi, Vietnam',
      bio: 'Lead Travel Director and Curator at Tranoi Travel with over 15 years crafting tailored Vietnam journeys.'
    });

    const demoUser = await User.create({
      roleId: userRole.id,
      name: 'Sarah Jenkins',
      email: 'customer@wanderlust.com',
      password: 'user123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      phone: '+1 415-555-0144',
      address: 'San Francisco, CA, USA',
      bio: 'Passionate traveler, food lover, and recent guest on our 10-Day Vietnam Highlights tour.'
    });

    // 3. Categories (Themes & Travel Styles)
    console.log('🌱 Seeding Categories...');
    const catPrivate = await Category.create({
      name: 'Private Tours',
      slug: 'private-tours',
      icon: 'bi bi-person-check-fill',
      description: 'Fully customized, chauffeured private travel with dedicated local guides at every step.'
    });
    const catPartial = await Category.create({
      name: 'Partial-Guided Tours',
      slug: 'partial-guided-tours',
      icon: 'bi bi-compass-fill',
      description: 'The smart balance: guided for complex cultural highlights, free-paced leisure time for yourself.'
    });
    const catHighlights = await Category.create({
      name: 'Classic Highlights',
      slug: 'classic-highlights',
      icon: 'bi bi-star-fill',
      description: 'Iconic UNESCO heritage sites, bustling street markets, and picturesque bays.'
    });
    const catSlowTravel = await Category.create({
      name: 'In-Depth Discovery',
      slug: 'in-depth-discovery',
      icon: 'bi bi-geo-alt-fill',
      description: 'Long-duration, slow-paced journeys immersing you in deep local culture.'
    });

    // 4. Destinations (All 17 Vietnam destinations per Sitemap Section 3)
    console.log('🌱 Seeding Vietnam Destinations...');

    // P0 Destinations (Nav dropdown featured)
    const destHanoi = await Destination.create({
      name: 'Hanoi',
      slug: 'hanoi',
      country: 'Vietnam',
      region: 'north',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'The thousand-year-old capital where French colonial architecture meets vibrant guild streets, steaming pho stalls, and peaceful lakes.',
      banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Old Quarter 36 Guild Streets', 'Hoan Kiem Lake & Ngoc Son Temple', 'Temple of Literature', 'French Quarter & Opera House', 'Train Street Cafes']),
      bestTimeNote: 'October to April offers mild, dry, and sunny days ideal for walking and street food exploration.',
      gettingThere: 'Noi Bai International Airport (HAN) connects directly to global hubs. 35 minutes by private transfer to city center.',
      travelGuide: 'Hanoi rewards slow exploration on foot. Sip egg coffee in hidden courtyard cafes, sample Bun Cha at midday, and wander tranquil tree-lined boulevards.',
      weatherInfo: JSON.stringify({ avgTemp: '17°C - 30°C', coolSeason: 'Nov - Feb', warmSeason: 'May - Sep' }),
      relatedDestinations: JSON.stringify(['ha-long-bay', 'ninh-binh', 'sapa']),
      metaTitle: 'Hanoi Travel Guide & Tours | Tranoi Travel',
      metaDescription: 'Explore historic Hanoi with curated private and partial-guided itineraries by Tranoi Travel.'
    });

    const destHaLong = await Destination.create({
      name: 'Ha Long Bay',
      slug: 'ha-long-bay',
      country: 'Vietnam',
      region: 'north',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'A UNESCO World Heritage spectacle of nearly 2,000 towering limestone karst pillars rising above emerald Gulf waters.',
      banner: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Sung Sot Cave', 'Ti Top Island Panoramic Lookout', 'Kayaking in Luon Lagoon', 'Overnight Luxury Wooden Junk Cruise']),
      bestTimeNote: 'March to May and September to November offer clear blue skies and calm cruising waters.',
      gettingThere: '2.5 hours east of Hanoi via modern expressway in our chauffeured private limousine van.',
      travelGuide: 'We handpick boutique overnight vessels that cruise away from crowded lanes into serene Lan Ha Bay and Bai Tu Long Bay.',
      weatherInfo: JSON.stringify({ avgTemp: '19°C - 32°C', dryCruising: 'Oct - Dec', summerBay: 'May - Aug' }),
      relatedDestinations: JSON.stringify(['hanoi', 'ninh-binh', 'phong-nha']),
      metaTitle: 'Ha Long Bay Luxury Cruises & Tours | Tranoi Travel',
      metaDescription: 'Experience serene overnight cruises in Ha Long and Lan Ha Bay with Tranoi Travel.'
    });

    const destHue = await Destination.create({
      name: 'Hue',
      slug: 'hue',
      country: 'Vietnam',
      region: 'central',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'The poetic imperial capital of the Nguyen Dynasty, steeped in royal palaces, ornate royal tombs, and refined court cuisine.',
      banner: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Imperial City & Forbidden Purple City', 'Thien Mu Pagoda on Perfume River', 'Tomb of Emperor Tu Duc', 'Dong Ba Market']),
      bestTimeNote: 'January to April provides pleasant temperatures and minimal rainfall for palace walking.',
      gettingThere: 'Phu Bai Airport (HUI) or scenic 2.5-hour private coastal drive from Da Nang over the Hai Van Pass.',
      travelGuide: 'Hue is the culinary capital of central Vietnam. Enjoy a private dinner in a historic garden house restored by royal descendants.',
      weatherInfo: JSON.stringify({ avgTemp: '20°C - 33°C', bestDry: 'Feb - Apr', rainSeason: 'Sep - Dec' }),
      relatedDestinations: JSON.stringify(['hoi-an', 'da-nang', 'phong-nha']),
      metaTitle: 'Hue Imperial City Tours & Heritage | Tranoi Travel',
      metaDescription: 'Discover royal palaces, garden houses, and Perfume River cruises in Hue with Tranoi Travel.'
    });

    const destHoiAn = await Destination.create({
      name: 'Hoi An',
      slug: 'hoi-an',
      country: 'Vietnam',
      region: 'central',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'A romantic riverside merchant port lined with yellow shophouses, silk lanterns, bespoke tailors, and peaceful cycling trails.',
      banner: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Ancient Town Pedestrian Streets', 'Japanese Covered Bridge', 'Thu Bon River Lantern Release', 'Tra Que Organic Herb Village', 'An Bang Beach']),
      bestTimeNote: 'February to July is dry, sunny, and ideal for cycling and beach afternoons.',
      gettingThere: '45-minute scenic private transfer south from Da Nang International Airport (DAD).',
      travelGuide: 'Rent a bicycle to meander past water buffaloes and emerald paddies, or take our signature market-to-table cooking class.',
      weatherInfo: JSON.stringify({ avgTemp: '22°C - 34°C', drySeason: 'Feb - Jul', rainySeason: 'Sep - Nov' }),
      relatedDestinations: JSON.stringify(['da-nang', 'hue', 'quy-nhon']),
      metaTitle: 'Hoi An Ancient Town Tours & Stays | Tranoi Travel',
      metaDescription: 'Wander lantern-lit alleys and cycle organic villages in Hoi An with Tranoi Travel curated trips.'
    });

    const destDaNang = await Destination.create({
      name: 'Da Nang',
      slug: 'da-nang',
      country: 'Vietnam',
      region: 'central',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'A dynamic coastal city renowned for pristine golden beaches, the Marble Mountains, Dragon Bridge, and gateway to heritage sites.',
      banner: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['My Khe Beach', 'Marble Mountains & Cave Temples', 'Son Tra Monkey Mountain Peninsula', 'Dragon Bridge Fire Show']),
      bestTimeNote: 'March to August brings blue skies and calm waves for seaside relaxation.',
      gettingThere: 'Da Nang International Airport (DAD) has direct links to Singapore, Seoul, Tokyo, and Bangkok.',
      travelGuide: 'Da Nang blends urban beach resorts with easy access to both the Ba Na hills and neighboring Hoi An.',
      weatherInfo: JSON.stringify({ avgTemp: '24°C - 35°C', dryBeach: 'Mar - Aug', rainSeason: 'Sep - Nov' }),
      relatedDestinations: JSON.stringify(['hoi-an', 'hue', 'quy-nhon']),
      metaTitle: 'Da Nang Coastal Travel Guide & Tours | Tranoi Travel',
      metaDescription: 'Explore seaside Da Nang, Marble Mountains, and coastal dining with Tranoi Travel.'
    });

    const destHCMC = await Destination.create({
      name: 'Ho Chi Minh City',
      slug: 'ho-chi-minh-city',
      country: 'Vietnam',
      region: 'south',
      priority: 'P0',
      navFeatured: true,
      isPopular: true,
      description: 'Vietnam’s energetic economic heart, buzzing with rooftop speakeasies, historic French landmarks, lively alleys, and culinary flair.',
      banner: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Notre Dame Cathedral & Central Post Office', 'War Remnants Museum', 'Cu Chi Underground Tunnels', 'Ben Thanh & Cholon Chinatown', 'Saigon River Sunset Cruise']),
      bestTimeNote: 'December to April is the dry season with sunny days and pleasant evening breezes.',
      gettingThere: 'Tan Son Nhat International Airport (SGN) is Vietnam’s busiest international gateway.',
      travelGuide: 'Experience the city by vintage Vespa at dusk, sampling hidden street snacks and craft cocktails down buzzing local lanes.',
      weatherInfo: JSON.stringify({ avgTemp: '26°C - 35°C', drySeason: 'Dec - Apr', greenSeason: 'May - Nov' }),
      relatedDestinations: JSON.stringify(['mekong-delta', 'phu-quoc', 'con-dao']),
      metaTitle: 'Ho Chi Minh City Tours & Highlights | Tranoi Travel',
      metaDescription: 'Discover vibrant Saigon, Cu Chi tunnels, and rooftop dining with Tranoi Travel.'
    });

    // P1 Destinations
    const destNinhBinh = await Destination.create({
      name: 'Ninh Binh',
      slug: 'ninh-binh',
      country: 'Vietnam',
      region: 'north',
      priority: 'P1',
      navFeatured: false,
      isPopular: true,
      description: 'Known as "Ha Long Bay on land", featuring dramatic limestone towers rising from emerald rice paddies and winding river caves.',
      banner: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Trang An UNESCO Boat Caves', 'Tam Coc River Drift', 'Mua Cave Peak Viewpoint', 'Hoa Lu Ancient Capital']),
      bestTimeNote: 'April to June for golden ripening rice paddies along the riverbanks.',
      gettingThere: '90-minute private chauffeured transfer south of Hanoi.',
      travelGuide: 'Take a hand-rowed sampan through mystical grottoes and climb 500 stone steps at Mua Peak for breathtaking vistas.',
      weatherInfo: JSON.stringify({ avgTemp: '18°C - 31°C' }),
      relatedDestinations: JSON.stringify(['hanoi', 'ha-long-bay', 'pu-luong']),
      metaTitle: 'Ninh Binh Travel Guide & Day Tours | Tranoi Travel',
      metaDescription: 'Cruise Trang An caves and view Tam Coc rice fields in Ninh Binh with Tranoi Travel.'
    });

    const destSapa = await Destination.create({
      name: 'Sapa',
      slug: 'sapa',
      country: 'Vietnam',
      region: 'north',
      priority: 'P1',
      navFeatured: false,
      isPopular: true,
      description: 'Misty mountain town framed by the Hoang Lien Son range, dramatic terraced rice amphitheatres, and colourful hill tribe villages.',
      banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Muong Hoa Valley Terraces', 'Fansipan Peak Cable Car', 'Ta Van & Cat Cat Villages', 'Bac Ha Sunday Ethnic Market']),
      bestTimeNote: 'March to May for crisp trekking weather and blooming mountain wildflowers.',
      gettingThere: 'Luxury overnight sleeper train or private limousine van via the Hanoi-Lao Cai expressway.',
      travelGuide: 'Stay at an eco-lodge perched high above the clouds overlooking plunging valley views and Black Hmong settlements.',
      weatherInfo: JSON.stringify({ avgTemp: '10°C - 24°C', mountainCrisp: 'Year-round' }),
      relatedDestinations: JSON.stringify(['hanoi', 'ha-giang', 'pu-luong']),
      metaTitle: 'Sapa Mountain Trekking & Hill Tribes | Tranoi Travel',
      metaDescription: 'Hike terraced valleys and meet ethnic artisan communities in Sapa with Tranoi Travel.'
    });

    const destNhaTrang = await Destination.create({
      name: 'Nha Trang',
      slug: 'nha-trang',
      country: 'Vietnam',
      region: 'central',
      priority: 'P1',
      navFeatured: false,
      isPopular: false,
      description: 'Vietnam’s premier bay town with turquoise diving waters, coral islands, offshore reefs, and mineral mud baths.',
      banner: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Po Nagar Cham Towers', 'Mun Island Marine Sanctuary', 'Hon Tam Mud Baths', 'Long Son White Buddha']),
      bestTimeNote: 'January to August enjoys sunny, dry coastal weather with calm seas.',
      gettingThere: 'Cam Ranh International Airport (CXR), 30 minutes south of Nha Trang town.',
      travelGuide: 'Perfect for travelers wanting luxury beachfront resorts, yacht charters, and snorkeling.',
      weatherInfo: JSON.stringify({ avgTemp: '25°C - 33°C' }),
      relatedDestinations: JSON.stringify(['quy-nhon', 'da-lat', 'ho-chi-minh-city']),
      metaTitle: 'Nha Trang Beach Getaway & Coral Reefs | Tranoi Travel',
      metaDescription: 'Relax on tropical beaches and snorkel protected coral reefs in Nha Trang with Tranoi Travel.'
    });

    const destPhuQuoc = await Destination.create({
      name: 'Phu Quoc',
      slug: 'phu-quoc',
      country: 'Vietnam',
      region: 'south',
      priority: 'P1',
      navFeatured: false,
      isPopular: true,
      description: 'Tropical paradise island in the Gulf of Thailand, famed for white sand beaches, untouched national parks, and fiery ocean sunsets.',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Sao Beach & Starfish Beach', 'An Thoi Archipelago Speedboat Tour', 'Sunset Town Cable Car', 'Night Squid Fishing']),
      bestTimeNote: 'November to April is the dry season with turquoise calm water and clear sunny days.',
      gettingThere: 'Direct 50-minute domestic flight from Ho Chi Minh City or 2-hour flight from Hanoi.',
      travelGuide: 'Unwind at private beachfront boutique villas at the conclusion of your cross-country Vietnam journey.',
      weatherInfo: JSON.stringify({ avgTemp: '25°C - 32°C', drySeason: 'Nov - Apr' }),
      relatedDestinations: JSON.stringify(['ho-chi-minh-city', 'con-dao', 'mekong-delta']),
      metaTitle: 'Phu Quoc Island Beach Holidays | Tranoi Travel',
      metaDescription: 'End your Vietnam trip with pristine tropical beaches in Phu Quoc curated by Tranoi Travel.'
    });

    const destMekong = await Destination.create({
      name: 'Mekong Delta',
      slug: 'mekong-delta',
      country: 'Vietnam',
      region: 'south',
      priority: 'P1',
      navFeatured: false,
      isPopular: true,
      description: 'The fertile "Rice Bowl of Vietnam", a maze of serpentine waterways, floating markets, lush fruit orchards, and friendly riverbank hamlets.',
      banner: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Cai Rang Floating Market in Can Tho', 'Ben Tre Coconut Island Canals', 'Tra Su Cajuput Forest Sanctuary', 'Riverside Homestay Cooking']),
      bestTimeNote: 'September to December brings the high-water floating season with vibrant market activity.',
      gettingThere: '2-hour private chauffeured transfer south from Ho Chi Minh City.',
      travelGuide: 'Board wooden sampans shaded by nipa palms, cycle orchard pathways, and taste warm honey tea with local farming families.',
      weatherInfo: JSON.stringify({ avgTemp: '26°C - 33°C', riverLife: 'Year-round' }),
      relatedDestinations: JSON.stringify(['ho-chi-minh-city', 'phu-quoc']),
      metaTitle: 'Mekong Delta River Tours & Cruises | Tranoi Travel',
      metaDescription: 'Cruise palm-shaded canals and floating markets in the Mekong Delta with Tranoi Travel.'
    });

    // P2 Destinations
    const destConDao = await Destination.create({
      name: 'Con Dao',
      slug: 'con-dao',
      country: 'Vietnam',
      region: 'south',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'An untouched archipelago of 16 mountainous islands with secluded beaches, sea turtle nesting grounds, and serene luxury retreats.',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Dam Trau Beach', 'Bay Canh Island Turtle Sanctuary', 'Con Dao National Park Hikes', 'Historic French Colonial Prison']),
      bestTimeNote: 'March to September offers calm seas ideal for diving, snorkeling, and turtle nesting.',
      gettingThere: '45-minute flight from Ho Chi Minh City or Can Tho.',
      travelGuide: 'The ultimate exclusive hideaway for travelers seeking peace and raw natural beauty.',
      weatherInfo: JSON.stringify({ avgTemp: '25°C - 31°C' }),
      relatedDestinations: JSON.stringify(['ho-chi-minh-city', 'phu-quoc']),
      metaTitle: 'Con Dao Islands Hideaways & Diving | Tranoi Travel',
      metaDescription: 'Explore untouched marine reserves and peaceful beaches on Con Dao with Tranoi Travel.'
    });

    const destPhongNha = await Destination.create({
      name: 'Phong Nha',
      slug: 'phong-nha',
      country: 'Vietnam',
      region: 'central',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'The subterranean kingdom of the world, housing some of the largest, oldest, and most spectacular karst cave systems on Earth.',
      banner: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Paradise Cave (Thien Duong)', 'Phong Nha River Cave', 'Dark Cave Ziplining & Kayaking', 'Son Doong Expeditions']),
      bestTimeNote: 'February to August when water levels in the caves are calm and accessible.',
      gettingThere: '1-hour flight to Dong Hoi Airport from Hanoi or Ho Chi Minh City, followed by a 45-minute private drive.',
      travelGuide: 'A paradise for active adventurers, nature lovers, and subterranean explorers.',
      weatherInfo: JSON.stringify({ avgTemp: '19°C - 32°C' }),
      relatedDestinations: JSON.stringify(['hue', 'ninh-binh', 'hanoi']),
      metaTitle: 'Phong Nha Cave Expeditions | Tranoi Travel',
      metaDescription: 'Venture inside world-famous limestone caverns in Phong Nha with Tranoi Travel.'
    });

    const destPuLuong = await Destination.create({
      name: 'Pu Luong',
      slug: 'pu-luong',
      country: 'Vietnam',
      region: 'north',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'A tranquil nature reserve of tiered valley rice fields, giant bamboo waterwheels, and traditional Thai stilt house villages.',
      banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Kho Muong Bat Cave', 'Giant Bamboo Waterwheels of Chieng Lau', 'Don Village Homestay Trails', 'Hieu Waterfall']),
      bestTimeNote: 'May to June and September to October for golden rice harvesting views.',
      gettingThere: '4 hours southwest of Hanoi by private transfer.',
      travelGuide: 'An idyllic escape from modern noise with authentic village hospitality.',
      weatherInfo: JSON.stringify({ avgTemp: '16°C - 28°C' }),
      relatedDestinations: JSON.stringify(['hanoi', 'ninh-binh', 'sapa']),
      metaTitle: 'Pu Luong Nature Reserve Trails | Tranoi Travel',
      metaDescription: 'Discover peaceful rice valleys and ethnic Thai villages in Pu Luong with Tranoi Travel.'
    });

    const destHaGiang = await Destination.create({
      name: 'Ha Giang',
      slug: 'ha-giang',
      country: 'Vietnam',
      region: 'north',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'Vietnam’s final frontier of towering serrated limestone canyons, the breathtaking Ma Pi Leng Pass, and deep ethnic traditions.',
      banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Ma Pi Leng Sky Pass', 'Nho Que Emerald River Boat Ride', 'Dong Van Karst Plateau Geopark', 'Hmong King Palace']),
      bestTimeNote: 'October to December for buckwheat flower season and cool, crisp mountain air.',
      gettingThere: '6-hour private chauffeured mountain drive north from Hanoi.',
      travelGuide: 'One of the most visually jaw-dropping mountain drives in all of Southeast Asia.',
      weatherInfo: JSON.stringify({ avgTemp: '12°C - 25°C' }),
      relatedDestinations: JSON.stringify(['hanoi', 'sapa']),
      metaTitle: 'Ha Giang Karst Plateau & Pass Tours | Tranoi Travel',
      metaDescription: 'Experience Vietnam’s dramatic northern mountains and ethnic heritage in Ha Giang with Tranoi Travel.'
    });

    const destQuyNhon = await Destination.create({
      name: 'Quy Nhon',
      slug: 'quy-nhon',
      country: 'Vietnam',
      region: 'central',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'An uncrowded coastal gem with turquoise bays, secluded sandy coves, ancient red-brick Cham towers, and fresh seafood.',
      banner: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Ky Co Island Beach', 'Eo Gio Windy Cliff Walkway', 'Twin Cham Towers', 'Ghenh Rang Seaside Rocks']),
      bestTimeNote: 'March to September for calm seas and sunshine.',
      gettingThere: 'Direct 1-hour flights from Hanoi and Ho Chi Minh City to Phu Cat Airport.',
      travelGuide: 'A peaceful, genuine alternative to busier beach destinations with pristine waters.',
      weatherInfo: JSON.stringify({ avgTemp: '24°C - 33°C' }),
      relatedDestinations: JSON.stringify(['hoi-an', 'da-nang', 'nha-trang']),
      metaTitle: 'Quy Nhon Coastal Retreats | Tranoi Travel',
      metaDescription: 'Discover hidden coastal bays and Cham heritage in Quy Nhon with Tranoi Travel.'
    });

    const destDaLat = await Destination.create({
      name: 'Da Lat',
      slug: 'da-lat',
      country: 'Vietnam',
      region: 'central',
      priority: 'P2',
      navFeatured: false,
      isPopular: false,
      description: 'The City of Eternal Spring in the Central Highlands, blessed with cool pine forests, French alpine villas, coffee estates, and waterfalls.',
      banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80']),
      attractions: JSON.stringify(['Tuyen Lam Lake & Pine Trails', 'Arabica High-Altitude Coffee Plantations', 'Bao Dai Summer Palace', 'Elephant & Datanla Falls']),
      bestTimeNote: 'November to March for blooming cherry blossoms, hydrangeas, and crisp sunny afternoons.',
      gettingThere: 'Lien Khuong Airport (DLI) or 3-hour mountain drive from Nha Trang.',
      travelGuide: 'Indulge in artisanal Vietnamese coffee tastings, organic wine, and refreshing mountain walks.',
      weatherInfo: JSON.stringify({ avgTemp: '14°C - 24°C', springClimate: 'Year-round' }),
      relatedDestinations: JSON.stringify(['nha-trang', 'ho-chi-minh-city', 'hoi-an']),
      metaTitle: 'Da Lat Highland Escapes & Coffee Tours | Tranoi Travel',
      metaDescription: 'Breathe pine-scented mountain air and tour coffee farms in Da Lat with Tranoi Travel.'
    });

    // 5. Seed Tours (4 core launch seed tours per Sitemap Section 5)
    console.log('🌱 Seeding Launch Seed Tours...');

    const tour7Days = await Tour.create({
      destinationId: destHanoi.id,
      categoryId: catPrivate.id,
      name: '7-Day North Vietnam Highlights - Private & Partial-Guided Tour',
      slug: '7-days-north-vietnam-private',
      metaTitle: '7-Day North Vietnam Highlights Private & Partial-Guided Tour',
      metaDescription: 'Experience Hanoi Old Quarter, Ninh Binh river karsts, and a luxury overnight Ha Long Bay cruise in 7 unforgettable days.',
      featuredImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'The essential northern circuit — old streets, limestone caves, a night on Ha Long Bay.',
      fullDescription: 'Crafted specifically for travelers with a week to spare who desire an authentic, unhurried northern journey. You will explore Hanoi with an insider foodie guide, cruise the tranquil water grottoes of Ninh Binh, and spend 24 magical hours gliding between the emerald karst towers of Ha Long Bay.',
      formats: JSON.stringify(['private', 'partial-guided']),
      region: 'north',
      theme: JSON.stringify(['highlights', 'family', 'culinary', 'eco-tours']),
      sourceMarket: JSON.stringify(['vietnam-tours-from-usa', 'vietnam-tours-from-australia']),
      pace: 'Moderate',
      groupSize: 'Private: 2 to 8 guests | Partial-guided: small group max 12',
      duration: '7 Days / 6 Nights',
      durationDays: 7,
      departureLocation: 'Noi Bai International Airport (HAN), Hanoi',
      transportation: 'Private chauffeured AC vehicle & luxury boutique cruise ship',
      schedule: 'Daily Departures Guaranteed',
      price: 1250.00,
      pricePrivate: 1450.00,
      pricePartialGuided: 890.00,
      discountPrice: 890.00,
      availableSlots: 12,
      meetingPoint: 'Noi Bai Airport Arrival Gate or any downtown Hanoi hotel lobby',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096996632488!2d105.852367!3d21.028511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      routeMapPoints: JSON.stringify([
        { name: 'Hanoi', lat: 21.0285, lng: 105.8542, description: 'Capital city arrival, Old Quarter guilds and street food' },
        { name: 'Ninh Binh', lat: 20.2506, lng: 105.9745, description: 'Trang An river caves and Mua mountain viewpoint' },
        { name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, description: 'Limestone bay luxury overnight cruise and kayaking' }
      ]),
      highlights: JSON.stringify([
        'Curated insider street food walk through secret alleys of Hanoi Old Quarter',
        'Traditional hand-rowed sampan cruise through Trang An UNESCO limestone caves',
        'Overnight boutique cruise in Ha Long & Lan Ha Bay with balcony staterooms',
        'Sunset cocktails and morning sunrise Tai Chi on the bay sundeck',
        'Private airport transfers and seamless intercity travel throughout'
      ]),
      includedPrivate: JSON.stringify([
        '6 nights handpicked 4 to 5-star boutique accommodation and luxury cruise stateroom',
        'Private dedicated English-speaking local insider guide throughout all sightseeing days',
        'Private modern air-conditioned vehicle with dedicated driver for all journeys',
        'All entrance fees, rowing sampans, and Ha Long Bay permits included',
        'Daily breakfasts, 4 lunches, and 2 special dinners including cruise banquet',
        '24/7 dedicated Tranoi Travel personal on-call concierge team'
      ]),
      includedPartialGuided: JSON.stringify([
        '6 nights handpicked 4 to 5-star boutique accommodation and luxury cruise stateroom',
        'Local expert guides during complex key cultural visits: Hanoi Old Quarter and Trang An Caves',
        'Self-paced leisure windows for personal discoveries, cafe hopping, and relaxing',
        'Pre-arranged seamless transfers between Hanoi, Ninh Binh, and Ha Long Bay',
        'Shared luxury boutique cruise experience in Ha Long Bay with full activities onboard',
        'Daily breakfasts and all meals served on the Ha Long Bay cruise',
        '24/7 WhatsApp concierge support from our Hanoi team'
      ]),
      excludedPrivate: JSON.stringify([
        'International airfares to/from Vietnam',
        'Vietnam entry visa fees',
        'Personal shopping and discretionary gratuities'
      ]),
      excludedPartialGuided: JSON.stringify([
        'International airfares to/from Vietnam',
        'Vietnam entry visa fees',
        'Meals during unguided free-time afternoons',
        'Personal discretionary gratuities'
      ]),
      itinerary: JSON.stringify([
        {
          day: 1,
          title: 'Arrival in Hanoi & French Quarter Welcome Walk',
          description: 'Meet your personal driver at Noi Bai International Airport for a smooth private transfer to your boutique Old Quarter hotel. Settle in, then take an evening orientation stroll around Hoan Kiem Lake, followed by a welcome bowl of piping hot Pho Thin and egg coffee.',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 2,
          title: 'Hanoi Heritage & Culinary Guilds Exploration',
          description: 'Dive into the historic heart of the capital. Visit the serene Temple of Literature, the French-era St. Joseph’s Cathedral, and taste authentic Bun Cha at a neighborhood eatery favored by locals. Afternoon craft workshops in the traditional silver and paper guilds.',
          image: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 3,
          title: 'Hanoi to Ninh Binh Karst Valleys & Trang An Caves',
          description: 'Travel south by private vehicle to Ninh Binh. Board a gentle hand-rowed sampan to drift through Trang An’s soaring water caves surrounded by sheer vertical karst cliffs. Climb Mua Cave peak in the late afternoon for golden panoramic views over Tam Coc valley.',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 4,
          title: 'Ninh Binh to Ha Long Bay Luxury Overnight Cruise',
          description: 'Drive toward the coast and embark on your boutique cruise vessel. Toast with a refreshing welcome drink as the boat glides past iconic limestone towers. Kayak into calm lagoons, swim in tranquil waters, and savor a sunset feast under the stars on the sundeck.',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 5,
          title: 'Ha Long Sunrise Tai Chi, Sung Sot Cave & Return to Hanoi',
          description: 'Start your morning with a calming Tai Chi session as mist rises off the limestone peaks. Explore the cavernous chambers of Sung Sot Cave before enjoying a leisurely brunch on the cruise back to harbor. Return to Hanoi for an evening at leisure.',
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 6,
          title: 'Hanoi Street Life, Coffee Culture & Water Puppetry',
          description: 'Spend an unhurried day discovering hidden courtyard cafes, boutique silk shops, and traditional art galleries. In the evening, attend a private performance of traditional northern water puppetry or a modern bamboo circus show at the Hanoi Opera House.',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 7,
          title: 'Farewell Hanoi & Airport Departure Transfer',
          description: 'Enjoy a leisurely breakfast and pick up last-minute roasted coffee beans or lotus tea before your private driver escorts you to Noi Bai Airport for your onward journey.',
          image: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80'
        }
      ]),
      rating: 4.95,
      totalReviews: 34,
      isFeatured: true,
      isBestSeller: true,
      isPopular: true
    });

    const tour10Days = await Tour.create({
      destinationId: destHanoi.id,
      categoryId: catHighlights.id,
      name: '10-Day Vietnam Highlights - Private & Partial-Guided Tour',
      slug: '10-days-vietnam-highlights-private',
      metaTitle: '10-Day Vietnam Highlights Private & Partial-Guided Tour',
      metaDescription: 'The ultimate 10-day trip connecting Hanoi, Ha Long Bay, Hue, Hoi An, and Ho Chi Minh City with flexible private or partial-guided options.',
      featuredImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'Our flagship route linking royal Hue and lantern-lit Hoi An.',
      fullDescription: 'The gold standard for first-time visitors seeking the complete story of Vietnam. Seamlessly connected by short domestic flights and private transfers, this 10-day itinerary balances iconic guided cultural visits with leisurely afternoons in the cafes and beach spots of central Vietnam.',
      formats: JSON.stringify(['private', 'partial-guided']),
      region: 'multi-region',
      theme: JSON.stringify(['highlights', 'family', 'honeymoon', 'culinary']),
      sourceMarket: JSON.stringify(['vietnam-tours-from-usa', 'vietnam-tours-from-australia', 'vietnam-tours-from-uae']),
      pace: 'Moderate',
      groupSize: 'Private: 2 to 8 guests | Partial-guided: small group max 12',
      duration: '10 Days / 9 Nights',
      durationDays: 10,
      departureLocation: 'Noi Bai International Airport (HAN), Hanoi',
      transportation: 'Chauffeured vehicle, luxury cruise & Vietnam Airlines domestic flights',
      schedule: 'Daily Departures Guaranteed',
      price: 1850.00,
      pricePrivate: 2150.00,
      pricePartialGuided: 1290.00,
      discountPrice: 1290.00,
      availableSlots: 15,
      meetingPoint: 'Hanoi Airport or City Hotel Lobby',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15717366.19658296!2d98.98064436578762!3d15.753880946761066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      routeMapPoints: JSON.stringify([
        { name: 'Hanoi', lat: 21.0285, lng: 105.8542, description: 'Colonial heritage, street culinary walks' },
        { name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, description: 'Overnight luxury cruise among karst peaks' },
        { name: 'Hue', lat: 16.4637, lng: 107.5909, description: 'Imperial Citadel and Perfume River royal tombs' },
        { name: 'Hoi An', lat: 15.8801, lng: 108.338, description: 'Lantern town, organic herb gardens, and tailor shops' },
        { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, description: 'Saigon landmarks, Cu Chi tunnels, and Mekong waters' }
      ]),
      highlights: JSON.stringify([
        'Overnight cruise aboard a 5-star boutique ship in Ha Long Bay',
        'Private guided tour of the Imperial Citadel and royal tombs in Hue',
        'Scenic drive over the breathtaking Hai Van Pass with coastal panoramas',
        'Walking tour of Hoi An ancient town and sunset lantern cruise on Thu Bon River',
        'Historic Cu Chi Tunnels exploration and Saigon rooftop dinner'
      ]),
      includedPrivate: JSON.stringify([
        '9 nights handpicked 4 to 5-star boutique hotels and overnight cruise stateroom',
        '2 domestic flights (Hanoi to Hue, Da Nang to Ho Chi Minh City) with 23kg luggage',
        'Dedicated private English-speaking tour guides in every region',
        'Private air-conditioned chauffeured vehicles for all ground transfers',
        'All temple, museum, boat, and cruise entry tickets included',
        'Daily breakfasts, 5 lunches, and 3 regional gourmet dinners',
        '24/7 dedicated personal concierge service'
      ]),
      includedPartialGuided: JSON.stringify([
        '9 nights handpicked 4 to 5-star boutique hotels and overnight cruise stateroom',
        '2 domestic flights with luggage and pre-arranged private airport transfers',
        'Expert local guides during key highlights (Hanoi food walk, Hue palaces, Cu Chi Tunnels)',
        'Independent exploration days in Hoi An ancient town and Saigon',
        'Full board meals during the Ha Long Bay cruise and daily hotel breakfasts',
        '24/7 on-call travel support via dedicated WhatsApp channel'
      ]),
      excludedPrivate: JSON.stringify([
        'International flights to/from Vietnam',
        'Vietnam entry visas',
        'Personal expenditures, laundry, and discretionary tips'
      ]),
      excludedPartialGuided: JSON.stringify([
        'International flights to/from Vietnam',
        'Vietnam entry visas',
        'Meals during self-guided free time',
        'Discretionary tips'
      ]),
      itinerary: JSON.stringify([
        {
          day: 1,
          title: 'Welcome to Hanoi & Old Quarter Stroll',
          description: 'Arrive at Noi Bai International Airport and transfer to your elegant hotel in Hanoi. In the late afternoon, enjoy an introduction walk through the vibrant 36 Guild Streets, sampling classic egg coffee.',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 2,
          title: 'Hanoi Heritage & Foodie Discovery',
          description: 'Visit the Temple of Literature, Ba Dinh Square, and the picturesque West Lake. Savor iconic street delicacies like Bun Cha and fresh spring rolls with our resident culinary expert.',
          image: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 3,
          title: 'Hanoi to Ha Long Bay Overnight Luxury Cruise',
          description: 'Transfer via modern highway to the coast and board your luxury wooden junk. Sail through tranquil channels, explore mysterious sea caves, and enjoy sunset on the upper deck.',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 4,
          title: 'Ha Long Morning Tai Chi & Flight to Imperial Hue',
          description: 'Watch the sunrise over limestone towers during a morning Tai Chi class. Enjoy a scenic brunch while cruising back to port, then transfer directly to Hanoi airport for your 1-hour flight to imperial Hue.',
          image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 5,
          title: 'Hue Imperial Citadel & Royal Tombs',
          description: 'Step back into the Nguyen Dynasty. Tour the Forbidden Purple City, cruise the Perfume River to Thien Mu Pagoda, and discover the pine-forested Tomb of Emperor Tu Duc.',
          image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 6,
          title: 'Hai Van Pass Scenic Drive to Lantern Town Hoi An',
          description: 'Drive over the dramatic ocean cliffs of the Hai Van Pass, stopping for sweeping coastal vistas above Da Nang. Arrive in Hoi An and spend your evening under thousands of glowing silk lanterns.',
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 7,
          title: 'Hoi An Cycling, Herb Villages & Free Afternoon',
          description: 'Cycle along quiet village pathways to Tra Que organic herb village. Try your hand at traditional farming techniques and enjoy an herbal foot soak. The afternoon is yours to visit bespoke tailors or unwind on An Bang beach.',
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 8,
          title: 'Flight to Ho Chi Minh City & Saigon Highlights',
          description: 'Morning private transfer to Da Nang airport for your flight south to Ho Chi Minh City. Tour the War Remnants Museum, the Central Post Office designed by Gustave Eiffel, and the atmospheric Cholon Chinatown.',
          image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 9,
          title: 'Cu Chi Historic Tunnels & Farewell Dinner',
          description: 'Excursion to the legendary Cu Chi underground tunnel network to understand wartime ingenuity. In the evening, gather for a celebratory farewell dinner overlooking the glittering Saigon skyline.',
          image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
        },
        {
          day: 10,
          title: 'Saigon Leisure & Departure',
          description: 'Enjoy a leisurely breakfast and last-minute market browsing before your private airport transfer for your flight home.',
          image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
        }
      ]),
      rating: 4.98,
      totalReviews: 62,
      isFeatured: true,
      isBestSeller: true,
      isPopular: true
    });

    const tour14Days = await Tour.create({
      destinationId: destHanoi.id,
      categoryId: catPartial.id,
      name: '14-Day Grand Vietnam North to South - Partial-Guided & Private Tour',
      slug: '14-days-north-to-south-partial-guided',
      metaTitle: '14-Day Vietnam North to South Partial-Guided & Private Tour',
      metaDescription: 'Two immersive weeks traveling from mountain Sapa and Ha Long Bay down through Hue, Hoi An, Saigon, and the Mekong Delta.',
      featuredImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'The comprehensive two-week classic. Mountain trekking in Sapa, cruising Ha Long, strolling imperial Hue and ancient Hoi An, followed by vibrant Saigon and tranquil palm canals in the Mekong Delta.',
      fullDescription: 'Designed for discerning travelers who want to absorb both northern alpine valleys and southern riverine life without rushing. This 14-day tour embodies the partial-guided philosophy: expert guides lead you through high-complexity cultural landmarks, while generous unguided days give you space to soak in the atmosphere at your own rhythm.',
      formats: JSON.stringify(['partial-guided', 'private']),
      region: 'multi-region',
      theme: JSON.stringify(['highlights', 'adventure', 'family', 'eco-tours']),
      sourceMarket: JSON.stringify(['vietnam-tours-from-usa', 'vietnam-tours-from-australia']),
      pace: 'Moderate',
      groupSize: 'Private: 2 to 8 guests | Partial-guided: small group max 12',
      duration: '14 Days / 13 Nights',
      durationDays: 14,
      departureLocation: 'Noi Bai International Airport (HAN), Hanoi',
      transportation: 'Chauffeured vehicle, luxury trains, cruise and domestic flights',
      schedule: 'Weekly Departures & Daily Private Options',
      price: 2490.00,
      pricePrivate: 2890.00,
      pricePartialGuided: 2290.00,
      discountPrice: 2290.00,
      availableSlots: 10,
      meetingPoint: 'Hanoi Airport Arrival Gate',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15717366.19658296!2d98.98064436578762!3d15.753880946761066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      routeMapPoints: JSON.stringify([
        { name: 'Hanoi', lat: 21.0285, lng: 105.8542, description: 'Guild streets and heritage quarters' },
        { name: 'Sapa', lat: 22.3364, lng: 103.8438, description: 'Terraced mountain amphitheaters and hill tribes' },
        { name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, description: 'Overnight luxury cruise in emerald waters' },
        { name: 'Hue', lat: 16.4637, lng: 107.5909, description: 'Imperial dynasty palaces and garden residences' },
        { name: 'Hoi An', lat: 15.8801, lng: 108.338, description: 'Lantern-lit ancient port and cycling trails' },
        { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, description: 'Metropolitan Saigon and Cu Chi tunnels' },
        { name: 'Mekong Delta', lat: 10.0452, lng: 105.7469, description: 'Palm-fringed canals and floating markets' }
      ]),
      highlights: JSON.stringify([
        'Sapa mountain valley trek staying at an eco-lodge above the clouds',
        'Overnight luxury cruise through the secluded karst waters of Lan Ha & Ha Long Bay',
        'Royal banquet dining experience in a historic Hue garden house',
        'Two full unguided leisure days in charming Hoi An for personal exploration',
        'Private wooden sampan cruise through lush canals of the Mekong Delta'
      ]),
      includedPrivate: JSON.stringify([
        '13 nights premium 4 to 5-star accommodations and overnight cruise',
        'All domestic flights, luxury trains, and private chauffeured AC vehicles',
        'Personal English-speaking guide for all sightseeing and excursions',
        'All entrance fees, boat tickets, cable car, and national park permits',
        'Daily breakfasts, 8 curated lunches, and 5 special regional dinners',
        '24/7 VIP concierge support'
      ]),
      includedPartialGuided: JSON.stringify([
        '13 nights premium 4 to 5-star accommodations and overnight cruise',
        'All intercity travel tickets (train, domestic flights, intercity transfers)',
        'Guided excursions for all complex cultural sights and mountain hikes',
        'Built-in unguided days in Hoi An and Saigon with our curated insider app guide',
        'Daily breakfasts, cruise meals, and selected regional tastings',
        '24/7 WhatsApp concierge hotline for instant advice and reservations'
      ]),
      excludedPrivate: JSON.stringify([
        'International air tickets',
        'Visa approval letter and stamp fees',
        'Discretionary tips and personal expenditures'
      ]),
      excludedPartialGuided: JSON.stringify([
        'International air tickets',
        'Visa fees',
        'Meals during unguided free time',
        'Personal discretionary tips'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Hanoi Arrival & French Quarter Evening Stroll', description: 'Arrive in Hanoi and transfer to your colonial-style boutique hotel. Evening welcome dinner.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 2, title: 'Hanoi Historic Sights & Express Train to Sapa', description: 'Tour the Temple of Literature and Ho Chi Minh Mausoleum before traveling north toward the misty mountains.', image: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80' },
        { day: 3, title: 'Sapa Muong Hoa Valley Trek & Tribal Villages', description: 'Hike through sweeping green terraces visiting Black Hmong and Red Dao villages.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 4, title: 'Fansipan Peak Cable Car & Return to Hanoi', description: 'Ascend the Roof of Indochina by scenic cable car before your private transfer back to Hanoi.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 5, title: 'Hanoi to Ha Long Bay Luxury Overnight Cruise', description: 'Board your wooden junk and cruise among thousands of limestone karsts.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
        { day: 6, title: 'Ha Long Bay Morning & Flight to Imperial Hue', description: 'Tai Chi at sunrise, cave exploration, and an afternoon flight to royal Hue.', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80' },
        { day: 7, title: 'Imperial Hue Palaces & Perfume River Cruise', description: 'Discover the Citadel and Tu Duc tomb. Evening royal cuisine experience.', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80' },
        { day: 8, title: 'Hai Van Pass Scenic Drive to Hoi An', description: 'Drive along coastal cliff roads over Hai Van Pass to reach lantern-lit Hoi An.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 9, title: 'Hoi An Guided Walking Tour & Cooking Experience', description: 'Morning market walk and hands-on Vietnamese cooking class in an herb village.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 10, title: 'Hoi An Full Day at Leisure (Partial-Guided Freedom)', description: 'Relax on An Bang Beach, get bespoke garments tailored, or cycle countryside lanes.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 11, title: 'Flight to Ho Chi Minh City & Saigon Orientation', description: 'Fly to bustling Saigon. Tour French colonial buildings and Chinatown temples.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { day: 12, title: 'Cu Chi Underground Tunnels Excursion', description: 'Uncover Vietnam war history inside the remarkably preserved tunnel network.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { day: 13, title: 'Mekong Delta Waterways & Coconut Canals', description: 'Day cruise along palm-fringed waterways, visiting honey farms and orchards.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { day: 14, title: 'Saigon Souvenir Shopping & Departure Transfer', description: 'Leisurely morning at Ben Thanh market before your private airport transfer.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' }
      ]),
      rating: 4.97,
      totalReviews: 48,
      isFeatured: true,
      isBestSeller: true,
      isPopular: true
    });

    const tour21Days = await Tour.create({
      destinationId: destHanoi.id,
      categoryId: catSlowTravel.id,
      name: '21-Day Complete Vietnam In-Depth Expedition - Partial-Guided & Private Tour',
      slug: '21-days-vietnam-partial-guided',
      metaTitle: '21-Day Vietnam Complete In-Depth Expedition Tour',
      metaDescription: 'The definitive 3-week Vietnam voyage covering northern mountain loops, subterranean caves, royal cities, highlands, and tropical islands.',
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'The ultimate slow-travel journey. Spanning Hanoi, Sapa, Ha Long Bay, Phong Nha caves, Hue, Hoi An, Da Lat highlands, Saigon, the Mekong Delta, and tropical Phu Quoc island.',
      fullDescription: 'Three weeks of deep cultural immersion for those who wish to experience the true breadth of Vietnam. By interweaving guided cultural insights with restorative self-paced days, this itinerary prevents travel burnout while letting you discover hidden artisan corners that standard fast-track tours miss completely.',
      formats: JSON.stringify(['partial-guided', 'private']),
      region: 'multi-region',
      theme: JSON.stringify(['highlights', 'adventure', 'honeymoon', 'eco-tours']),
      sourceMarket: JSON.stringify(['vietnam-tours-from-usa', 'vietnam-tours-from-australia', 'vietnam-tours-from-uae']),
      pace: 'Relaxed',
      groupSize: 'Private: 2 to 8 guests | Partial-guided: small group max 12',
      duration: '21 Days / 20 Nights',
      durationDays: 21,
      departureLocation: 'Noi Bai International Airport (HAN), Hanoi',
      transportation: 'Chauffeured vehicle, luxury trains, cruise and 3 domestic flights',
      schedule: 'Guaranteed Bi-Weekly Departures & Daily Private Departures',
      price: 3650.00,
      pricePrivate: 4250.00,
      pricePartialGuided: 3350.00,
      discountPrice: 3350.00,
      availableSlots: 8,
      meetingPoint: 'Hanoi Airport Arrival Gate',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15717366.19658296!2d98.98064436578762!3d15.753880946761066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      routeMapPoints: JSON.stringify([
        { name: 'Hanoi', lat: 21.0285, lng: 105.8542, description: 'Capital city arrival and food culture' },
        { name: 'Sapa', lat: 22.3364, lng: 103.8438, description: 'Mountain rice terraces and hill tribe homestays' },
        { name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, description: 'Luxury 2-night cruise across quiet bay waters' },
        { name: 'Phong Nha', lat: 17.5898, lng: 106.2828, description: 'Subterranean Paradise Cave grottoes' },
        { name: 'Hue', lat: 16.4637, lng: 107.5909, description: 'Imperial dynasty courts and royal tombs' },
        { name: 'Hoi An', lat: 15.8801, lng: 108.338, description: 'Unesco ancient town and peaceful beach stays' },
        { name: 'Da Lat', lat: 11.9404, lng: 108.4583, description: 'Pine forest plateau and mountain coffee estates' },
        { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, description: 'Metropolitan history, food and wartime tunnels' },
        { name: 'Mekong Delta', lat: 10.0452, lng: 105.7469, description: 'Water channels, fruit farms and river life' },
        { name: 'Phu Quoc', lat: 10.2899, lng: 103.984, description: 'Tropical island beach relaxation finish' }
      ]),
      highlights: JSON.stringify([
        'Full 3-day deep exploration of northern mountain trails in Sapa and Muong Hoa',
        '2-night extended luxury cruise sailing to uncrowded Bai Tu Long and Lan Ha bays',
        'Subterranean adventure inside Paradise Cave and Dark Cave in Phong Nha',
        'Gentle unhurried stay in Hoi An with cooking classes and tailor fittings',
        'Highland coffee estate tastings in Da Lat and French alpine heritage',
        '3 restorative days of beachfront bliss in tropical Phu Quoc island'
      ]),
      includedPrivate: JSON.stringify([
        '20 nights in handpicked 4 to 5-star boutique hotels and resort villas',
        '3 domestic flights with 23kg luggage and VIP airport ground support',
        'Dedicated private driver and tour guide for all regional transfers and tours',
        'All entry tickets, national park permits, cable cars, and boat excursions',
        'Daily breakfasts, 12 regional lunches, and 7 special dinner experiences',
        '24/7 personal travel director concierge on call'
      ]),
      includedPartialGuided: JSON.stringify([
        '20 nights in handpicked 4 to 5-star boutique hotels and resort villas',
        'All domestic flights and intercity connections fully arranged and guaranteed',
        'Guided tours for all intricate destinations: Hanoi, Sapa, Phong Nha, Hue, Saigon',
        'Generous independent leisure days in Hoi An, Da Lat, and Phu Quoc',
        'Daily breakfasts, all cruise meals, and selected traditional lunches',
        '24/7 WhatsApp concierge hotline for dinner bookings and local tips'
      ]),
      excludedPrivate: JSON.stringify([
        'International flights',
        'Vietnam entry visas',
        'Discretionary tips'
      ]),
      excludedPartialGuided: JSON.stringify([
        'International flights',
        'Vietnam entry visas',
        'Meals during unguided leisure days',
        'Discretionary tips'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Hanoi & Rest', description: 'VIP airport transfer to your Old Quarter hotel.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 2, title: 'Hanoi Heritage Walk & Food Guilds', description: 'Explore historic alleys and culinary secrets.', image: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=800&q=80' },
        { day: 3, title: 'Scenic Drive to Mountain Sapa', description: 'Journey to the misty northern highlands.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 4, title: 'Muong Hoa Valley Tribal Trek', description: 'Trek through layered terraced fields.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 5, title: 'Return to Hanoi & Evening Puppet Show', description: 'Return south to Hanoi for cultural performances.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 6, title: 'Ha Long & Lan Ha Bay Overnight Cruise', description: 'Board your luxury vessel for a two-night cruise.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
        { day: 7, title: 'Deep Bay Kayaking & Floating Villages', description: 'Paddle into quiet lagoons and karst arches.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
        { day: 8, title: 'Cruise Disembarkation & Train to Phong Nha', description: 'Scenic train ride south to the cave kingdom.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
        { day: 9, title: 'Paradise Cave & Dark Cave Grotto Exploration', description: 'Marvel at colossal underground stalactites.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
        { day: 10, title: 'Drive to Hue Imperial City via DMZ', description: 'Pass historic 17th parallel into royal Hue.', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80' },
        { day: 11, title: 'Hue Imperial Citadel & Perfume River', description: 'Royal palace and garden house gastronomy.', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80' },
        { day: 12, title: 'Hai Van Pass Scenic Drive to Hoi An', description: 'Coastal panoramas and evening in lantern town.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 13, title: 'Hoi An Ancient Heritage & Cooking Class', description: 'Market visit, organic herbs and banh mi tasting.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 14, title: 'Hoi An Free Leisure Day (Partial-Guided Freedom)', description: 'Bespoke tailoring and beach cycling.', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { day: 15, title: 'Flight to Highland Da Lat', description: 'Ascend to the cool pines and French villas of Da Lat.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 16, title: 'Da Lat Coffee Plantations & Waterfalls', description: 'Artisanal Arabica tastings and lake walks.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        { day: 17, title: 'Flight to Ho Chi Minh City & Vespa Street Tour', description: 'Evening vintage Vespa ride through buzzing alleys.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { day: 18, title: 'Mekong Delta River Life & Can Tho Floating Market', description: 'Boat among bustling river traders.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { day: 19, title: 'Flight to Tropical Phu Quoc Island', description: 'Arrive at your seaside villa resort.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
        { day: 20, title: 'Phu Quoc Island Beach Relaxation', description: 'Sunset cocktails and warm tropical waters.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
        { day: 21, title: 'Flight to Ho Chi Minh City & International Departure', description: 'Domestic flight connection for departure home.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' }
      ]),
      rating: 4.99,
      totalReviews: 29,
      isFeatured: true,
      isBestSeller: false,
      isPopular: true
    });

    // 6. Itineraries (Editorial / Blog per Sitemap Section 4 - Grouped by Duration)
    console.log('🌱 Seeding Editorial Itineraries (/trips/)...');

    await Itinerary.create({
      title: '7 Days in Vietnam: Essential Route Ideas for One Week',
      slug: '7-days-essential-vietnam-route',
      duration: 7,
      heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      summary: 'How to experience the soul of Vietnam when you only have one week, focusing deeply on the classic northern circuit instead of rushing.',
      routeIdeas: JSON.stringify([
        {
          title: 'Route Idea 1: Northern Heritage & Limestone Waters',
          summary: 'Connect Hanoi, Ninh Binh, and Ha Long Bay. Spend 2 days walking through Hanoi guilds, 1 day gliding through Trang An river caves, and an unforgettable overnight on Ha Long Bay.',
          relatedTourSlug: '7-days-north-vietnam-private'
        },
        {
          title: 'Route Idea 2: Central Coast & Imperial Palaces',
          summary: 'Fly directly to Da Nang. Split your week between lantern-lit Hoi An ancient town and the imperial citadel in royal Hue, separated by the scenic Hai Van Pass.',
          relatedTourSlug: '10-days-vietnam-highlights-private'
        }
      ]),
      body: `One week in Vietnam is enough time to fall deeply in love with the country, provided you resist the temptation to cover too much geography. 

When travelers attempt to see Hanoi, Hue, Hoi An, and Saigon in just seven days, they spend more time in airport waiting rooms and taxi queues than experiencing local culture. Instead, our philosophy focuses on depth.

By concentrating on the northern triangle of Hanoi, Ninh Binh, and Ha Long Bay, every day is rich in authentic encounters. You will taste warm egg coffee in quiet alleyways, watch water buffalo graze along riverbanks, and fall asleep surrounded by limestone karst towers.`,
      relatedDestinations: JSON.stringify(['hanoi', 'ha-long-bay', 'ninh-binh']),
      metaTitle: '7 Days in Vietnam Itinerary: One Week Route Ideas | Tranoi Travel',
      metaDescription: 'Discover how to plan a meaningful 7-day trip to Vietnam without rushing.'
    });

    await Itinerary.create({
      title: '10 Days in Vietnam: The Perfect Classic Route',
      slug: '10-days-vietnam-highlights-route',
      duration: 10,
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      summary: 'The benchmark itinerary for first-time visitors, connecting the capital, the natural world wonder of Ha Long Bay, royal heritage in Hue and Hoi An, and cosmopolitan Saigon.',
      routeIdeas: JSON.stringify([
        {
          title: 'Route Idea: North to South Highlights with Central Coast',
          summary: 'Hanoi (2 days) -> Ha Long Bay Cruise (1 day) -> Hue & Hoi An (4 days) -> Ho Chi Minh City (3 days). Seamless domestic flights maximize your time on the ground.',
          relatedTourSlug: '10-days-vietnam-highlights-private'
        }
      ]),
      body: `Ten days is the sweet spot for travelers who want to experience the contrast between northern tradition, central heritage, and southern dynamism.

Starting in Hanoi allows you to ground yourself in thousand-year-old history. An overnight cruise in Ha Long Bay provides a peaceful natural respite before you fly south to central Vietnam. In Hue and Hoi An, time slows down among ancient shophouses and peaceful cycling trails. Finally, Ho Chi Minh City offers a thrilling contemporary finale.`,
      relatedDestinations: JSON.stringify(['hanoi', 'ha-long-bay', 'hue', 'hoi-an', 'ho-chi-minh-city']),
      metaTitle: '10 Days in Vietnam Itinerary: Classic Highlights | Tranoi Travel',
      metaDescription: 'Explore our curated 10-day Vietnam route connecting Hanoi, Ha Long, Hoi An, and Saigon.'
    });

    await Itinerary.create({
      title: '14 Days in Vietnam: Grand North to South Explorer',
      slug: '14-days-north-to-south-grand-route',
      duration: 14,
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      summary: 'Two complete weeks allowing for mountain treks in Sapa, tranquil coastal cruises, historic central towns, and the winding canals of the Mekong Delta.',
      routeIdeas: JSON.stringify([
        {
          title: 'Route Idea: Mountains, Seas, and River Deltas',
          summary: 'Add northern mountain trails in Sapa to the classic highlights route, and conclude with a tranquil journey along the palm-shaded waterways of the Mekong Delta.',
          relatedTourSlug: '14-days-north-to-south-partial-guided'
        }
      ]),
      body: `With two weeks, you can leave the tourist corridors behind and experience the authentic diversity of Vietnam's landscapes.

Begin in the northern highlands of Sapa where terraced rice fields cascade down mountain valleys. After descending to Hanoi and sailing Ha Long Bay, spend four unhurried days in central Vietnam. Conclude your voyage by discovering the waterborne communities of the Mekong Delta.`,
      relatedDestinations: JSON.stringify(['hanoi', 'sapa', 'ha-long-bay', 'hoi-an', 'ho-chi-minh-city', 'mekong-delta']),
      metaTitle: '14 Days in Vietnam Itinerary: Grand Explorer | Tranoi Travel',
      metaDescription: 'Plan two incredible weeks across Vietnam with our curated 14-day travel route.'
    });

    await Itinerary.create({
      title: '21 Days in Vietnam: Complete In-Depth Expedition',
      slug: '21-days-in-depth-vietnam-expedition',
      duration: 21,
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      summary: 'The definitive three-week immersion for slow travelers who want to discover subterranean karst caves, misty coffee plateaus, and pristine island sands.',
      routeIdeas: JSON.stringify([
        {
          title: 'Route Idea: The Comprehensive Vietnam Odyssey',
          summary: 'From the northern border of Sapa to the subterranean caverns of Phong Nha, through Da Lat’s cool pine plateaus, finishing with three days of tropical relaxation on Phu Quoc island.',
          relatedTourSlug: '21-days-vietnam-partial-guided'
        }
      ]),
      body: `Three weeks allows you to truly settle into the rhythm of Vietnam. There is no need to rush from monument to monument. You can spend full days simply sipping coffee in old courtyards, conversing with local artisans, and drifting along tranquil river bends.

This route combines iconic world wonders with remote frontiers like Phong Nha's cavernous underground chambers, Da Lat's highland estates, and Phu Quoc's turquoise waters.`,
      relatedDestinations: JSON.stringify(['hanoi', 'sapa', 'phong-nha', 'hue', 'hoi-an', 'da-lat', 'ho-chi-minh-city', 'phu-quoc']),
      metaTitle: '21 Days in Vietnam Itinerary: Complete Expedition | Tranoi Travel',
      metaDescription: 'The ultimate 3-week slow travel itinerary across all regions of Vietnam with Tranoi Travel.'
    });

    // 7. Themes (Flat URLs per Sitemap Section 6)
    console.log('🌱 Seeding Flat Themes...');

    await Theme.create({
      title: 'Vietnam Honeymoon Tours: Romantic Stays and Secluded Escapes',
      slug: 'honeymoon',
      type: 'traveler-type',
      tagline: 'Private pool villas, lantern-lit dinners, and serene bay sunsets designed for couples.',
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      body: `Vietnam is one of the most romantic destinations in Asia, blending French colonial charm, private seaside sanctuaries, and breathtaking natural scenery.

Our honeymoon itineraries are carefully paced to give couples privacy and elegance. Enjoy private candlelit dinners on the deck of a boutique cruise in Ha Long Bay, stroll hand-in-hand through lantern-lit Hoi An, and unwind in private pool villas perched along the coastline. Every hotel is handpicked for its atmosphere and discreet hospitality.`,
      relatedTourSlugs: JSON.stringify(['10-days-vietnam-highlights-private', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Honeymoon Tours & Romantic Packages | Tranoi Travel',
      metaDescription: 'Discover romantic honeymoon packages in Vietnam curated by Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Family Tours: Engaging Travel for All Generations',
      slug: 'family',
      type: 'traveler-type',
      tagline: 'Hands-on cultural fun, safe private transfers, and comfortable stays for families.',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      body: `Traveling with children across Vietnam is an extraordinary and enriching experience. Vietnamese culture deeply cherishes family, and locals will welcome your children with genuine warmth.

Our family packages balance fun activities with comfortable travel times. Instead of long lectures, kids learn to make traditional silk lanterns in Hoi An, row through water coconut forests, cook spring rolls with village chefs, and kayak through calm bay lagoons. All accommodations feature spacious family suites and swimming pools.`,
      relatedTourSlugs: JSON.stringify(['10-days-vietnam-highlights-private', '14-days-north-to-south-partial-guided']),
      metaTitle: 'Vietnam Family Tours & Multi-Generational Vacations | Tranoi Travel',
      metaDescription: 'Thoughtfully curated family vacations across Vietnam with Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Adventure Tours: Treks, Caves, and Cycling Trails',
      slug: 'adventure',
      type: 'traveler-type',
      tagline: 'Step off the beaten track into mountain valleys, karst caverns, and coastal passes.',
      heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      body: `For active travelers, Vietnam is an outdoor playground. From hiking the misty amphitheaters of Sapa to kayaking hidden sea lagoons and exploring the world’s most extensive limestone cave networks in Phong Nha.

We combine thrilling outdoor activities with authentic cultural encounters. You will cycle quiet rural pathways past rice paddies, kayak secluded bays away from day-trippers, and hike with local ethnic minority guides who know every mountain pass intimately.`,
      relatedTourSlugs: JSON.stringify(['14-days-north-to-south-partial-guided', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Adventure Tours & Active Trekking | Tranoi Travel',
      metaDescription: 'Explore active hiking, cave expeditions, and cycling in Vietnam with Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Culinary Tours: Street Food, Markets, and Royal Flavors',
      slug: 'culinary',
      type: 'traveler-type',
      tagline: 'Taste the nuanced harmony of sweet, sour, salty, bitter, and umami across three culinary regions.',
      heroImage: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=1200&q=80',
      body: `Vietnamese food is celebrated worldwide for its clean herbs, complex broths, and sensational street food culture. But experiencing it in its birthplace is a revelation.

Each region tells its own story. The north favors delicate, savory broths like pho and bun cha. Central Vietnam brings bold chili heat and royal court dining. The south celebrates sweet palm sugar, fresh coconut milk, and overflowing bowls of fresh river greens. Our culinary journeys take you behind the scenes with passionate local food writers and home chefs.`,
      relatedTourSlugs: JSON.stringify(['7-days-north-vietnam-private', '10-days-vietnam-highlights-private']),
      metaTitle: 'Vietnam Food & Culinary Tours | Tranoi Travel',
      metaDescription: 'Embark on a culinary journey through Vietnam’s street food stalls and royal dining with Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Eco-Tours: Responsible Travel in Natural Sanctuaries',
      slug: 'eco-tours',
      type: 'traveler-type',
      tagline: 'Low-impact travel supporting local communities and preserving precious natural habitats.',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      body: `Our eco-tours prioritize environmental conservation and fair community partnerships. Stay in solar-powered eco-lodges, support traditional artisan craft cooperatives, and visit national parks dedicated to biodiversity protection.

Every trip is carbon-conscious and avoids mass-commercial attractions in favor of meaningful, authentic local engagement.`,
      relatedTourSlugs: JSON.stringify(['14-days-north-to-south-partial-guided', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Eco-Tours & Sustainable Travel | Tranoi Travel',
      metaDescription: 'Support local communities and explore Vietnam’s natural reserves responsibly with Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Veterans & Heritage Tours: Remembrance and Healing',
      slug: 'veterans-tours',
      type: 'traveler-type',
      tagline: 'Respectful, educational journeys exploring historic wartime sites and modern reconciliation.',
      heroImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      body: `A thoughtful journey for veterans, history enthusiasts, and families seeking to understand Vietnam’s complex 20th-century history.

Visit significant historical sites including the Cu Chi underground tunnels, the Demilitarized Zone (DMZ), Khe Sanh, and the War Remnants Museum with knowledgeable, sensitive local historians. Experience firsthand how a resilient nation transformed into a warm, welcoming society of peace and friendship.`,
      relatedTourSlugs: JSON.stringify(['10-days-vietnam-highlights-private', '14-days-north-to-south-partial-guided']),
      metaTitle: 'Vietnam Veterans & Historical Tours | Tranoi Travel',
      metaDescription: 'Explore historical sites, remembrance landmarks, and modern reconciliation in Vietnam.'
    });

    await Theme.create({
      title: 'Vietnam Educational Tours: Cultural Immersion and Student Expeditions',
      slug: 'educational-tours',
      type: 'traveler-type',
      tagline: 'Experiential learning across biology, history, agriculture, and Southeast Asian culture.',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      body: `Designed for students, academic groups, and curious lifelong learners. Discover traditional water engineering in the Mekong Delta, study biodiversity in tropical national parks, and engage in cultural exchange workshops with university students in Hanoi and Saigon.`,
      relatedTourSlugs: JSON.stringify(['14-days-north-to-south-partial-guided', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Educational & Study Tours | Tranoi Travel',
      metaDescription: 'Hands-on educational journeys and cultural immersion tours in Vietnam with Tranoi Travel.'
    });

    // Source Markets Themes
    await Theme.create({
      title: 'Vietnam Tours from USA: Seamless Custom Travel from America',
      slug: 'vietnam-tours-from-usa',
      type: 'source-market',
      tagline: 'Carefully coordinated for American travelers with 24/7 concierge and smooth flight connections.',
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      body: `Traveling from the United States to Vietnam is a bucket-list journey. With convenient one-stop connections from San Francisco, Los Angeles, Seattle, and New York via Seoul, Tokyo, or Taipei, reaching Vietnam is smoother than ever.

Our itineraries are designed to counter jet lag on arrival, offering gentle first days in Hanoi or Saigon. Enjoy luxury 4 and 5-star boutique accommodations, fluent English-speaking private guides, and round-the-clock support adjusted to your home time zone.`,
      relatedTourSlugs: JSON.stringify(['10-days-vietnam-highlights-private', '14-days-north-to-south-partial-guided', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Tours from USA: Tailored Packages for American Travelers | Tranoi Travel',
      metaDescription: 'Expertly designed Vietnam vacation packages for travelers departing from the United States.'
    });

    await Theme.create({
      title: 'Vietnam Tours from Australia: Direct Flights and Sunlit Escapes',
      slug: 'vietnam-tours-from-australia',
      type: 'source-market',
      tagline: 'Effortless travel with direct 8-hour flights from Sydney, Melbourne, Brisbane, and Perth.',
      heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      body: `Vietnam is one of the favorite holiday destinations for Australians, thanks to minimal time zone differences and direct non-stop flights from Sydney, Melbourne, and Brisbane to Ho Chi Minh City and Hanoi.

Whether escaping the southern winter for warm coastal beaches or exploring ancient history, our partial-guided and private packages offer exceptional value, rich coffee culture, and warm hospitality.`,
      relatedTourSlugs: JSON.stringify(['7-days-north-vietnam-private', '10-days-vietnam-highlights-private', '14-days-north-to-south-partial-guided']),
      metaTitle: 'Vietnam Tours from Australia: Tailored Holiday Packages | Tranoi Travel',
      metaDescription: 'Direct flight holiday itineraries to Vietnam for Australian travelers by Tranoi Travel.'
    });

    await Theme.create({
      title: 'Vietnam Tours from UAE: Luxury Escapes from Dubai and Abu Dhabi',
      slug: 'vietnam-tours-from-uae',
      type: 'source-market',
      tagline: 'Premium boutique hospitality with direct daily flights from Dubai and Abu Dhabi.',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      body: `Direct daily flights on Emirates and Qatar Airways make Vietnam a top destination for travelers based in the UAE. 

We cater to the highest standards of luxury, privacy, and gourmet dining. From private pool villas overlooking secluded bays to halal and vegetarian culinary arrangements, our bespoke tours ensure an effortless and deeply relaxing experience.`,
      relatedTourSlugs: JSON.stringify(['10-days-vietnam-highlights-private', '21-days-vietnam-partial-guided']),
      metaTitle: 'Vietnam Tours from UAE: Luxury Holidays from Dubai & Abu Dhabi | Tranoi Travel',
      metaDescription: 'Exclusive luxury Vietnam travel packages tailored for guests from the UAE and Gulf region.'
    });

    // 8. Travel Guides (Sitemap Section 7 - 6 Guides)
    console.log('🌱 Seeding Travel Guides (/guides/)...');

    await Guide.create({
      title: 'Best Time to Visit Vietnam: Climate, Seasons, and Regional Insights',
      slug: 'best-time-to-visit-vietnam',
      category: 'Planning & Essentials',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      readTime: '7 min read',
      excerpt: 'Vietnam spans over 1,650 kilometers from north to south, meaning different regions experience distinctly different weather patterns simultaneously.',
      body: `Because of Vietnam’s elongated geography, there is no single "bad" time to visit the country. When it is cool and crisp in Hanoi, the southern beaches of Phu Quoc are bathed in warm sunshine.

### 1. North Vietnam (Hanoi, Ha Long Bay, Sapa, Ninh Binh)
The north experiences four distinct seasons. October to April brings pleasant, dry weather with daytime temperatures around 20°C to 24°C. Winter (December to February) can feel surprisingly crisp, especially in mountain Sapa. Summer (May to August) is warm and humid with occasional afternoon tropical showers.

### 2. Central Vietnam (Hue, Da Nang, Hoi An, Phong Nha)
Central Vietnam enjoys warm and dry weather from February through August, making it ideal for beach lovers and ancient town walking. The rainy season typically occurs between September and November.

### 3. South Vietnam (Ho Chi Minh City, Mekong Delta, Phu Quoc)
The south has a constant tropical climate year-round with temperatures hovering around 30°C. The dry season runs from November to April, while the green season (May to October) brings short, refreshing afternoon showers that clear the air.`,
      metaTitle: 'Best Time to Visit Vietnam: Weather & Seasons Guide | Tranoi Travel',
      metaDescription: 'Find out the best time to visit Vietnam across North, Central, and South regions.'
    });

    await Guide.create({
      title: 'Vietnam Visa Guide: Easy Online E-Visa Rules for Travelers',
      slug: 'vietnam-visa-guide',
      category: 'Planning & Essentials',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1557750298-17ae4f2c0cf6?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      excerpt: 'Everything you need to know about Vietnam’s official 90-day electronic visa, required documents, and entry procedures.',
      body: `Visiting Vietnam has never been simpler. The Vietnamese government now grants 90-day multi-entry and single-entry electronic visas (e-Visas) to citizens of all countries and territories worldwide.

### Key Requirements
- A passport valid for at least 6 months beyond your planned entry date.
- A digital scan of your passport biographical page.
- A recent passport photo (clear background, no glasses).
- The official government fee ($25 for single entry, $50 for multiple entry).

### Processing Time
The official government portal typically processes applications within 3 to 5 business days. We recommend submitting your application at least 2 weeks before departure. If you book with Tranoi Travel, our concierge team reviews your documents free of charge to guarantee error-free processing.`,
      metaTitle: 'Vietnam Visa Guide: E-Visa Requirements & Application | Tranoi Travel',
      metaDescription: 'A complete step-by-step guide to obtaining your Vietnam tourist e-visa easily.'
    });

    await Guide.create({
      title: 'Private Tours vs Partial-Guided Tours: Which Is Right for You?',
      slug: 'private-tours-vs-partial-guided',
      category: 'Planning & Essentials',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      readTime: '6 min read',
      excerpt: 'Compare fully private guided touring with our signature partial-guided format to pick the perfect travel style for your trip.',
      body: `One of the most frequent questions travelers ask us is: what does "partial-guided" actually mean, and how does it compare to a 100% private guided journey?

### Fully Private Tours
On a private tour, you have a dedicated private vehicle, driver, and licensed English-speaking guide accompanying you throughout every day. Your schedule is completely flexible. If you want to linger another hour at a coffee shop or start your morning at 10:00 AM instead of 8:30 AM, your team adjusts immediately. This is the ideal choice for families with small children, seniors, or couples seeking total discretion.

### Partial-Guided Tours (The Modern Sweet Spot)
Many experienced travelers find that having a guide hovering over them every single hour can feel exhausting. You want expert guidance for complex cultural treasures like the Imperial Citadel or Hanoi's secret street food guilds, but you would prefer to explore Hoi An’s cafes or Da Nang’s beaches at your own pace without an entourage.

With partial-guided tours, you enjoy the best of both worlds. All hotel bookings, domestic flights, intercity limousine transfers, and major excursions are pre-arranged and fully guaranteed. On key sightseeing mornings, your expert guide meets you. On afternoon leisure windows, you are free to wander independently with 24/7 WhatsApp support from our team just a tap away.`,
      metaTitle: 'Private vs Partial-Guided Tours in Vietnam | Tranoi Travel',
      metaDescription: 'Understand the difference between private and partial-guided tours to choose the best option.'
    });

    await Guide.create({
      title: 'Vietnam Travel Tips: Currency, SIM Cards, Etiquette, and Safety',
      slug: 'vietnam-travel-tips',
      category: 'Culture & Practical Tips',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      readTime: '8 min read',
      excerpt: 'Essential practical advice covering money exchange, local SIM cards, crossing the street, temple dress codes, and staying safe.',
      body: `Vietnam is widely recognized as one of the safest travel destinations in Asia. Violent crime is exceptionally rare, and the local population is genuinely welcoming. Here are the practical tips every traveler should know before landing.

### Currency & Payments
The currency is the Vietnamese Dong (VND). While credit cards are widely accepted at hotels, modern restaurants, and larger shops, cash remains king at street food stalls and local markets. ATMs are abundant in every city.

### Mobile Internet & eSIM
We recommend setting up an eSIM before you arrive, or purchasing a 4G/5G physical SIM at the airport arrival terminal. Providers like Viettel and Vinaphone offer fast coverage even in mountain valleys.

### Crossing the Street
Crossing the street in Hanoi or Saigon can feel daunting with streams of motorbikes. The secret is simple: walk at a slow, predictable, steady pace without stopping suddenly or running backwards. Motorbike drivers will smoothly steer around you.

### Temple Dress Code
When visiting temples, pagodas, and historical memorials, dress respectfully. Cover your shoulders and knees. Slip-on shoes are convenient as you will need to remove footwear before entering prayer halls.`,
      metaTitle: 'Vietnam Travel Tips: Practical Advice & Etiquette | Tranoi Travel',
      metaDescription: 'Practical tips for traveling in Vietnam: money, safety, SIM cards, and local etiquette.'
    });

    await Guide.create({
      title: 'How Many Days in Vietnam Do You Need? 1, 2, or 3-Week Breakdown',
      slug: 'how-many-days-in-vietnam',
      category: 'Planning & Essentials',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      readTime: '6 min read',
      excerpt: 'A realistic breakdown of what you can comfortably accomplish in 7 days, 10 to 14 days, or 3 weeks without exhausting yourself.',
      body: `Because Vietnam is long and narrow, planning your duration realistically makes the difference between an unforgettable holiday and an exhausting race between airports.

### 7 Days (1 Week)
Focus on a single geographic region. We strongly recommend Northern Vietnam: Hanoi, Ninh Binh, and Ha Long Bay. You will experience rich history, dramatic nature, and outstanding food without spending days in transit.

### 10 to 14 Days (The Classic Standard)
This allows for the classic north-to-south highlights. Spend 4 days in the north (Hanoi & Ha Long Bay), 4 to 5 days in central Vietnam (Hue & Hoi An), and 3 to 4 days in the south (Saigon & Mekong Delta).

### 21 Days (3 Weeks)
The gold standard for slow travel. In addition to the classic highlights, you can add mountain trekking in Sapa, world-class cave expeditions in Phong Nha, highland coffee estates in Da Lat, and a tranquil tropical beach finale in Phu Quoc.`,
      metaTitle: 'How Many Days in Vietnam Do You Need? Complete Guide | Tranoi Travel',
      metaDescription: 'Find out whether 7, 10, 14, or 21 days is right for your Vietnam vacation.'
    });

    await Guide.create({
      title: 'Getting Around Vietnam: Trains, Flights, Chauffeured Cars, and Cruises',
      slug: 'getting-around-vietnam',
      category: 'Planning & Essentials',
      country: 'vietnam',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      readTime: '5 min read',
      excerpt: 'How modern expressways, domestic flights, and private chauffeured transfers make traveling across Vietnam comfortable.',
      body: `Vietnam's transportation infrastructure has modernized dramatically over the past decade. Traveling between cities is now fast, reliable, and comfortable.

### Domestic Flights
For long distances (such as Hanoi to Hue, or Da Nang to Ho Chi Minh City), domestic flights on Vietnam Airlines or Bamboo Airways take just over an hour.

### Private Chauffeured Limousine Vans
For regional journeys like Hanoi to Ha Long Bay or Ninh Binh, private limousine vans equipped with plush leather reclining seats, Wi-Fi, and cold bottled water make the drive a relaxing pleasure.

### Scenic Coastal Drives
Certain routes should always be done by car. The famous Hai Van Pass between Hue and Da Nang offers one of the most stunning coastal drives in Asia.`,
      metaTitle: 'Getting Around Vietnam: Transport & Travel Options | Tranoi Travel',
      metaDescription: 'Learn the best ways to travel across Vietnam by private car, plane, and train.'
    });

    // 9. Signature Experiences (Sitemap Section 8 - 3 Differentiators)
    console.log('🌱 Seeding Signature Experiences (/experiences/)...');

    await SignatureExperience.create({
      title: 'What Partial-Guided Actually Feels Like: The Smart Way to Travel',
      slug: 'what-partial-guided-feels-like',
      subtitle: 'The perfect balance of expert cultural guidance and independent freedom.',
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Experience how our partial-guided format frees you from rigid group tours while keeping all the stress of logistics completely handled.',
      body: `Imagine waking up in your boutique hotel in Hoi An. There is no loud tour bus idling outside, and no megaphone calling you for an 07:00 AM headcount.

Instead, your morning starts at your leisure. At 09:00 AM, your private local guide meets you at the lobby for an intimate 3-hour walking exploration of hidden century-old merchant courtyards that tourists never find alone. By 12:30 PM, your guide leaves you with reservations at a secluded riverside courtyard restaurant.

The rest of the afternoon belongs to you. You can rent bicycles to ride along the emerald rice paddies, lounge by the pool, or have a dress tailored. If you need a recommendation for evening craft beer or an artisanal souvenir, a quick message to your Tranoi concierge on WhatsApp delivers an instant, trusted local suggestion.

That is the partial-guided difference: expert support when it matters most, absolute freedom when you want it.`
    });

    await SignatureExperience.create({
      title: 'Handpicked Local Insiders: Knowledgeable Friends, Not Tour Lecturers',
      slug: 'handpicked-local-insiders',
      subtitle: 'Meet the passionate storytellers, architects, and culinary historians who bring Vietnam alive.',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'We believe a great trip is defined by the people you meet along the way. Here is how we choose our guides.',
      body: `We do not employ generic tour conductors who recite memorized dates through loudspeakers. 

Our guides are licensed local insiders: architectural enthusiasts in Hanoi who can explain the subtle French and Vietnamese structural synthesis of each facade; home cooks in Hue whose families prepared delicacies for the royal court; and passionate naturalists in the national parks.

They treat you like a visiting friend, opening doors to private family workshops, introducing you to neighborhood noodle masters, and sharing honest, personal perspectives on life in contemporary Vietnam.`
    });

    await SignatureExperience.create({
      title: 'The Tranoi Care Promise: Unmatched On-Trip Peace of Mind',
      slug: 'the-tranoi-care-promise',
      subtitle: 'From the moment your plane touches down to your final departure, you are never alone.',
      heroImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Our 24/7 dedicated personal concierge support means seamless changes, instant help, and pure relaxation.',
      body: `Traveling in a foreign country should be thrilling, not stressful. The Tranoi Care Promise is our commitment that every detail of your journey is watched over by our on-the-ground operations team in Vietnam.

- **Direct WhatsApp Channel**: Before you depart, we invite you to a private WhatsApp thread with your dedicated tour coordinator.
- **Flight & Weather Monitoring**: If a domestic flight is delayed or weather shifts in Ha Long Bay, we reorganize transfers and hotel bookings proactively before you even realize a change was needed.
- **Vetted Safety & Cleanliness**: Every vehicle, boat, and hotel in our portfolio is personally inspected and certified to our strict comfort and safety standards.`
    });

    // 10. Customer Stories (Sitemap Section 9)
    console.log('🌱 Seeding Customer Stories (/customer-stories/)...');

    await CustomerStory.create({
      title: 'Two Unhurried Weeks from North to South: The Morrison Family Story',
      slug: 'the-morrison-family-14-days-vietnam',
      travelerName: 'David & Amanda Morrison',
      travelerLocation: 'Melbourne, Australia',
      tourSlug: '14-days-north-to-south-partial-guided',
      tourTitle: '14-Day Grand Vietnam North to South',
      tripDate: 'March 2026',
      formatTaken: 'partial-guided',
      rating: 5,
      travelerQuote: 'The partial-guided format was a revelation for our family. We had brilliant guides when we needed them, but we never felt trapped in a herd.',
      heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
      ]),
      body: `When planning our trip with our two teenagers, Amanda and I were wary of standard group tours. We wanted to experience Vietnam deeply, but we didn't want someone telling us what time we had to eat lunch every single day.

Tranoi Travel's 14-day partial-guided trip struck the exact balance. In Hanoi and Hue, our guide Linh showed us hidden street eateries and temples that we never would have discovered alone. But when we arrived in Hoi An, we had three glorious days to sleep in, ride bicycles through rice paddies, and lounge by the pool.

Whenever we needed a restaurant recommendation or wanted to book an impromptu boat ride, our concierge team on WhatsApp replied within minutes. It was the smoothest family holiday we have ever taken.`
    });

    await CustomerStory.create({
      title: 'Lanterns, Karsts, and Private Sunsets: Claire & Robert’s Honeymoon',
      slug: 'david-and-claire-honeymoon-escape',
      travelerName: 'Claire & Robert Vance',
      travelerLocation: 'San Francisco, CA',
      tourSlug: '10-days-vietnam-highlights-private',
      tourTitle: '10-Day Vietnam Highlights Private Tour',
      tripDate: 'February 2026',
      formatTaken: 'private',
      rating: 5,
      travelerQuote: 'From the private candlelit dinner on our Ha Long Bay cruise to our villa in Hoi An, every detail was pure magic.',
      heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
      ]),
      body: `For our honeymoon, Robert and I wanted romance, exceptional food, and zero logistical stress. Tranoi Travel designed a 10-day private itinerary that exceeded our highest expectations.

The highlight was definitely our overnight cruise in Lan Ha Bay. While hundreds of boats crowded the standard routes, our boutique ship anchored in a quiet lagoon where we watched the sunset in total tranquility. In Hoi An, our guide arranged a private lantern-making workshop with a third-generation craftsman. Tranoi made us feel like royalty at every step.`
    });

    // 11. Trip Reviews (Sitemap Section 10)
    console.log('🌱 Seeding Trip Reviews (/trip-reviews/)...');

    await Review.create({
      tourId: tour10Days.id,
      userId: demoUser.id,
      rating: 5,
      title: 'Seamless, beautiful, and completely stress-free',
      comment: 'We did the 10-Day Vietnam Highlights and were blown away by the level of service. The domestic flights and airport pickups worked like clockwork. Our guide in Hanoi was fantastic and the Ha Long Bay cruise was unforgettable.',
      status: 'approved'
    });

    await Review.create({
      tourId: tour7Days.id,
      userId: demoUser.id,
      rating: 5,
      title: 'The best way to see the North in one week',
      comment: 'Tranoi Travel proved that you do not need a month to see Vietnam properly. Ninh Binh and Ha Long Bay were breathtaking. Highly recommend the partial-guided option for independent travelers.',
      status: 'approved'
    });

    await Review.create({
      tourId: tour14Days.id,
      userId: demoUser.id,
      rating: 5,
      title: 'Incredible variety and perfect pacing',
      comment: 'Loved having guided mornings and free afternoons. Walking through Hoi An with the family and having Tranoi’s concierge team book our dinner reservations was top tier hospitality.',
      status: 'approved'
    });

    await Review.create({
      tourId: tour21Days.id,
      userId: demoUser.id,
      rating: 5,
      title: 'An unforgettable three-week journey',
      comment: 'From the mountains of Sapa to the peaceful beaches of Phu Quoc, this trip changed how we travel. Thank you to the whole Tranoi team for looking after us so warmly.',
      status: 'approved'
    });

    // 12. Settings
    console.log('🌱 Seeding Settings...');
    await Setting.create({ key: 'site_name', value: 'Tranoi Travel' });
    await Setting.create({ key: 'site_tagline', value: 'Travel more, plan less' });
    await Setting.create({ key: 'site_email', value: 'hello@tranoitravel.com' });
    await Setting.create({ key: 'site_phone', value: '+84 24 3999 8888' });
    await Setting.create({ key: 'site_address', value: 'Ba Dinh District, Hanoi, Vietnam' });

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

// Allow standalone execution
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
