const { sequelize, Role, User, Destination, Category, Tour, TourSchedule, TourImage, Booking, Coupon, Review, BlogCategory, Blog, Tag, Setting } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🔄 Syncing Database Tables...');
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
      name: 'Alex Vance (Admin)',
      email: 'admin@wanderlust.com',
      password: 'admin123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '+1 800-555-0199',
      address: '777 Travel Way, Suite 100, San Francisco, CA',
      bio: 'Lead Travel Director & Curator at Tranoi Travel with over 15 years of world exploration.'
    });

    const demoUser = await User.create({
      roleId: userRole.id,
      name: 'Sarah Jenkins',
      email: 'customer@wanderlust.com',
      password: 'user123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      phone: '+1 415-555-0144',
      address: '123 Pine St, San Jose, CA',
      bio: 'Avid hiker, photographer, and tropical paradise seeker.'
    });

    // 3. Destinations
    console.log('🌱 Seeding Destinations...');
    const destBali = await Destination.create({
      name: 'Bali, Indonesia',
      slug: 'bali-indonesia',
      description: 'Discover the Island of the Gods, renowned for iconic terraced rice fields, ancient volcanic peaks, pristine beaches, and vibrant spiritual culture.',
      banner: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Tegallalang Rice Terraces', 'Uluwatu Temple', 'Sacred Monkey Forest Sanctuary', 'Mount Batur Sunrise Hike']),
      travelGuide: 'Best visited between April and October during the dry season. Currency is Indonesian Rupiah (IDR). Lightweight cotton clothes and sun protection recommended.',
      weatherInfo: JSON.stringify({ avgTemp: '27°C - 31°C', rainySeason: 'Nov - Mar', drySeason: 'Apr - Oct' }),
      country: 'Indonesia',
      isPopular: true,
      metaTitle: 'Bali Travel Guide & Tours | WanderLust',
      metaDescription: 'Book unforgettable Bali tours with expert local guides, luxury villas, and authentic cultural experiences.'
    });

    const destSwiss = await Destination.create({
      name: 'Swiss Alps, Switzerland',
      slug: 'swiss-alps-switzerland',
      description: 'Experience majestic Alpine peaks, crystal-clear glacial lakes, world-class scenic railways, and enchanting mountain villages in the heart of Europe.',
      banner: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['The Matterhorn', 'Jungfraujoch Sphinx Observatory', 'Lake Geneva', 'Glacier Express Railway']),
      travelGuide: 'Ideal for summer trekking (June-Sept) and winter skiing (Dec-April). Swiss Franc (CHF) is the official currency.',
      weatherInfo: JSON.stringify({ avgTemp: '-2°C - 22°C', summer: 'June - Sept', winter: 'Dec - Mar' }),
      country: 'Switzerland',
      isPopular: true,
      metaTitle: 'Swiss Alps Hiking & Scenic Express Tours',
      metaDescription: 'Explore the Swiss Alps with luxury train rides, guided Alpine treks, and breathtaking mountain vistas.'
    });

    const destJapan = await Destination.create({
      name: 'Kyoto & Tokyo, Japan',
      slug: 'kyoto-tokyo-japan',
      description: 'Immerse yourself in Japan’s harmonious blend of ancient traditions, serene Zen gardens, historic Shinto shrines, and futuristic high-speed technology.',
      banner: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Golden Pavilion', 'Shinjuku Gyoen']),
      travelGuide: 'Spring (Cherry Blossoms - March/April) and Autumn (Foliage - October/November) are peak travel seasons.',
      weatherInfo: JSON.stringify({ avgTemp: '10°C - 28°C', spring: 'Mar - May', autumn: 'Sep - Nov' }),
      country: 'Japan',
      isPopular: true,
      metaTitle: 'Japan Heritage & Shinkansen Express Tours',
      metaDescription: 'Experience Kyoto shrines, Tokyo landmarks, and authentic tea ceremonies on our guided Japan tours.'
    });

    const destItaly = await Destination.create({
      name: 'Amalfi Coast, Italy',
      slug: 'amalfi-coast-italy',
      description: 'Sail along dramatic coastal cliffs, pastel-colored cliffside towns, fragrant lemon groves, and azure Mediterranean waters.',
      banner: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      ]),
      attractions: JSON.stringify(['Positano Town', 'Ravello Gardens', 'Path of the Gods', 'Capri Island Grottoes']),
      travelGuide: 'Best visited from May to September. Euro (EUR) is used. Perfect for yacht cruises and seafood lovers.',
      weatherInfo: JSON.stringify({ avgTemp: '18°C - 30°C', peakSeason: 'June - Aug' }),
      country: 'Italy',
      isPopular: true,
      metaTitle: 'Amalfi Coast Yacht & Cultural Tours',
      metaDescription: 'Sail Positano, Capri, and Ravello on an exclusive Italian coastal luxury getaway.'
    });

    // 4. Categories
    console.log('🌱 Seeding Categories...');
    const catAdventure = await Category.create({ name: 'Adventure & Trekking', slug: 'adventure-trekking', icon: 'bi bi-compass-fill', description: 'Thrilling outdoor expeditions and mountain hikes.' });
    const catCulture = await Category.create({ name: 'Cultural Heritage', slug: 'cultural-heritage', icon: 'bi bi-bank2', description: 'Immersive historical tours, temples, and local traditions.' });
    const catIsland = await Category.create({ name: 'Island & Beach Getaway', slug: 'island-beach', icon: 'bi bi-tsunami', description: 'Tropical beach relaxation and crystal turquoise water cruises.' });
    const catLuxury = await Category.create({ name: 'Luxury Yacht Cruise', slug: 'luxury-cruise', icon: 'bi bi-shield-shaded', description: 'Premium sailing, five-star resorts, and gourmet dining.' });

    // 5. Tours
    console.log('🌱 Seeding Tours...');
    const tourBali = await Tour.create({
      destinationId: destBali.id,
      categoryId: catIsland.id,
      name: 'Ultimate Bali Paradise & Cultural Wonders Expedition',
      slug: 'ultimate-bali-paradise-expedition',
      metaTitle: 'Ultimate 7-Day Bali Island Paradise Tour',
      metaDescription: 'Book an unforgettable 7-day tour in Bali including Ubud luxury resort, Mount Batur sunrise, and Uluwatu cliff sunset.',
      featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'Immerse yourself in Bali’s lush green jungles, sacred temples, private villa stays, and golden beach sunsets on this 7-day curated escape.',
      fullDescription: 'Our flagship Bali tour blends relaxation and adventure. Begin in Ubud surrounded by tranquil rice terraces, take an early morning jeep tour or sunrise hike up Mount Batur, visit sacred water temples, and finish with sunset cocktails at Uluwatu overlooking crashing waves.',
      highlights: JSON.stringify([
        'Sunrise Jeep Trek up Mount Batur Volcano',
        'Private Pool Villa stay in Ubud rainforest',
        'VIP entrance to Sacred Monkey Forest and Tirta Empul Holy Water Temple',
        'Sunset Kecak Fire Dance performance at Uluwatu Temple cliff',
        'Speedboat day tour to Nusa Penida Kelingking Beach'
      ]),
      duration: '7 Days / 6 Nights',
      durationDays: 7,
      departureLocation: 'Ngurah Rai International Airport (DPS), Bali',
      transportation: 'Private Air-Conditioned SUV & Luxury Speedboat',
      schedule: 'Daily Departures Guaranteed',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Bali & Ubud Jungle Check-in', description: 'VIP Airport transfer to your Ubud jungle resort. Evening welcome dinner with traditional Balinese dance performance.' },
        { day: 2, title: 'Ubud Rice Terraces & Sacred Water Temple', description: 'Visit Tegallalang Rice Terraces, experience the iconic jungle swing, and receive a traditional blessing at Tirta Empul.' },
        { day: 3, title: 'Mount Batur Volcano Sunrise & Hot Springs', description: 'Early morning 4WD jeep excursion to watch the sunrise over Mount Batur, followed by soaking in natural volcanic thermal hot springs.' },
        { day: 4, title: 'Nusa Penida Island Day Cruise', description: 'Speedboat cruise to Nusa Penida to marvel at Kelingking T-Rex Beach, Broken Beach, and snorkel with giant manta rays.' },
        { day: 5, title: 'Seminyak Beach & Spa Day', description: 'Transfer to Seminyak beachfront luxury hotel. Enjoy a complimentary 2-hour Balinese aromatherapy massage.' },
        { day: 6, title: 'Uluwatu Temple & Kecak Fire Dance', description: 'Afternoon cliffside tour of Uluwatu Temple, followed by the fiery sunset Kecak dance and Jimbaran seafood BBQ dinner.' },
        { day: 7, title: 'Souvenir Shopping & Farewell Departure', description: 'Leisurely morning breakfast, shopping at Ubud Art Market, and airport transfer.' }
      ]),
      includedServices: JSON.stringify([
        '6 Nights accommodation (4-star & 5-star luxury resorts)',
        'Daily breakfast, 4 lunches, and 3 special dinner experiences',
        'Private air-conditioned vehicle transfers throughout',
        'English-speaking certified expert local tour guide',
        'All temple entrance fees, speedboat tickets, and equipment'
      ]),
      excludedServices: JSON.stringify([
        'International airfare flights',
        'Personal expenses and souvenirs',
        'Travel insurance',
        'Gratuities for driver and guide'
      ]),
      price: 1299.00,
      discountPrice: 999.00,
      availableSlots: 15,
      meetingPoint: 'DPS Airport International Arrivals Hall (Gate 3)',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d505145.4746377759!2d115.0715767!3d-8.4095178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd141d3e8100ddd%3A0x2405b0d4e3084c46!2sBali%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      cancellationPolicy: 'Full refund if cancelled up to 14 days prior to departure. 50% refund for cancellations within 7-13 days.',
      faqs: JSON.stringify([
        { question: 'What is the physical difficulty level of this tour?', answer: 'Moderate. Most walking is gentle, though Mount Batur features a short early morning hike or optional 4WD jeep transport.' },
        { question: 'Are dietary requirements accommodated?', answer: 'Yes! Vegetarian, vegan, halal, and gluten-free meals are available upon request.' }
      ]),
      rating: 4.9,
      totalReviews: 28,
      isFeatured: true,
      isBestSeller: true,
      isPopular: true
    });

    const tourSwiss = await Tour.create({
      destinationId: destSwiss.id,
      categoryId: catAdventure.id,
      name: 'Grand Swiss Alps Alpine Express & Matterhorn Trek',
      slug: 'grand-swiss-alps-express-trek',
      metaTitle: 'Grand 6-Day Swiss Alps & Matterhorn Trekking Tour',
      metaDescription: 'Ride the Glacier Express, hike the Matterhorn trail, and stay in Alpine chalets on this 6-day Swiss adventure.',
      featuredImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'Soar through snow-capped peaks, ride the famous panoramic Glacier Express train, and gaze upon the iconic Matterhorn.',
      fullDescription: 'Discover the pinnacle of European mountain beauty. This 6-day journey takes you through Zurich, Lucerne, Zermatt, and Grindelwald with first-class Swiss Travel Pass passes included.',
      highlights: JSON.stringify([
        'First-Class Glacier Express panoramic train ride from St. Moritz to Zermatt',
        'Gornergrat cogwheel railway journey with direct Matterhorn views',
        'Jungfraujoch "Top of Europe" high-altitude ice palace tour',
        'Scenic mountain cable car rides and guided Alpine trail walks'
      ]),
      duration: '6 Days / 5 Nights',
      durationDays: 6,
      departureLocation: 'Zurich Main Station (HB), Switzerland',
      transportation: 'First-Class Swiss Railway & Panoramic Cable Cars',
      schedule: 'Every Monday & Thursday',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Zurich & Lucerne Lake Cruise', description: 'Meet your mountain guide in Zurich. Scenic train to Lucerne and evening sunset lake cruise.' },
        { day: 2, title: 'Grindelwald & Jungfraujoch Top of Europe', description: 'Ascend Jungfraujoch via Eiger Express cable car. Walk through the Sphinx observatory and ice tunnels.' },
        { day: 3, title: 'Glacier Express Scenic Train Journey', description: 'Board the world-famous panoramic train journey through snow gorges to Zermatt.' },
        { day: 4, title: 'Gornergrat Railway & Matterhorn Reflection Lakes', description: 'Ride cogwheel train to Gornergrat (3,089m) and hike around Riffelsee reflecting lake.' },
        { day: 5, title: 'Zermatt Village & Alpine Fondue Night', description: 'Explore car-free Zermatt village followed by a traditional Swiss cheese fondue dinner.' },
        { day: 6, title: 'Return to Zurich & Departure', description: 'Morning breakfast and first-class rail transfer back to Zurich Airport.' }
      ]),
      includedServices: JSON.stringify([
        '5 Nights in luxury mountain chalet boutique hotels',
        'First-Class 6-Day Swiss Travel Pass included',
        'Daily Swiss breakfast buffet & authentic Alpine fondue dinner',
        'Professional IFMGA mountain trekking guide'
      ]),
      excludedServices: JSON.stringify(['Flights to Zurich', 'Personal ski equipment rental']),
      price: 2450.00,
      discountPrice: 2199.00,
      availableSlots: 10,
      meetingPoint: 'Zurich Hauptbahnhof Information Desk',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1354388.948293998!2d7.4206263!3d46.818188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c650693072e0d%3A0x400c4737f9700b0!2sSwitzerland!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      cancellationPolicy: 'Free cancellation up to 30 days prior. 70% refund up to 14 days.',
      faqs: JSON.stringify([
        { question: 'Is warm clothing required?', answer: 'Yes! High altitude summits like Jungfraujoch are cold year-round.' }
      ]),
      rating: 5.0,
      totalReviews: 42,
      isFeatured: true,
      isBestSeller: true,
      isPopular: true
    });

    const tourJapan = await Tour.create({
      destinationId: destJapan.id,
      categoryId: catCulture.id,
      name: 'Kyoto Zen Temples & Tokyo Future Heritage Tour',
      slug: 'kyoto-zen-temples-tokyo-heritage',
      metaTitle: '8-Day Japan Cultural Heritage & Shinkansen Tour',
      metaDescription: 'Travel from Tokyo to Kyoto on the Shinkansen bullet train. Experience tea ceremonies, Geisha district, and Mount Fuji.',
      featuredImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'Journey through thousand-year-old wooden shrines, bamboo groves, bullet trains, and Tokyo high-tech neon districts.',
      fullDescription: 'An immersive 8-day Japanese adventure connecting the past and the future. Walk through 10,000 vermilion torii gates at Fushimi Inari, witness Mount Fuji from Lake Kawaguchiko, and taste Michelin-quality ramen.',
      highlights: JSON.stringify([
        'Shinkansen Bullet Train ride at 320 km/h',
        'Private Kimono fitting & authentic Matcha Tea Ceremony in Kyoto',
        'Mount Fuji 5th Station & Hakone Ropeway cable car',
        'Geisha district walking tour in Gion, Kyoto'
      ]),
      duration: '8 Days / 7 Nights',
      durationDays: 8,
      departureLocation: 'Haneda / Narita International Airport, Tokyo',
      transportation: '7-Day JR Shinkansen Bullet Train & Private Coach',
      schedule: 'Weekly Every Saturday',
      itinerary: JSON.stringify([
        { day: 1, title: 'Welcome to Tokyo & Shinjuku Skyscraper Tour', description: 'Arrival at Tokyo airport. Transfer to Ginza hotel and evening panoramic view from Tokyo Metropolitan Building.' },
        { day: 2, title: 'Asakusa Sensoji & Meiji Shrine', description: 'Visit Tokyo oldest temple Sensoji, walk Harajuku fashion street, and serene Meiji Shrine.' },
        { day: 3, title: 'Mount Fuji & Lake Kawaguchiko', description: 'Full day trip to Mount Fuji 5th station and scenic lake views.' },
        { day: 4, title: 'Shinkansen Bullet Train to Kyoto', description: 'Ride the bullet train to Kyoto. Check in to traditional Ryokan with natural hot springs (Onsen).' },
        { day: 5, title: 'Fushimi Inari & Arashiyama Bamboo Grove', description: 'Early walk through Fushimi Inari torii gates and Arashiyama bamboo forest.' },
        { day: 6, title: 'Kinkaku-ji Golden Pavilion & Gion', description: 'Visit Golden Temple Kinkaku-ji and evening Gion Geisha district walk.' },
        { day: 7, title: 'Nara Deer Park & Todai-ji Great Buddha', description: 'Excursion to Nara to feed friendly sacred deer and see giant bronze Buddha.' },
        { day: 8, title: 'Sayonara Japan Departure', description: 'Kansai Airport transfer or return Shinkansen to Tokyo.' }
      ]),
      includedServices: JSON.stringify([
        '7 Nights accommodation (including 1 night traditional Ryokan with Onsen)',
        '7-Day JR Pass First Class Ordinary Seat',
        'Daily breakfast & Kaiseki multi-course dinner at Ryokan',
        'English-speaking licensed Japanese tour guide'
      ]),
      excludedServices: JSON.stringify(['International flights', 'Personal shopping']),
      price: 2899.00,
      discountPrice: 2499.00,
      availableSlots: 12,
      meetingPoint: 'Tokyo Haneda Airport Arrivals Terminal 3',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d419356.1264426577!2d135.5186638!3d35.0116363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001a8d6705574f1%3A0x2a0d1645e7f10b7!2sKyoto%2C%20Japan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      cancellationPolicy: 'Full refund 21 days prior to departure.',
      faqs: JSON.stringify([
        { question: 'Is Japan easy to travel for non-Japanese speakers?', answer: 'Yes! Your dedicated guide accompanies you on all tours and transport.' }
      ]),
      rating: 4.95,
      totalReviews: 35,
      isFeatured: true,
      isBestSeller: false,
      isPopular: true
    });

    const tourItaly = await Tour.create({
      destinationId: destItaly.id,
      categoryId: catLuxury.id,
      name: 'Amalfi Coast Riviera Yacht & Positano Luxury Escape',
      slug: 'amalfi-coast-yacht-positano-escape',
      metaTitle: '5-Day Amalfi Coast Yacht & Positano Luxury Tour',
      metaDescription: 'Sail Positano, Ravello, and Capri on a 5-day luxury yacht trip in Italy.',
      featuredImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      ]),
      shortDescription: 'Sail along cliffside villages, taste lemon granita in Positano, and explore Capri Blue Grotto by private yacht.',
      fullDescription: 'Indulge in Italian coastal perfection. Experience 5 star cliffside luxury hotels in Ravello, private yacht charter along Capri island, and private wine tasting tours.',
      highlights: JSON.stringify([
        'Full-Day Private Catamaran Yacht Charter around Capri Island',
        'Cliffside luxury hotel stay in Positano with ocean view balcony',
        'Private Limoncello workshop & organic vineyard wine tasting',
        'Guided hike along the famous Path of the Gods'
      ]),
      duration: '5 Days / 4 Nights',
      durationDays: 5,
      departureLocation: 'Naples Airport (NAP) / Salerno Port',
      transportation: 'Private Mercedes Van & Private Motor Yacht',
      schedule: 'Departs Daily May - October',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Naples & Transfer to Positano', description: 'Private transfer from Naples to Positano cliffside luxury hotel.' },
        { day: 2, title: 'Private Yacht Cruise to Capri & Blue Grotto', description: 'Full day sailing around Capri with swimming stops and Blue Grotto visit.' },
        { day: 3, title: 'Path of the Gods Hike & Ravello Gardens', description: 'Morning cliffside trek followed by concert in Ravello Villa Rufolo gardens.' },
        { day: 4, title: 'Limoncello Workshop & Seafood Masterclass', description: 'Taste fresh pasta and make authentic Italian limoncello.' },
        { day: 5, title: 'Farewell Naples Departure', description: 'Morning breakfast and transfer back to Naples.' }
      ]),
      includedServices: JSON.stringify(['4 Nights in 5-star Positano resort', 'Private Yacht Charter with captain', 'All meals & wine pairings']),
      excludedServices: JSON.stringify(['Flights to Naples']),
      price: 3200.00,
      discountPrice: 2799.00,
      availableSlots: 8,
      meetingPoint: 'Naples Capodichino Airport Arrivals Hall',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.914770112!2d14.3644!3d40.6281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b97772d137b01%3A0xb00e40aa883832c!2sAmalfi%20Coast!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      cancellationPolicy: 'Refund up to 30 days prior.',
      faqs: JSON.stringify([{ question: 'Is swimming experience required for yacht tour?', answer: 'No, life jackets and professional crew are provided.' }]),
      rating: 4.98,
      totalReviews: 19,
      isFeatured: true,
      isBestSeller: false,
      isPopular: true
    });

    // 6. Tour Schedules
    console.log('🌱 Seeding Tour Schedules...');
    const dates = ['2026-08-15', '2026-09-01', '2026-09-20', '2026-10-05', '2026-11-12'];
    for (const d of dates) {
      await TourSchedule.create({ tourId: tourBali.id, departureDate: d, availableSlots: 15, status: 'open' });
      await TourSchedule.create({ tourId: tourSwiss.id, departureDate: d, availableSlots: 10, status: 'open' });
      await TourSchedule.create({ tourId: tourJapan.id, departureDate: d, availableSlots: 12, status: 'open' });
      await TourSchedule.create({ tourId: tourItaly.id, departureDate: d, availableSlots: 8, status: 'open' });
    }

    // 7. Tour Images
    console.log('🌱 Seeding Tour Images...');
    await TourImage.create({ tourId: tourBali.id, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', isFeatured: true });
    await TourImage.create({ tourId: tourSwiss.id, imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', isFeatured: true });

    // 8. Coupons
    console.log('🌱 Seeding Coupons...');
    await Coupon.create({
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10.00,
      minBookingAmount: 500.00,
      expiresAt: '2027-12-31',
      isActive: true
    });

    await Coupon.create({
      code: 'SUMMER100',
      discountType: 'fixed',
      discountValue: 100.00,
      minBookingAmount: 1000.00,
      expiresAt: '2027-12-31',
      isActive: true
    });

    // 9. Blog Categories, Tags, and Blogs
    console.log('🌱 Seeding Travel Blog System...');
    const blogCatGuide = await BlogCategory.create({ name: 'Travel Guides', slug: 'travel-guides' });
    const blogCatTips = await BlogCategory.create({ name: 'Travel Tips & Packing', slug: 'travel-tips' });

    const tag1 = await Tag.create({ name: 'Bali', slug: 'bali' });
    const tag2 = await Tag.create({ name: 'Hiking', slug: 'hiking' });

    const blog1 = await Blog.create({
      categoryId: blogCatGuide.id,
      authorId: adminUser.id,
      title: 'Top 10 Hidden Gem Destinations to Visit in Bali for 2026',
      slug: 'top-10-hidden-gems-bali-2026',
      featuredImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Beyond Ubud and Kuta lie untouched waterfalls, secret black sand beaches, and peaceful mountain villages. Here is our expert guide to secret Bali.',
      content: '<p>Bali remains one of the world most magical island destinations. While popular tourist hubs like Seminyak and Ubud draw millions of visitors, those willing to venture slightly off the beaten track will be rewarded with untouched natural splendor.</p><h2>1. Sekumpul Waterfall</h2><p>Located in northern Bali, Sekumpul is widely considered the island most majestic waterfall cluster. Nestled inside a lush jungle ravine, seven tall cascades plummet dramatically into freshwater pools.</p><h2>2. Amed Black Sand Beach</h2><p>For serene diving and snorkeling away from crowds, head east to Amed. Frame by Mount Agung, Amed offers calm waters, vibrant coral gardens, and historic shipwrecks.</p>',
      metaTitle: 'Top 10 Hidden Gem Destinations in Bali 2026 Guide',
      metaDescription: 'Discover secret Bali waterfalls, tranquil black sand beaches, and mountain villages with WanderLust travel guide.',
      isPublished: true,
      viewsCount: 342
    });

    await blog1.addTags([tag1]);

    // 10. Reviews
    console.log('🌱 Seeding Reviews...');
    await Review.create({
      tourId: tourBali.id,
      userId: demoUser.id,
      rating: 5,
      title: 'Unforgettable Vacation of a Lifetime!',
      comment: 'The Bali Paradise tour exceeded all our expectations! The Mount Batur jeep sunrise was breathtaking and our guide Putu made us feel like family. 10/10 service!',
      status: 'approved'
    });

    await Review.create({
      tourId: tourSwiss.id,
      userId: demoUser.id,
      rating: 5,
      title: 'First-Class Alpine Experience!',
      comment: 'Glacier Express view was astonishing. Everything from train tickets to chalet stays was seamlessly organized by WanderLust.',
      status: 'approved'
    });

    // 11. System Settings
    console.log('🌱 Seeding System Settings...');
    await Setting.create({ key: 'site_name', value: 'Tranoi Travel', group: 'general' });
    await Setting.create({ key: 'site_email', value: 'support@tranoitravel.com', group: 'general' });
    await Setting.create({ key: 'site_phone', value: '+1 (800) 555-TRANOI', group: 'general' });
    await Setting.create({ key: 'currency', value: 'USD', group: 'general' });

    console.log('🎉 DB Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
