import { storage } from "../server/storage";
import { type InsertAuthor, type InsertCategory, type InsertPost, type InsertTag, type InsertPostTag } from "../shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // Create authors
  console.log("Creating authors...");
  const authors = [
    {
      username: "kelly.slater",
      password: "password123", // In a real app, this would be hashed
      name: "Kelly Slater",
      bio: "11-time World Surf League Champion with a passion for sustainable surfing and ocean conservation.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "admin",
      socialTwitter: "kellyslater",
      socialInstagram: "kellyslater",
    },
    {
      username: "maya.gabeira",
      password: "password123",
      name: "Maya Gabeira",
      bio: "Brazilian big wave surfer and Guinness World Record holder for the largest wave ever surfed by a woman.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "author",
      socialInstagram: "maya",
    },
    {
      username: "john.florence",
      password: "password123",
      name: "John John Florence",
      bio: "Two-time World Surf League Champion known for his progressive aerial maneuvers and dynamic style.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      role: "author",
      socialInstagram: "john.john.florence",
      socialYoutube: "johnjohnflorencesurf"
    }
  ] as InsertAuthor[];

  const createdAuthors = [];
  for (const author of authors) {
    const createdAuthor = await storage.createAuthor(author);
    createdAuthors.push(createdAuthor);
    console.log(`Created author: ${createdAuthor.name}`);
  }

  // Create categories
  console.log("Creating categories...");
  const categories = [
    {
      name: "Surf Techniques",
      slug: "surf-techniques",
      description: "Tips, tutorials, and guides to improve your surfing skills.",
    },
    {
      name: "Destinations",
      slug: "destinations",
      description: "Discover the world's best surf spots and travel guides.",
    },
    {
      name: "Equipment",
      slug: "equipment",
      description: "Reviews and advice on surfboards, wetsuits, and accessories.",
    },
    {
      name: "Stories",
      slug: "stories",
      description: "Personal experiences, interviews, and surf culture.",
    },
    {
      name: "Environment",
      slug: "environment",
      description: "Ocean conservation, sustainability, and the impact of climate change on surf conditions.",
    }
  ] as InsertCategory[];

  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await storage.createCategory(category);
    createdCategories.push(createdCategory);
    console.log(`Created category: ${createdCategory.name}`);
  }

  // Create tags
  console.log("Creating tags...");
  const tags = [
    { name: "Beginner", slug: "beginner" },
    { name: "Advanced", slug: "advanced" },
    { name: "Safety", slug: "safety" },
    { name: "Shortboard", slug: "shortboard" },
    { name: "Longboard", slug: "longboard" },
    { name: "Big Wave", slug: "big-wave" },
    { name: "Travel", slug: "travel" },
    { name: "Competition", slug: "competition" },
    { name: "Sustainable", slug: "sustainable" },
    { name: "Training", slug: "training" },
    { name: "Gear", slug: "gear" },
    { name: "Nutrition", slug: "nutrition" },
  ] as InsertTag[];

  const createdTags = [];
  for (const tag of tags) {
    const createdTag = await storage.createTag(tag);
    createdTags.push(createdTag);
    console.log(`Created tag: ${createdTag.name}`);
  }

  // Create posts
  console.log("Creating posts...");
  const posts = [
    {
      title: "Mastering the Pop-Up: The Foundation of Surfing",
      slug: "mastering-the-pop-up",
      excerpt: "Learn the fundamentals of the pop-up technique to improve your surfing from day one.",
      content: `
# Mastering the Pop-Up: The Foundation of Surfing

The pop-up is the most fundamental movement in surfing. It's the transition from paddling to standing, and it's essential to master if you want to progress in the sport. In this article, we'll break down the perfect pop-up technique step by step.

## Understanding the Importance of the Pop-Up

A smooth, fast pop-up gives you the best chance of successfully riding a wave. It allows you to get to your feet quickly and with proper positioning, setting you up for a successful ride. Many beginners struggle with this movement, but with practice and proper technique, it becomes second nature.

## The Perfect Pop-Up Technique

### Step 1: Proper Paddle Position

Before you can pop up, you need to be in the right position on your board. Your sternum should be aligned with the center of the board, and your feet should be together and slightly raised off the surface of the water. Your hands should be placed flat on the board about chest level, ready to push up.

### Step 2: The Push-Up

As you feel the wave catch your board, push your upper body up with your arms, similar to a cobra yoga pose. Your hips should stay connected to the board at this point. Keep your gaze forward toward the beach, not down at your board.

### Step 3: The Foot Placement

In one fluid motion, bring your back foot forward and place it across the center of the board at about a 45-degree angle. Simultaneously, bring your front foot forward between your hands, flat on the board. Your feet should land in a stance slightly wider than shoulder-width.

### Step 4: Stand and Balance

As your feet land, straighten your legs to stand up, keeping your knees slightly bent for balance. Your weight should be centered over the board, with your arms out for stability.

## Common Pop-Up Mistakes and How to Fix Them

- **Dragging the back foot**: Many beginners try to bring their back foot up and place it, then the front foot. This is too slow. Practice popping up in one motion.
  
- **Looking down at the board**: Keep your gaze forward toward the beach. Looking down throws off your balance and positioning.

- **Standing up straight**: Maintain a low center of gravity with bent knees to improve stability.

- **Hands too far forward**: If your hands are too far forward when you push up, you'll be off-balance. Position them at chest level for optimal leverage.

## Practice Makes Perfect

The best way to improve your pop-up is through repetition, both in and out of the water:

1. **Land practice**: Practice pop-ups on the beach before hitting the water. Find a flat surface and lay on your surfboard or a towel, and practice the motion repeatedly until it feels natural.

2. **Fitness training**: Strengthen your core, arms, and shoulders with exercises like push-ups, planks, and burpees to make the pop-up motion easier.

3. **Mental visualization**: Take time to visualize yourself performing the perfect pop-up. Mental practice can be surprisingly effective when combined with physical practice.

Remember, even the world's best surfers had to master this fundamental movement. With patience and consistent practice, your pop-up will improve, and you'll be riding waves with more confidence and control.

See you in the lineup!
`,
      featuredImage: "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1",
      authorId: createdAuthors[2].id, // John John Florence
      categoryId: createdCategories[0].id, // Surf Techniques
      readTime: 8,
      featured: true
    },
    {
      title: "The Ultimate Guide to Portugal's Surf Coast",
      slug: "portugal-surf-coast-guide",
      excerpt: "Discover the best surf spots, accommodation, and local tips for Portugal's legendary coastline.",
      content: `
# The Ultimate Guide to Portugal's Surf Coast

Portugal has established itself as Europe's premier surfing destination, with a stunning Atlantic coastline that offers waves for every skill level throughout the year. From the monster waves at Nazaré to the beginner-friendly beaches of the Algarve, Portugal's surf scene is diverse and welcoming.

## When to Go

Portugal offers year-round surfing, but conditions vary by season:

- **Fall (September-November)**: The prime surfing season with consistent swells, fewer crowds than summer, and pleasant weather.
  
- **Winter (December-February)**: The biggest swells arrive, making it perfect for experienced surfers. This is when Nazaré comes alive with massive waves.
  
- **Spring (March-May)**: Conditions remain good with gradually warming temperatures and consistent waves.
  
- **Summer (June-August)**: Smaller waves ideal for beginners, but popular spots can get crowded. Water temperatures are at their warmest.

## Top Surf Spots

### Ericeira

As the only World Surfing Reserve in Europe, Ericeira offers a concentration of world-class waves within a small area. Key spots include:

- **Ribeira d'Ilhas**: A consistent right-hand point break suitable for intermediate surfers.
  
- **Coxos**: One of Portugal's best right-handers, powerful and fast for experienced surfers only.
  
- **Foz do Lizandro**: A beach break offering waves for all levels, making it great for beginners.

### Peniche

Famous for Supertubos, one of Europe's best beach breaks, Peniche is a peninsula offering waves on both north and south sides, allowing you to find sheltered spots regardless of wind direction.

- **Supertubos**: Fast, powerful barrels over a sand bottom. For advanced surfers.
  
- **Baleal**: Mellow beach breaks perfect for beginners and intermediates.
  
- **Lagide**: A consistent spot that works well with northwest swells.

### Nazaré

Home to the biggest rideable waves on the planet, Nazaré has become legendary in the surfing world.

- **Praia do Norte**: Where the giant waves break in winter. Not for the average surfer, but spectacular to watch.
  
- **Praia da Vila**: The town beach offers more manageable conditions for regular surfers.

### Lagos and the Algarve

The southern coast offers warmer water and more sheltered conditions, making it ideal for beginners.

- **Meia Praia**: A long, gentle beach break perfect for learning.
  
- **Arrifana**: A beautiful cove with a right-hand point break that's suitable for all levels.
  
- **Zavial**: One of the Algarve's best point breaks on its day.

## Where to Stay

### Surf Camps

Portugal has embraced the surf tourism boom with numerous surf camps offering packages that include accommodation, lessons, and board rental. These are perfect for solo travelers, as they provide an instant community.

### Coastal Towns

Each surf region has its own charm:

- **Ericeira**: A traditional fishing village turned surf town with a laid-back vibe and great seafood.
  
- **Peniche**: A working port with a more urban feel and excellent infrastructure for surfers.
  
- **Sagres**: The remote western tip of the Algarve offers dramatic landscapes and a more rugged experience.

## Local Tips

- Rent a car if possible. The best surf spots are often spread out, and having your own transportation allows you to chase the best conditions.
  
- Water temperatures range from around 14°C (57°F) in winter to 20°C (68°F) in summer. A 4/3mm wetsuit is ideal for winter, while a 2mm shorty or just boardshorts/swimsuit can work in the height of summer.
  
- Respect locals and take time to understand the lineup etiquette at each spot. Some locations, like Coxos, have a strict pecking order.
  
- Try the local cuisine! Portugal offers incredible seafood, pastries, and affordable wine to enjoy after a day in the water.

## Beyond Surfing

When the ocean goes flat or you need a break, Portugal offers plenty of other activities:

- **Historical sites**: Visit castles, monasteries, and ancient ruins throughout the country.
  
- **Wine tasting**: The country's wine regions produce excellent varieties at reasonable prices.
  
- **Hiking**: Coastal trails offer breathtaking views, particularly in the southwest's natural parks.

Portugal's combination of consistent waves, affordability (compared to other European destinations), rich culture, and friendly locals makes it an ideal surf destination whether you're planning a quick weekend trip or an extended stay.

Boas ondas! (Good waves!)
`,
      featuredImage: "https://images.unsplash.com/photo-1545562083-c583a7a9f217",
      authorId: createdAuthors[1].id, // Maya Gabeira
      categoryId: createdCategories[1].id, // Destinations
      readTime: 15,
      featured: true
    },
    {
      title: "How to Choose Your First Surfboard: A Beginner's Guide",
      slug: "beginners-first-surfboard-guide",
      excerpt: "Confused about what board to start with? This comprehensive guide will help you make the right choice.",
      content: `
# How to Choose Your First Surfboard: A Beginner's Guide

Selecting your first surfboard is a critical decision that will significantly impact your early surfing experience. The right board can accelerate your progress and make learning more enjoyable, while the wrong choice can lead to frustration and slower development. This guide will help you navigate the options and make an informed decision.

## Forget What the Pros Ride

The single biggest mistake beginners make is choosing a board similar to what they see professional surfers using. Pro shortboards are designed for high-performance surfing in quality waves and require advanced skills to operate effectively. As a beginner, you need something entirely different.

## Volume is Your Friend

When starting out, you want a board with plenty of volume (buoyancy) that will:

- Make paddling easier
- Provide stability when sitting and standing
- Catch waves earlier and with less effort
- Be more forgiving of imperfect positioning

Board volume is measured in liters and is a function of the board's length, width, and thickness. As a general rule, beginners should look for a board with a volume in liters that's at least 100-120% of their weight in kilograms.

## Best Surfboard Types for Beginners

### Foam Boards

**Pros:**
- Extremely stable and buoyant
- Soft material is safer for you and others
- Durable and resistant to dings
- Affordable starting point

**Cons:**
- Limited maneuverability
- Less responsive in turns
- You'll outgrow it relatively quickly as you progress

**Recommendation:** Ideal for absolute beginners for the first 5-10 sessions. Look for something in the 7'0" to 8'0" range with plenty of width and thickness.

### Longboards (9'0" and up)

**Pros:**
- Excellent paddle power and wave-catching ability
- Stable platform for learning to stand and balance
- Can be used in smaller, weaker waves
- You won't outgrow it; even advanced surfers enjoy longboarding

**Cons:**
- Harder to transport and store
- More challenging to duck dive under waves
- Less responsive for turning and progression to more dynamic surfing

**Recommendation:** An excellent choice for beginners who are patient and want to develop proper technique from the start. A 9'0" minimal longboard with plenty of width is versatile enough for learning while still allowing room for skill progression.

### Mid-Length Boards (7'0" to 8'6")

**Pros:**
- More maneuverable than longboards
- Better paddle power and stability than shortboards
- Versatile in various wave conditions
- Good transition board that lasts beyond the beginner stage

**Cons:**
- Slightly more challenging to learn on than longboards
- Not as specialized for any particular style of surfing

**Recommendation:** A "funboard" or "mini-mal" in the 7'6" to 8'0" range with a width around 22-23" offers an excellent balance of stability and maneuverability for a beginner who wants to progress quickly.

### Fish and Hybrid Shortboards

**Pros:**
- More maneuverable than bigger boards
- Better performance in a wider range of waves
- Suitable for progression into more dynamic surfing

**Cons:**
- Significantly harder to paddle and catch waves
- Less stable for learning basic techniques
- Requires more precise positioning

**Recommendation:** Not ideal for complete beginners but could be a good second board once you've developed basic skills. If you're athletic with board sport experience and insist on starting with something shorter, look for a hybrid shape around 6'6" to 7'0" with extra width and thickness.

## Material Considerations

### Polyurethane (PU) with Polyester Resin

The traditional construction method uses a polyurethane foam core with wooden stringer, fiberglass cloth, and polyester resin.

**Pros:**
- Affordable
- Good flex pattern that feels lively
- Easy to repair

**Cons:**
- Less durable than modern constructions
- Absorbs water when damaged
- Heavier than epoxy boards

### Epoxy

Modern construction using expanded polystyrene (EPS) foam with epoxy resin.

**Pros:**
- Lighter weight
- More buoyant
- More durable and ding-resistant
- Doesn't absorb water as readily

**Cons:**
- Usually more expensive
- Can feel stiff or "pingy"
- Harder to repair

**Recommendation for beginners:** Either construction is fine, but epoxy's added durability and buoyancy make it slightly better for learners if the price works within your budget.

## Where to Buy Your First Board

As a beginner, consider these options:

1. **Used boards**: Check local classifieds, Facebook Marketplace, or surf shop used racks. You'll get much better value, and the inevitable dings won't hurt as much emotionally.

2. **Local surf shops**: They may be slightly more expensive, but the expertise and guidance you receive are invaluable, especially for a first purchase.

3. **Major retailers**: Stores like Costco offer affordable foam boards that are perfectly adequate for learning.

Whatever you choose, remember that your first board is just that—your first. Most surfers accumulate a quiver of different boards as they progress. Focus on getting something that will help you catch plenty of waves and develop your fundamental skills. The rest will follow naturally.

Happy surfing!
`,
      featuredImage: "https://images.unsplash.com/photo-1531722569936-825d3dd91b15",
      authorId: createdAuthors[0].id, // Kelly Slater
      categoryId: createdCategories[2].id, // Equipment
      readTime: 12,
      featured: false
    },
    {
      title: "My Journey to Surfing Nazaré's Monster Waves",
      slug: "nazare-monster-waves-journey",
      excerpt: "The personal story of preparing physically and mentally to face one of the most intimidating waves on the planet.",
      content: `
# My Journey to Surfing Nazaré's Monster Waves

The first time I saw Nazaré break in person, I nearly turned around and left. Standing on the cliff at Praia do Norte, watching mountains of water crash with enough force to register on seismic equipment, I questioned every life decision that had led me to that moment. Yet somehow, three years later, I would find myself paddling out during a solid swell at this infamous Portuguese break. This is the story of that journey.

## The Fascination

Like many surfers, my obsession with Nazaré began when Garrett McNamara rode what was then considered the biggest wave ever surfed back in 2011—a 78-foot behemoth that changed big wave surfing forever. The images were otherworldly: a tiny human figure sliding down a wall of water as tall as an apartment building, with the historic lighthouse of Nazaré looking miniature in comparison.

What makes Nazaré unique isn't just its size. It's the particular way the waves break, created by Europe's largest underwater canyon—a 130-mile-long, 16,000-foot-deep trench that funnels and amplifies Atlantic swells. The result is less a wave in the traditional sense and more a chaotic, mutating mountain of whitewater that can shift direction unpredictably.

## The Preparation

After my first visit as a spectator, I knew I needed to prepare extensively if I ever hoped to surf there, even on a modest day by Nazaré standards. My training journey included:

### Physical Training

I implemented a rigorous fitness regimen focused on:

- **Breath training**: Daily practice extending my breath-hold capacity, eventually working up to comfortable 3-minute static holds and 2-minute active holds after intense exercise.

- **Paddling endurance**: Long-distance swim sessions and specialized paddle training to build the stamina needed for Nazaré's challenging paddle-outs and the quick acceleration required to catch waves of consequence.

- **Core and lower body strength**: Squats, deadlifts, and stability exercises to handle the forces experienced when riding giant waves.

### Equipment Preparation

Nazaré demands specialized equipment:

- **The board**: I worked with a local shaper to create a 9'6" gun designed specifically for big waves, with extra stringers for strength and a specialized rocker profile.

- **Safety gear**: I invested in a quality inflation vest, impact wetsuit, and emergency flotation equipment. I also trained extensively with this gear in controlled environments before taking it to Nazaré.

- **Communication systems**: I established protocols with safety teams and learned the hand signals and communication methods used in big wave lineups.

### Mental Preparation

Perhaps most importantly, I worked on my mental approach:

- **Visualization**: I spent hours studying footage of Nazaré and visualizing myself successfully riding waves and handling wipeouts.

- **Stress inoculation**: I deliberately put myself in challenging situations in big (but not massive) surf to prepare my mind for the extreme stress of Nazaré.

- **Acceptance**: I had to come to terms with the very real risks involved and make peace with them—a process that involved difficult conversations with loved ones.

## The Progression

I didn't go straight from regular surf to Nazaré's biggest days. My approach followed a careful progression:

1. **Building big wave experience elsewhere**: I spent two seasons chasing large swells at more forgiving spots like Punta de Lobos in Chile and Pico Alto in Peru.

2. **Smaller days at Nazaré**: I made several trips to surf Nazaré when it was in the 10-15 foot range (which is still serious business by normal standards).

3. **Meeting the local community**: I connected with experienced Nazaré surfers, safety teams, and watermen who shared invaluable knowledge about the wave's particular behaviors and hazards.

4. **Tow-in experience**: Before paddling the bigger days, I gained experience being towed into waves by jet ski, which allowed me to understand the wave's speed and power without the additional challenge of paddling.

## The Day

When the day finally came to paddle out in legitimate Nazaré conditions, it wasn't the biggest the spot gets—I'm not a professional big wave surfer, after all—but at 20-25 feet, it represented the pinnacle of my surfing journey.

The session itself is a blur of adrenaline, focus, and moments of both terror and exhilaration. I remember the difficult paddle out through churning whitewater, the eerie stillness in the lineup as we all watched sets approaching on the horizon, and the indescribable feeling of commitment when I turned and put my head down to paddle for a wave that felt like the side of a building rising behind me.

I caught three waves that day. The first ended in a wipeout that left me feeling like I'd been through a washing machine. The second I made but rode conservatively. On the third, everything came together—the entry, the line, the controlled speed through a choppy face that felt like riding a motorcycle down a flight of stairs.

## The Lessons

Surfing Nazaré taught me lessons that extended far beyond surfing:

- **Respect**: For nature's power, for other surfers who challenge these waves regularly, and for the local community that has embraced big wave surfing.

- **Preparation meets opportunity**: No amount of luck can replace methodical preparation when facing something as consequential as Nazaré.

- **The value of community**: Big wave surfing is inherently collaborative. Without the support, knowledge, and literal lifesaving assistance of others, none of it would be possible.

- **Finding your own achievements**: My waves at Nazaré wouldn't make any highlight reels, but personal achievement isn't about how your accomplishments look to others—it's about challenging your own boundaries.

I don't know if I'll ever surf Nazaré at its biggest. That remains a dream that requires weighing many factors. But standing on the cliff now, watching those same mountains of water that once terrified me, I feel something different—not fearlessness, but a deeper appreciation for what's possible when you approach seemingly impossible challenges one careful step at a time.
`,
      featuredImage: "https://images.unsplash.com/photo-1444097315577-49429a8b6128",
      authorId: createdAuthors[1].id, // Maya Gabeira
      categoryId: createdCategories[3].id, // Stories
      readTime: 18,
      featured: true
    },
    {
      title: "Surfing in the Age of Climate Change: What You Need to Know",
      slug: "surfing-climate-change-impact",
      excerpt: "How rising sea levels, changing weather patterns, and ocean acidification are affecting surf breaks worldwide.",
      content: `
# Surfing in the Age of Climate Change: What You Need to Know

As surfers, our connection to the ocean gives us a front-row seat to the changes happening in our natural environment. Climate change is no longer a distant threat but a present reality affecting our coastlines, waves, and the entire ocean ecosystem. This article explores how climate change is impacting surfing and what we as a community can do about it.

## How Climate Change is Affecting Our Waves

### Rising Sea Levels

The most direct impact of climate change on surfing comes from rising sea levels. As the planet warms, thermal expansion of seawater and melting ice sheets and glaciers contribute to higher ocean levels worldwide. For surfers, this means:

- **Disappearing breaks**: Some reef and point breaks that rely on specific water depths may become too deep to create quality waves.
  
- **Coastal erosion**: Beaches and shorelines are retreating, changing the seafloor contours that shape our waves.
  
- **Infrastructure threats**: Many coastal amenities that surfers rely on, from parking areas to beach access points, face increased flooding and damage.

At current projections, sea levels could rise between 0.3 and 2.5 meters by 2100, depending on our emissions trajectory. This would transform coastlines worldwide and likely eliminate some beloved surf spots.

### Changing Storm Patterns

Surfers depend on storms to generate swells, but climate change is altering these patterns:

- **Increased intensity**: Warmer oceans provide more energy for storms, potentially creating larger, more powerful swells.
  
- **Shifting storm tracks**: As atmospheric circulation patterns change, traditional swell windows for many surf regions are shifting, creating new seasons of surf and diminishing others.
  
- **Greater unpredictability**: More extreme weather events make predicting good surf conditions increasingly difficult.

### Ocean Acidification and Ecosystem Changes

The ocean absorbs approximately 30% of atmospheric CO2, leading to increased acidity as this CO2 dissolves in seawater:

- **Reef damage**: Coral reefs, which create some of the world's best surf breaks, are highly vulnerable to both warming waters and acidification.
  
- **Ecosystem disruption**: Changes in marine species distribution affect entire food webs and can lead to issues like increased algal blooms that impact water quality.
  
- **Water temperature changes**: Warming waters affect wetsuit requirements and can create conditions for harmful bacteria or make tropical regions uncomfortably hot for surfing.

## Regional Impacts and Changes

Climate change doesn't affect all surfing regions equally:

### Australia and the South Pacific

These regions face significant threats from coral bleaching and reef death, particularly in iconic surf destinations like the Great Barrier Reef. Sea level rise also threatens many low-lying island surf destinations in the Pacific.

### California and West Coast USA

Increasing sea levels combined with more frequent and intense El Niño events are accelerating coastal erosion. Some studies suggest that Southern California could lose up to two-thirds of its beaches by 2100 without intervention.

### Europe

Changes in the North Atlantic Oscillation (NAO) are altering traditional winter storm patterns that European surfers rely on. Meanwhile, coastal erosion is severely impacting surf spots in places like the UK, France, and Portugal.

### Developing Surf Regions

Many emerging surf destinations in developing countries lack the resources for climate adaptation measures, putting both the waves and the growing surf tourism economies at risk.

## The Surf Industry's Carbon Footprint

As we consider climate change's impact on surfing, we must also address surfing's impact on climate:

- **Travel emissions**: Surf tourism generates significant carbon emissions through air travel.
  
- **Equipment production**: Traditional surfboards use petrochemical-derived materials with substantial carbon footprints.
  
- **Coastal development**: The expansion of surf tourism often leads to increased development in fragile coastal areas.

## Solutions and Actions

While the challenges are significant, the surfing community is uniquely positioned to drive positive change:

### Individual Actions

- **Reduce surf travel emissions**: Consider fewer, longer trips; offset your travel when possible; or explore local breaks more often.
  
- **Choose sustainable equipment**: Support brands developing eco-friendly surfboards, wetsuits, and accessories made from recycled or plant-based materials.
  
- **Participate in beach and ocean cleanups**: Join or organize regular cleanup events at your local breaks.

### Community Initiatives

- **Support surf breaks conservation**: Organizations like Save The Waves Coalition work to protect surf ecosystems through their World Surfing Reserves program.
  
- **Engage in coastal planning**: Participate in local coastal management discussions to ensure surf breaks are considered in adaptation strategies.
  
- **Reef restoration projects**: Some surf communities are leading coral and oyster reef restoration efforts that can both improve biodiversity and protect coastlines.

### Policy Advocacy

- **Carbon pricing support**: Advocate for effective carbon pricing mechanisms that can accelerate the transition to clean energy.
  
- **Coastal protection policies**: Support policies that protect coastlines while considering natural processes rather than just hardening shorelines.
  
- **Marine protected areas**: Advocate for the expansion of marine protected areas that can increase ocean ecosystem resilience.

## The Surfer's Responsibility

As people who derive so much joy from the ocean, surfers have a special responsibility to protect it. Our intimate connection with the sea gives us both the motivation and credibility to be effective ocean advocates.

Climate change presents existential threats to many aspects of surfing as we know it, but it also offers an opportunity for the surfing community to lead in environmental stewardship. By combining our passion for waves with meaningful action on climate, we can help ensure that future generations will still experience the unique joy of riding waves in healthy oceans.

The ocean has given us so much. Now it's our turn to give back.
`,
      featuredImage: "https://images.unsplash.com/photo-1501949997128-2fdb9f6428f1",
      authorId: createdAuthors[0].id, // Kelly Slater
      categoryId: createdCategories[4].id, // Environment
      readTime: 14,
      featured: false
    },
  ] as InsertPost[];

  const createdPosts = [];
  for (const post of posts) {
    const createdPost = await storage.createPost(post);
    createdPosts.push(createdPost);
    console.log(`Created post: ${createdPost.title}`);
  }

  // Add tags to posts
  console.log("Assigning tags to posts...");
  
  // Post 1: Mastering the Pop-Up
  await storage.addTagToPost({
    postId: createdPosts[0].id,
    tagId: createdTags.find(t => t.slug === "beginner")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[0].id,
    tagId: createdTags.find(t => t.slug === "training")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[0].id,
    tagId: createdTags.find(t => t.slug === "shortboard")!.id,
  } as InsertPostTag);
  
  // Post 2: Portugal's Surf Coast
  await storage.addTagToPost({
    postId: createdPosts[1].id,
    tagId: createdTags.find(t => t.slug === "travel")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[1].id,
    tagId: createdTags.find(t => t.slug === "advanced")!.id,
  } as InsertPostTag);
  
  // Post 3: First Surfboard Guide
  await storage.addTagToPost({
    postId: createdPosts[2].id,
    tagId: createdTags.find(t => t.slug === "beginner")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[2].id,
    tagId: createdTags.find(t => t.slug === "gear")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[2].id,
    tagId: createdTags.find(t => t.slug === "longboard")!.id,
  } as InsertPostTag);
  
  // Post 4: Nazaré Journey
  await storage.addTagToPost({
    postId: createdPosts[3].id,
    tagId: createdTags.find(t => t.slug === "big-wave")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[3].id,
    tagId: createdTags.find(t => t.slug === "advanced")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[3].id,
    tagId: createdTags.find(t => t.slug === "safety")!.id,
  } as InsertPostTag);
  
  // Post 5: Climate Change
  await storage.addTagToPost({
    postId: createdPosts[4].id,
    tagId: createdTags.find(t => t.slug === "sustainable")!.id,
  } as InsertPostTag);
  await storage.addTagToPost({
    postId: createdPosts[4].id,
    tagId: createdTags.find(t => t.slug === "travel")!.id,
  } as InsertPostTag);

  // Create some comments
  console.log("Creating comments...");
  
  await storage.createComment({
    content: "This was super helpful! I've been struggling with my pop-up for weeks and the tip about looking toward the beach instead of down at my board made a huge difference.",
    postId: createdPosts[0].id,
    userName: "SurfNewbie",
    userEmail: "surfnewbie@example.com",
  });
  
  await storage.createComment({
    content: "Great article! Having surfed Portugal for many years, I'd also recommend checking out the lesser-known spots north of Lisbon for some uncrowded waves.",
    postId: createdPosts[1].id,
    authorId: createdAuthors[0].id, // Kelly Slater commenting
  });
  
  await storage.createComment({
    content: "I wish I'd read this before buying my first board. Started on a 6'0' shortboard and it was a nightmare. Switched to a 8'0' foamie and suddenly I was actually catching waves!",
    postId: createdPosts[2].id,
    userName: "WaveCatcher",
    userEmail: "wavecatcher@example.com",
  });
  
  const nazareComment = await storage.createComment({
    content: "Incredible journey. The preparation section is so important - too many people underestimate what it takes to surf waves of consequence. Respect for putting in the work!",
    postId: createdPosts[3].id,
    authorId: createdAuthors[2].id, // John John Florence commenting
  });
  
  // Add a reply to the Nazaré post comment
  await storage.createComment({
    content: "Thanks John! Coming from you that means a lot. The mental prep was honestly the hardest part.",
    postId: createdPosts[3].id,
    authorId: createdAuthors[1].id, // Maya replying
    parentId: nazareComment.id,
  });
  
  await storage.createComment({
    content: "As a marine biologist and surfer, I appreciate you bringing attention to this issue. The data on reef degradation is alarming, and we're already seeing impacts at many breaks worldwide.",
    postId: createdPosts[4].id,
    userName: "OceanScientist",
    userEmail: "scientist@marineresearch.org",
  });

  console.log("\n✅ Database seeding completed successfully!");
  console.log("The blog has been populated with surfing content including:");
  console.log(`- ${createdAuthors.length} authors`);
  console.log(`- ${createdCategories.length} categories`);
  console.log(`- ${createdTags.length} tags`);
  console.log(`- ${createdPosts.length} posts with tags and comments`);
}

seedDatabase().catch(console.error);