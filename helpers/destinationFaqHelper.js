/**
 * Destination FAQ Helper
 * Supplies authentic, destination-specific traveler FAQs for all 17 Vietnam destinations.
 * 
 * Rules:
 * - Does NOT duplicate site-wide generic FAQs (/faq/ handles general visas, booking, payments, etc.)
 * - Focuses on real, recurring questions from travelers specific to that destination:
 *   duration, transport/getting around, signature food, seasonal timing, dress codes, pacing, family/elderly suitability.
 */

const CURATED_FAQS = {
  'hanoi': [
    {
      question: 'How many days should I plan to explore Hanoi comfortably?',
      answer: 'We recommend 2 to 3 full days. This allows you to explore the 36 Old Quarter guild streets and French Quarter on foot, visit key cultural landmarks (Temple of Literature, Hoan Kiem Lake, Opera House), sample legendary street food, and relax in hidden courtyard cafes without feeling rushed.'
    },
    {
      question: 'Is it safe to cross the street in Hanoi with all the motorbikes?',
      answer: 'Yes, it is very safe once you follow local pedestrian rhythm: walk at a slow, predictable, steady pace without making sudden stops or running backwards. Motorbike drivers anticipate your trajectory and will smoothly steer around you. You can also follow local elders when crossing busy intersections.'
    },
    {
      question: 'What authentic Hanoi dishes and street food should I not miss?',
      answer: 'Beyond traditional Phở Bò, do not miss Bún Chả (chargrilled pork patties in dipping broth with vermicelli, celebrated by Anthony Bourdain & Obama), Chả Cá Lã Vọng (turmeric dill fish sizzled at your table), Bánh Cuốn (steamed rice rolls with minced pork), and creamy Giảng Cafe Egg Coffee.'
    },
    {
      question: 'What is the best way to get around Hanoi: walking, Grab, or private car?',
      answer: 'The Old Quarter and French Quarter are best discovered on foot or by electric buggy for pedestrian lanes. For longer hops between West Lake or museums, Grab ride-hailing (car or scooter) is cheap, reliable, and transparent. For day trips to nearby provinces, a private chauffeured limousine is recommended.'
    },
    {
      question: 'Can I take easy day trips from Hanoi to Ninh Binh or Ha Long Bay?',
      answer: 'Yes! With modern expressways, Ninh Binh is only 1.5 to 2 hours away, making it an easy day trip or overnight journey. Ha Long Bay is approximately 2 to 2.5 hours via private limousine van. We recommend at least 1 overnight on Ha Long Bay for the best experience.'
    },
    {
      question: 'What dress codes apply when visiting temples and mausoleums in Hanoi?',
      answer: 'Modest attire covering shoulders and knees is strictly enforced at the Ho Chi Minh Mausoleum, Temple of Literature, and ancient pagodas like Trấn Quốc. Slip-on shoes are convenient as you will remove footwear before stepping into prayer halls.'
    }
  ],

  'ha-long-bay': [
    {
      question: 'Should I choose a day cruise or an overnight cruise in Ha Long Bay?',
      answer: 'We strongly recommend an overnight cruise (2 days / 1 night or 3 days / 2 nights). Day cruises only visit crowded near-shore routes, whereas overnight boutique vessels cruise further out to serene Lan Ha Bay and Bai Tu Long Bay where limestone karsts rise quietly out of emerald waters at sunrise and sunset.'
    },
    {
      question: 'What is the difference between Ha Long Bay, Lan Ha Bay, and Bai Tu Long Bay?',
      answer: 'All three share the identical surreal karst landscape. Ha Long Bay is the traditional UNESCO core with the largest caves, while Lan Ha Bay (south) and Bai Tu Long Bay (northeast) are significantly more tranquil, featuring secluded swimming lagoons, floating fishing villages, and pristine kayaking grottos.'
    },
    {
      question: 'What happens if tropical storms or bad weather affect sailing permits?',
      answer: 'The maritime port authority assesses safety daily at 06:00 AM. If sailing permits are withheld due to typhoon warnings, Tranoi Travel immediately activates backup land arrangements, private transfers, or boutique hotel accommodations in nearby Ninh Binh or Hanoi with transparent refunds.'
    },
    {
      question: 'Is sea kayaking included and safe for beginners?',
      answer: 'Yes! All quality cruises include guided sea kayaking or bamboo sampans rowed by local fishermen through arched karst caves (like Dark & Bright Cave). Waters inside the enclosed bays are generally placid and life jackets are mandatory.'
    },
    {
      question: 'How long does it take to travel from Hanoi to Ha Long Bay?',
      answer: 'Via the modern Hanoi – Hai Phong – Ha Long expressway, the drive takes only 2 to 2.5 hours. All our tours use private luxury limousine vans with plush reclining seats, Wi-Fi, and cold bottled water.'
    }
  ],

  'hoi-an': [
    {
      question: 'How many days should I spend in Hoi An?',
      answer: 'We recommend 2 to 3 days. Spend one day discovering the UNESCO ancient merchant houses and evening lantern market, half a day cycling to Trà Quế organic village and An Bàng beach, and one day taking an artisan cooking class or visiting the ancient Mỹ Sơn Cham Sanctuary.'
    },
    {
      question: 'How fast can I get custom tailored clothes made in Hoi An?',
      answer: 'Hoi An is Southeast Asia’s custom tailoring capital. Skilled tailors can craft custom suits, dresses, linen shirts, and winter coats within 24 to 48 hours with 1 to 2 fitting sessions. We recommend visiting your tailor on your first morning so adjustments can be made before departure.'
    },
    {
      question: 'When is the monthly Hoi An Lantern Festival held?',
      answer: 'The Lantern Festival occurs on the 14th night of every lunar month (full moon). The ancient town turns off motorized vehicles and fluorescent lights, illuminating old wooden shop-houses entirely with glowing silk lanterns while floating candle boats dot the Thu Bồn River.'
    },
    {
      question: 'What unique local dishes are found only in Hoi An?',
      answer: 'Cao Lầu (chewy noodles made with water drawn from ancient Cham wells, pork char siu, and crispy croutons), White Rose dumplings (Bánh Bao Bánh Vạc), Cơm Gà Hội An (shredded turmeric chicken rice), and Bánh Mì Phượng.'
    },
    {
      question: 'Can I travel between Hoi An, Da Nang, and Hue in one scenic day?',
      answer: 'Yes! The coastal drive between Hoi An and Hue crosses the legendary Hải Vân Pass (Ocean Cloud Pass) with breathtaking panoramic views of Lăng Cô Bay and coastal peninsulas. It takes around 3.5 to 4 hours with photo stops.'
    }
  ],

  'da-nang': [
    {
      question: 'What are the must-see highlights in Da Nang?',
      answer: 'Key highlights include the Golden Hand Bridge at Bà Nà Hills, the Marble Mountains (Ngũ Hành Sơn) with ancient cave shrines, the Dragon Bridge (which breathes fire and water on weekend evenings at 09:00 PM), and pristine swimming along Mỹ Khê Beach.'
    },
    {
      question: 'Is Da Nang better as a base than Hoi An?',
      answer: 'Da Nang is just 30 minutes from Hoi An and offers high-end beachfront international resorts (Four Seasons, InterContinental, Hyatt), a modern culinary scene, and an international airport (DAD). Many travelers spend 2 nights in Hoi An for heritage charm and 2 nights in Da Nang for coastal relaxation.'
    },
    {
      question: 'When is the best season for beach swimming in Da Nang?',
      answer: 'March through August offers warm, sunny skies and calm, turquoise waters at Mỹ Khê Beach. From late September to November, central Vietnam experiences higher rainfall and larger ocean swells.'
    },
    {
      question: 'How easy is it to get from Da Nang airport to the city center and Hoi An?',
      answer: 'Da Nang International Airport (DAD) is located directly inside the city, just 10 minutes from downtown hotels and 35 to 40 minutes from Hoi An Ancient Town by private chauffeured transfer.'
    }
  ],

  'ninh-binh': [
    {
      question: 'Why is Ninh Binh called "Ha Long Bay on Land"?',
      answer: 'Ninh Binh features thousands of towering limestone karst peaks rising vertically out of emerald green rice paddies and winding rivers rather than the sea. Gliding through dramatic caves on hand-rowed wooden sampans at Tràng An offers an unforgettable, peaceful landscape.'
    },
    {
      question: 'Tràng An vs Tam Cốc: Which boat route should I choose?',
      answer: 'Tràng An is a UNESCO World Heritage site with cleaner, organized infrastructure, deeper river loops through 4–9 natural caves, and ancient mountain temples. Tam Cốc is scenic with rice paddies hugging both riverbanks, reaching peak golden beauty in late May and early June.'
    },
    {
      question: 'How difficult is the climb at Múa Cave (Hang Múa)?',
      answer: 'The climb consists of approximately 500 zigzag stone steps up the dragon ridge. It takes 20 to 25 minutes of steady climbing and rewards you with the most breathtaking 360-degree panoramic view of Tam Cốc’s winding river and karst valleys anywhere in Vietnam.'
    },
    {
      question: 'How many days are recommended for Ninh Binh?',
      answer: 'While many do a day trip from Hanoi, spending 2 days and 1 night at a boutique eco-lodge nestled beneath karst cliffs allows you to experience peaceful morning boat rides before tour buses arrive and cycle through rural farming hamlets at dusk.'
    }
  ],

  'sapa': [
    {
      question: 'What is the best way to travel from Hanoi to Sapa?',
      answer: 'You can choose between an overnight luxury sleeper train (arriving into Lào Cai followed by a 45-minute mountain drive) or a private chauffeured limousine van via the Nội Bài – Lào Cai expressway in about 5 to 5.5 hours.'
    },
    {
      question: 'When are Sapa’s iconic rice terraces green vs golden yellow?',
      answer: 'Sapa’s terraced fields are flooded and mirror-like in May (watering season), lush emerald green throughout June to August, and turn a spectacular golden yellow during harvest season in September and early October. Winter (December–February) can be crisp with misty mountain fog.'
    },
    {
      question: 'What should I pack for trekking through Sapa’s ethnic villages?',
      answer: 'Sturdy hiking shoes or trail sneakers with good grip, lightweight breathable layers for uphill walking, a warm fleece or windproof jacket for evenings (temperatures drop significantly in the mountains), and cash for supporting ethnic Black Hmong and Red Dao handicraft artisans.'
    },
    {
      question: 'Is the Fansipan cable car suitable for all ages?',
      answer: 'Yes! The Sun World Fansipan Legend cable car holds Guinness World Records and whisks travelers from the valley up to 3,143m in just 15 minutes, with funicular options to the summit, making the "Roof of Indochina" accessible to children and seniors alike.'
    }
  ],

  'hue': [
    {
      question: 'What makes Hue unique compared to Hanoi and Hoi An?',
      answer: 'Hue was the imperial capital of the Nguyễn Dynasty from 1802 to 1945. It is Vietnam’s royal soul, featuring the majestic Imperial Citadel, elaborate royal tombs hidden among pine forests, tranquil garden houses, and a sophisticated royal court cuisine.'
    },
    {
      question: 'Which royal tombs are most worth visiting in Hue?',
      answer: 'Tự Đức Tomb is celebrated for poetic lakes, wooden pavilions, and serene gardens. Khải Định Tomb features an awe-inspiring fusion of Vietnamese and European mosaic glass and porcelain art. Minh Mạng Tomb represents classical Confucian symmetry.'
    },
    {
      question: 'What signature royal dishes should I taste in Hue?',
      answer: 'Hue is the culinary capital of central Vietnam. Must-tries include Bún Bò Huế (spicy lemongrass beef noodle soup), Bánh Bèo, Bánh Nậm, Bánh Lọc (delicate steamed rice cakes with shrimp), and a private multi-course royal banquet inside a restored historic garden house.'
    },
    {
      question: 'How much time is recommended in Hue?',
      answer: '1.5 to 2 days is the sweet spot. One full day is dedicated to the Citadel and royal tombs with a sunset Perfume River dragon boat cruise, and another morning for Thien Mu Pagoda and Dong Ba Market before driving over the Hai Van Pass.'
    }
  ],

  'ho-chi-minh-city': [
    {
      question: 'How many days should I spend in Ho Chi Minh City (Saigon)?',
      answer: 'We recommend 2 to 3 days. This provides ample time to explore French colonial landmarks (Notre-Dame Cathedral, Central Post Office, Opera House), visit the War Remnants Museum, take a half-day trip to the Củ Chi Tunnels, and enjoy vibrant evening food tours by vintage Vespa.'
    },
    {
      question: 'Củ Chi Tunnels: Ben Dinh vs Ben Duoc — which is better?',
      answer: 'Bến Đình is closer (1.5 hours) and frequented by large tour buses. Bến Dược is slightly further (2 hours) but offers a much more authentic, respectful, and peaceful experience with genuine original tunnel systems preserved inside lush forested grounds.'
    },
    {
      question: 'What is the best way to experience Saigon’s street food and nightlife?',
      answer: 'An evening vintage Vespa or scooter foodie tour led by licensed local drivers is the ultimate way to explore hidden alleyway eateries, rooftop jazz spots, and sample authentic Saigon dishes like Bánh Xèo, Cơm Tấm (broken rice), and grilled seafood.'
    },
    {
      question: 'Is Ho Chi Minh City safe for walking at night?',
      answer: 'Yes, central districts (District 1 and District 3) are lively and safe late into the night. As in any large metropolis, keep valuables and mobile phones secure near busy roads to prevent drive-by snatching, and use metered Vinasun / Mai Linh taxis or Grab.'
    }
  ],

  'phu-quoc': [
    {
      question: 'When is the best season to visit Phu Quoc for clear, calm waters?',
      answer: 'November through April is the dry season in Phu Quoc, offering calm turquoise waters, clear blue skies, and gentle breezes ideal for snorkeling, boat charters, and lounging at private pool villas. May to October brings tropical green season showers, usually clearing by late afternoon.'
    },
    {
      question: 'What are the top beaches and experiences on the island?',
      answer: 'Sao Beach and Khem Beach boast powdery white sands and calm waters. The Hòn Thơm island-hopping cable car offers sweeping sea views, while An Thới archipelago in the south is renowned for coral reef snorkeling and sunset yacht cruises.'
    },
    {
      question: 'Do international visitors need a visa to visit Phu Quoc?',
      answer: 'Phu Quoc has a special 30-day visa exemption for international visitors arriving directly by air or sea and staying exclusively on the island. However, if you plan to visit mainland Vietnam (Hanoi, Saigon, Da Nang) during your trip, standard Vietnam e-Visa rules apply.'
    }
  ],

  'mekong-delta': [
    {
      question: 'What is the difference between a day trip to Ben Tre vs an overnight in Can Tho?',
      answer: 'A day trip from Saigon to Bến Tre (2 hours) focuses on quiet nipa palm canals, coconut candy workshops, and cycling orchard pathways. An overnight in Cần Thơ (3.5 hours) allows you to experience the famous Cái Răng floating market at sunrise (06:00–07:30 AM) when hundreds of wooden boats trade fresh produce on the river.'
    },
    {
      question: 'What is the best time of year to visit the Mekong Delta?',
      answer: 'The Delta is lush and welcoming year-round. September to November is the high-water ("floating season") when water lilies blossom and bird sanctuaries flourish. May to August is the fruit harvest season when orchard branches are heavy with rambutan, mangoes, and durian.'
    },
    {
      question: 'Can I travel overland from the Mekong Delta directly to Cambodia?',
      answer: 'Yes! From Châu Đốc in the upper Mekong Delta, daily high-speed speedboats cruise up the Mekong River directly to Phnom Penh, Cambodia in about 4.5 hours with border immigration handled smoothly at the river checkpoint.'
    }
  ],

  'phong-nha': [
    {
      question: 'Why is Phong Nha world-famous among travelers?',
      answer: 'Phong Nha – Kẻ Bàng National Park is a UNESCO World Heritage site known as the "Caving Capital of the World", home to Sơn Đoòng (the largest cave on Earth), Paradise Cave (Thiên Đường), and vast underground rivers beneath ancient jungle karsts.'
    },
    {
      question: 'Are there cave tours suitable for non-hikers and families?',
      answer: 'Yes! Paradise Cave and Phong Nha Cave feature wooden boardwalks, well-lit pathways, and dragon boat access that require only gentle walking without strenuous climbing or caving gear, making them completely accessible for all ages.'
    },
    {
      question: 'How do I get to Phong Nha from Hanoi or Hue?',
      answer: 'The closest airport and railway hub is Đồng Hới (VDH), just 45 minutes by private transfer from Phong Nha village. Daily 1-hour domestic flights connect Đồng Hới with Hanoi and Ho Chi Minh City, or you can take a scenic 3.5-hour private transfer from Hue.'
    }
  ],

  'ha-giang': [
    {
      question: 'How many days do I need for the Ha Giang Loop?',
      answer: 'We recommend at least 3 days and 2 nights, or ideally 4 days and 3 nights for a leisurely pace. This gives you ample time to marvel at the Mã Pí Lèng Pass, boat through the deep Nho Quế River gorge, and visit remote Hmong stone villages without exhausting road days.'
    },
    {
      question: 'Can I do the Ha Giang Loop comfortably in a private car instead of a motorbike?',
      answer: 'Absolutely! For travelers who prefer comfort and safety over motorbikes, our private chauffeured 4WD SUVs and luxury vans navigate the entire loop smoothly, with dedicated local guides stopping at every dramatic cliffside viewpoint.'
    },
    {
      question: 'When is the best season to visit Ha Giang?',
      answer: 'October to November is famous for pink Buckwheat flowers (Tam Giác Mạch) blooming across karst valleys. September offers golden terraced rice harvest in Hoàng Su Phì, while spring (February–March) brings cherry and plum blossoms.'
    }
  ]
};

/**
 * Generate intelligent destination-specific fallback FAQs for destinations
 * that do not have explicit hardcoded entries in CURATED_FAQS.
 */
function generateDynamicFaqs(destination, relatedDestList = []) {
  const name = destination.name;
  const region = destination.region ? destination.region.toLowerCase() : 'vietnam';
  const relatedNames = relatedDestList.map(r => r.name).filter(n => n !== name).slice(0, 2);

  const faqs = [
    {
      question: `How many days should I plan for visiting ${name}?`,
      answer: `Most travelers find that 2 to 3 days in ${name} offers the ideal pace. This allows you to explore signature cultural landmarks, indulge in authentic regional dining, and discover hidden corners without having to rush through your itinerary.`
    },
    {
      question: `What is the best way to get around ${name} comfortably?`,
      answer: destination.gettingThere || `For central sightseeing in ${name}, walking and local ride-hailing are convenient. For excursions to surrounding scenic valleys or coastal spots, a private chauffeured vehicle with a dedicated local guide ensures effortless transfers and insider knowledge.`
    },
    {
      question: `When is the best time of year to visit ${name}?`,
      answer: destination.bestTimeNote || `${name} offers great travel experiences year-round. Visiting during dry, sunny months provides comfortable temperatures for outdoor exploration, temple visits, and scenic photography.`
    },
    {
      question: `What signature local dishes should I try in ${name}?`,
      answer: `${name} boasts unique regional specialties that reflect the rich food culture of ${region} Vietnam. We recommend sampling local market specialties, regional noodles, and fresh farm-to-table produce at reputable local eateries.`
    },
    {
      question: `Is ${name} suitable for family travelers with children or seniors?`,
      answer: `Yes, ${name} is very welcoming for family groups. Our tailored itineraries include gentle pacing, comfortable private limousine transfers, and handpicked boutique accommodations with modern amenities to ensure travelers of all ages stay relaxed.`
    }
  ];

  if (relatedNames.length > 0) {
    faqs.push({
      question: `Can I easily combine ${name} with other destinations on the same trip?`,
      answer: `Yes! ${name} pairs seamlessly with nearby highlights like ${relatedNames.join(' and ')}. Our private cross-country routes link these destinations with smooth chauffeured transfers or short domestic flights.`
    });
  }

  return faqs;
}

/**
 * Main function to get FAQs for a destination
 * Priority:
 * 1. destination.faqs (if stored as custom JSON in DB)
 * 2. CURATED_FAQS[slug]
 * 3. generateDynamicFaqs(destination, relatedDestList)
 */
function getDestinationFaqs(destination, relatedDestList = []) {
  if (!destination) return [];

  // 1. Check if destination has custom JSON faqs in database
  if (destination.faqs) {
    try {
      const parsed = typeof destination.faqs === 'string' ? JSON.parse(destination.faqs) : destination.faqs;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Could not parse destination.faqs JSON for', destination.slug);
    }
  }

  // 2. Check curated dictionary
  const slug = (destination.slug || '').toLowerCase().trim();
  if (CURATED_FAQS[slug] && CURATED_FAQS[slug].length > 0) {
    return CURATED_FAQS[slug];
  }

  // 3. Fallback: intelligent dynamic generator
  return generateDynamicFaqs(destination, relatedDestList);
}

module.exports = {
  getDestinationFaqs,
  CURATED_FAQS
};
