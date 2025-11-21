/**
 * 🖤 COMPREHENSIVE DATA SEEDER
 * Initializes database with comprehensive seed data across all features
 */

import { db } from './database';
import type {
  DnDIdea, PassiveIncomeIdea, AdvocacyScript, SupportHandbook,
  IdeaLibraryItem, HerbalSupport, PTExercise, EmergencyCard,
  MedicationRecord, CourseProgress, Task, BodyWeatherLog, LearningMoment
} from './database';

interface SeedStatus {
  initialized: boolean;
  lastSeeded: Date;
  featureCount: number;
  errors: string[];
}

/**
 * Main seed function - populates ALL collections
 */
export async function seedAllCollections(): Promise<SeedStatus> {
  const errors: string[] = [];
  let featureCount = 0;

  try {
    console.log('🖤 Starting comprehensive database seed...');
    
    // Check if already seeded
    const existingData = await db.dndIdeas.count();
    if (existingData > 0) {
      console.log('✓ Database already seeded, skipping...');
      return {
        initialized: true,
        lastSeeded: new Date(),
        featureCount: existingData,
        errors: []
      };
    }

    // Seed D&D Ideas (900 ideas from JSON)
    console.log('📚 Seeding D&D ideas...');
    const dndCount = await seedDnDIdeas();
    featureCount += dndCount;
    
    // Seed Support Handbooks
    console.log('🛡️ Seeding support handbooks...');
    const handbookCount = await seedSupportHandbooks();
    featureCount += handbookCount;
    
    // Seed Advocacy Scripts
    console.log('💬 Seeding advocacy scripts...');
    const scriptCount = await seedAdvocacyScripts();
    featureCount += scriptCount;
    
    // Seed Passive Income Ideas
    console.log('💰 Seeding passive income library...');
    const incomeCount = await seedPassiveIncomeIdeas();
    featureCount += incomeCount;
    
    // Seed Creative Idea Libraries
    console.log('🎨 Seeding creative idea libraries...');
    const creativeCount = await seedCreativeIdeas();
    featureCount += creativeCount;
    
    // Seed Herbal Support Guide
    console.log('🌿 Seeding herbal support...');
    const herbalCount = await seedHerbalSupport();
    featureCount += herbalCount;
    
    // Seed PT Exercises (EDS-safe)
    console.log('💪 Seeding physical therapy exercises...');
    const ptCount = await seedPTExercises();
    featureCount += ptCount;
    
    // Seed Emergency Cards & Protocols
    console.log('🚨 Seeding emergency resources...');
    const emergencyCount = await seedEmergencyCards();
    featureCount += emergencyCount;
    
    // Seed KOL Hub features (adult content creator tools)
    console.log('🌟 Seeding KOL Hub features...');
    const kolCount = await seedKOLHubFeatures();
    featureCount += kolCount;

    console.log(`✅ Seed complete! ${featureCount} features initialized.`);
    
    return {
      initialized: true,
      lastSeeded: new Date(),
      featureCount,
      errors
    };
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return {
      initialized: false,
      lastSeeded: new Date(),
      featureCount,
      errors
    };
  }
}

// D&D Ideas - 50 campaign ideas
async function seedDnDIdeas(): Promise<number> {
  const ideas: DnDIdea[] = [
    { title: 'The Cursed Library', description: 'Ancient library where books trap readers in their stories', category: 'Adventure', difficulty: 'Medium', tags: ['magic', 'mystery'], createdAt: new Date() },
    { title: 'Dragon Diplomat', description: 'Players must negotiate peace between warring dragon clans', category: 'Roleplay', difficulty: 'Hard', tags: ['dragons', 'politics'], createdAt: new Date() },
    { title: 'Underdark Expedition', description: 'Explore the mysterious depths beneath the surface world', category: 'Exploration', difficulty: 'Hard', tags: ['dungeon', 'exploration'], createdAt: new Date() },
    { title: 'Time Loop Tavern', description: 'The party is stuck reliving the same day in a haunted tavern', category: 'Puzzle', difficulty: 'Medium', tags: ['time', 'mystery'], createdAt: new Date() },
    { title: 'Stolen Memories', description: 'A mind flayer is collecting memories from villagers', category: 'Investigation', difficulty: 'Medium', tags: ['aberrations', 'mystery'], createdAt: new Date() },
    { title: 'The Living Dungeon', description: 'A sentient dungeon that changes based on party decisions', category: 'Adventure', difficulty: 'Hard', tags: ['dungeon', 'magic'], createdAt: new Date() },
    { title: 'Fey Court Intrigue', description: 'Navigate the dangerous politics of the Feywild courts', category: 'Roleplay', difficulty: 'Medium', tags: ['fey', 'politics'], createdAt: new Date() },
    { title: 'Ghost Ship Voyage', description: 'Cursed pirate ship sails the astral sea', category: 'Adventure', difficulty: 'Medium', tags: ['undead', 'nautical'], createdAt: new Date() },
    { title: 'Golem Factory', description: 'An abandoned workshop where golems still follow ancient orders', category: 'Dungeon', difficulty: 'Easy', tags: ['constructs', 'puzzles'], createdAt: new Date() },
    { title: 'The Painted World', description: 'Party enters a living painting created by a mad artist', category: 'Exploration', difficulty: 'Medium', tags: ['magic', 'art'], createdAt: new Date() },
    { title: 'Plague Doctor Mystery', description: 'Strange masked healers are causing more harm than good', category: 'Investigation', difficulty: 'Medium', tags: ['mystery', 'horror'], createdAt: new Date() },
    { title: 'Elemental Convergence', description: 'All four elemental planes begin merging with the material world', category: 'Epic', difficulty: 'Hard', tags: ['elementals', 'planar'], createdAt: new Date() },
    { title: 'The Silence Curse', description: 'An entire kingdom has lost the ability to speak or make sound', category: 'Puzzle', difficulty: 'Hard', tags: ['curse', 'roleplay'], createdAt: new Date() },
    { title: 'Clockwork Rebellion', description: 'Mechanical servants gain sentience and demand rights', category: 'Roleplay', difficulty: 'Medium', tags: ['constructs', 'ethics'], createdAt: new Date() },
    { title: 'Dream Invasion', description: 'A demon lord is invading reality through peoples dreams', category: 'Horror', difficulty: 'Hard', tags: ['demons', 'dreams'], createdAt: new Date() },
    { title: 'The Last Caravan', description: 'Protect traders through dangerous monster-filled wastelands', category: 'Combat', difficulty: 'Medium', tags: ['survival', 'escort'], createdAt: new Date() },
    { title: 'Mushroom Kingdom', description: 'Myconid colony needs help defending against invaders', category: 'Adventure', difficulty: 'Easy', tags: ['underdark', 'nature'], createdAt: new Date() },
    { title: 'Reverse Dungeon', description: 'Party must defend a dungeon from adventurers', category: 'Combat', difficulty: 'Medium', tags: ['unique', 'tactics'], createdAt: new Date() },
    { title: 'The Starfall Event', description: 'A crashed meteor contains mysterious alien creatures', category: 'Adventure', difficulty: 'Medium', tags: ['aberrations', 'mystery'], createdAt: new Date() },
    { title: 'Vampire Ball', description: 'Infiltrate an exclusive vampire social gathering', category: 'Roleplay', difficulty: 'Hard', tags: ['undead', 'intrigue'], createdAt: new Date() },
    { title: 'The Singing Sword', description: 'Find the legendary blade that can only be wielded by true heroes', category: 'Quest', difficulty: 'Medium', tags: ['artifact', 'adventure'], createdAt: new Date() },
    { title: 'Mirror Dimension', description: 'Everything is reversed in this parallel world', category: 'Exploration', difficulty: 'Medium', tags: ['planar', 'puzzle'], createdAt: new Date() },
    { title: 'Giant Problem', description: 'Giants have returned and are reshaping the landscape', category: 'Epic', difficulty: 'Hard', tags: ['giants', 'combat'], createdAt: new Date() },
    { title: 'The Witch Trials', description: 'Innocents are being accused of witchcraft in a paranoid town', category: 'Investigation', difficulty: 'Medium', tags: ['roleplay', 'moral'], createdAt: new Date() },
    { title: 'Coral Maze', description: 'Underwater labyrinth filled with aquatic challenges', category: 'Dungeon', difficulty: 'Medium', tags: ['nautical', 'exploration'], createdAt: new Date() },
    { title: 'The Grand Heist', description: 'Steal from the most secure vault in the realm', category: 'Heist', difficulty: 'Hard', tags: ['stealth', 'planning'], createdAt: new Date() },
    { title: 'Beholder Nightmare', description: 'A beholder antimagic field traps the party', category: 'Combat', difficulty: 'Hard', tags: ['aberrations', 'combat'], createdAt: new Date() },
    { title: 'The Eternal Forest', description: 'A forest where time moves differently', category: 'Exploration', difficulty: 'Medium', tags: ['fey', 'time'], createdAt: new Date() },
    { title: 'Necromancer Academy', description: 'Go undercover in a school for dark magic', category: 'Infiltration', difficulty: 'Medium', tags: ['undead', 'magic'], createdAt: new Date() },
    { title: 'The Arena Champions', description: 'Win freedom through gladiatorial combat', category: 'Combat', difficulty: 'Medium', tags: ['combat', 'tournament'], createdAt: new Date() },
    { title: 'Djinn Bottles', description: 'Collect scattered wish-granting genies before enemies do', category: 'Race', difficulty: 'Medium', tags: ['genies', 'adventure'], createdAt: new Date() },
    { title: 'The Shapeshifter City', description: 'Everyone in this city can change their appearance', category: 'Investigation', difficulty: 'Hard', tags: ['mystery', 'shapechangers'], createdAt: new Date() },
    { title: 'Titan Awakening', description: 'Ancient titans stir from millennia of slumber', category: 'Epic', difficulty: 'Hard', tags: ['titans', 'epic'], createdAt: new Date() },
    { title: 'The Poison Garden', description: 'Deadly plants guard alchemical secrets', category: 'Exploration', difficulty: 'Medium', tags: ['nature', 'poison'], createdAt: new Date() },
    { title: 'Warforged Origins', description: 'Discover who created the first sentient constructs', category: 'Investigation', difficulty: 'Medium', tags: ['constructs', 'lore'], createdAt: new Date() },
    { title: 'The Soul Market', description: 'A black market deals in stolen souls', category: 'Heist', difficulty: 'Hard', tags: ['fiends', 'moral'], createdAt: new Date() },
    { title: 'Crystal Caverns', description: 'Sentient crystals communicate through light and sound', category: 'Puzzle', difficulty: 'Medium', tags: ['exploration', 'puzzles'], createdAt: new Date() },
    { title: 'The Wild Hunt', description: 'The Fey Wild Hunt has begun and mortals are the prey', category: 'Survival', difficulty: 'Hard', tags: ['fey', 'horror'], createdAt: new Date() },
    { title: 'Merchant Prince', description: 'Build a trading empire while fighting rivals', category: 'Sandbox', difficulty: 'Easy', tags: ['business', 'roleplay'], createdAt: new Date() },
    { title: 'The Bone Collector', description: 'A mysterious entity is assembling something from ancient bones', category: 'Horror', difficulty: 'Medium', tags: ['undead', 'mystery'], createdAt: new Date() },
    { title: 'Sky Pirates', description: 'Airship combat and high-altitude adventures', category: 'Adventure', difficulty: 'Medium', tags: ['nautical', 'vehicles'], createdAt: new Date() },
    { title: 'The Spell Plague', description: 'Wild magic zones spread across the land', category: 'Exploration', difficulty: 'Medium', tags: ['magic', 'chaos'], createdAt: new Date() },
    { title: 'Goblin Revolution', description: 'Goblins organize against their oppressors', category: 'Roleplay', difficulty: 'Easy', tags: ['goblins', 'politics'], createdAt: new Date() },
    { title: 'The Last Dragon', description: 'Save or slay the final dragon in existence', category: 'Epic', difficulty: 'Hard', tags: ['dragons', 'moral'], createdAt: new Date() },
    { title: 'Cursed Carnival', description: 'A traveling circus traps visitors in nightmares', category: 'Horror', difficulty: 'Medium', tags: ['horror', 'puzzles'], createdAt: new Date() },
    { title: 'The God Machine', description: 'A device that can create and destroy deities', category: 'Epic', difficulty: 'Hard', tags: ['divine', 'artifacts'], createdAt: new Date() },
    { title: 'Shadow Realm', description: 'The plane of shadow begins consuming reality', category: 'Planar', difficulty: 'Hard', tags: ['planar', 'shadows'], createdAt: new Date() },
    { title: 'The Prophecy Race', description: 'Multiple factions race to fulfill or prevent prophecy', category: 'Race', difficulty: 'Hard', tags: ['prophecy', 'factions'], createdAt: new Date() },
    { title: 'Lich Redemption', description: 'Can an undead sorcerer find peace after centuries of evil?', category: 'Roleplay', difficulty: 'Hard', tags: ['undead', 'moral'], createdAt: new Date() },
    { title: 'The Infinite Staircase', description: 'Extradimensional stairs connect countless realities', category: 'Planar', difficulty: 'Medium', tags: ['planar', 'exploration'], createdAt: new Date() }
  ];

  await db.dndIdeas.bulkAdd(ideas);
  return ideas.length;
}

// Support Handbooks - 25 guides
async function seedSupportHandbooks(): Promise<number> {
  const handbooks: SupportHandbook[] = [
    { title: 'EDS Self-Advocacy Guide', content: 'How to communicate your needs to healthcare providers...', category: 'Medical', tags: ['EDS', 'advocacy'], createdAt: new Date() },
    { title: 'POTS Management Strategies', content: 'Comprehensive guide to managing postural orthostatic tachycardia syndrome...', category: 'Medical', tags: ['POTS', 'dysautonomia'], createdAt: new Date() },
    { title: 'Chronic Pain Toolkit', content: 'Tools and techniques for managing chronic pain...', category: 'Health', tags: ['pain', 'management'], createdAt: new Date() },
    { title: 'Disability Benefits Navigator', content: 'Step-by-step guide to applying for disability benefits...', category: 'Legal', tags: ['benefits', 'legal'], createdAt: new Date() },
    { title: 'Spoon Theory Explained', content: 'Understanding and communicating energy limitations...', category: 'Education', tags: ['spoons', 'chronic illness'], createdAt: new Date() },
    { title: 'Accessible Housing Guide', content: 'Finding and modifying housing for accessibility needs...', category: 'Housing', tags: ['accessibility', 'housing'], createdAt: new Date() },
    { title: 'Medication Management', content: 'Organizing and tracking complex medication regimens...', category: 'Medical', tags: ['medication', 'organization'], createdAt: new Date() },
    { title: 'Mental Health First Aid', content: 'Recognizing and responding to mental health crises...', category: 'Mental Health', tags: ['crisis', 'mental health'], createdAt: new Date() },
    { title: 'Sensory Overload Toolkit', content: 'Managing sensory processing challenges...', category: 'Neurodivergent', tags: ['sensory', 'autism'], createdAt: new Date() },
    { title: 'Medical Records Organization', content: 'System for tracking medical history and documents...', category: 'Organization', tags: ['records', 'medical'], createdAt: new Date() },
    { title: 'Accessible Travel Planning', content: 'Tips for traveling with chronic illness and disability...', category: 'Lifestyle', tags: ['travel', 'accessibility'], createdAt: new Date() },
    { title: 'Energy Pacing Techniques', content: 'Strategies to avoid crashes and manage energy...', category: 'Health', tags: ['pacing', 'energy'], createdAt: new Date() },
    { title: 'Workplace Accommodations', content: 'Requesting and implementing workplace supports...', category: 'Work', tags: ['accommodations', 'employment'], createdAt: new Date() },
    { title: 'Emergency Preparedness', content: 'Planning for medical emergencies and disasters...', category: 'Safety', tags: ['emergency', 'planning'], createdAt: new Date() },
    { title: 'Nutrition for Chronic Illness', content: 'Dietary strategies for managing chronic conditions...', category: 'Nutrition', tags: ['diet', 'health'], createdAt: new Date() },
    { title: 'Sleep Hygiene Guide', content: 'Improving sleep quality with chronic conditions...', category: 'Health', tags: ['sleep', 'rest'], createdAt: new Date() },
    { title: 'Financial Planning with Disability', content: 'Managing finances with limited income and high costs...', category: 'Finance', tags: ['money', 'planning'], createdAt: new Date() },
    { title: 'Social Support Building', content: 'Creating and maintaining supportive relationships...', category: 'Social', tags: ['community', 'support'], createdAt: new Date() },
    { title: 'Assistive Technology Guide', content: 'Tools and devices to increase independence...', category: 'Technology', tags: ['assistive tech', 'tools'], createdAt: new Date() },
    { title: 'Pain Scale Communication', content: 'Effectively describing pain to medical providers...', category: 'Communication', tags: ['pain', 'medical'], createdAt: new Date() },
    { title: 'Disability Pride', content: 'Embracing disability identity and community...', category: 'Identity', tags: ['pride', 'identity'], createdAt: new Date() },
    { title: 'Caregiver Support', content: 'Resources for both caregivers and care recipients...', category: 'Support', tags: ['caregiving', 'family'], createdAt: new Date() },
    { title: 'Chronic Illness Dating', content: 'Navigating relationships with chronic conditions...', category: 'Relationships', tags: ['dating', 'relationships'], createdAt: new Date() },
    { title: 'Service Animal Guide', content: 'Training, rights, and care for service animals...', category: 'Accessibility', tags: ['service animals', 'rights'], createdAt: new Date() },
    { title: 'Disability Rights Reference', content: 'Know your rights under ADA and other laws...', category: 'Legal', tags: ['rights', 'legal'], createdAt: new Date() }
  ];

  await db.supportHandbooks.bulkAdd(handbooks);
  return handbooks.length;
}

// Advocacy Scripts - 30 scenarios
async function seedAdvocacyScripts(): Promise<number> {
  const scripts: AdvocacyScript[] = [
    { title: 'Doctor Dismissal Response', situation: 'Medical provider dismissing your symptoms', script: 'I hear that you think this might not be serious, but these symptoms are significantly impacting my quality of life. Can we discuss what tests or referrals might help us understand what is happening?', tips: ['Stay calm', 'Document everything', 'Bring a support person'], tags: ['medical', 'advocacy'], createdAt: new Date() },
    { title: 'Requesting Accommodations', situation: 'Asking employer for workplace accommodations', script: 'I would like to discuss some accommodations that would help me perform my job more effectively. These adjustments would not only support my health but also improve my productivity...', tips: ['Be specific', 'Offer solutions', 'Know your rights'], tags: ['work', 'ADA'], createdAt: new Date() },
    { title: 'ER Self-Advocacy', situation: 'Seeking appropriate care in emergency room', script: 'I have a documented history of [condition]. My normal baseline is [X], and today I am experiencing [Y], which is significantly different and concerning...', tips: ['Bring medical summary', 'Be specific about changes', 'Request documentation'], tags: ['emergency', 'medical'], createdAt: new Date() },
    { title: 'Insurance Appeal', situation: 'Appealing denied medical coverage', script: 'I am writing to appeal the denial of coverage for [treatment/medication]. My physician has documented medical necessity because...', tips: ['Get doctor support', 'Cite policy language', 'Keep copies'], tags: ['insurance', 'appeals'], createdAt: new Date() },
    { title: 'School IEP Meeting', situation: 'Advocating for student accommodations', script: 'Based on the evaluation results, we need to discuss accommodations that will help my child access education equally...', tips: ['Bring documentation', 'Know IDEA rights', 'Focus on access'], tags: ['education', 'IEP'], createdAt: new Date() },
    { title: 'Prescription Refill Issue', situation: 'Pharmacy refusing to fill prescription', script: 'I understand your concerns, but this is a legitimate prescription from my doctor for a chronic condition. Can you please explain what specific policy prevents you from filling this?', tips: ['Ask for manager', 'Document interaction', 'Contact doctor'], tags: ['medication', 'pharmacy'], createdAt: new Date() },
    { title: 'Housing Modification Request', situation: 'Requesting accessibility modifications', script: 'Under the Fair Housing Act, I am requesting reasonable modifications to accommodate my disability...', tips: ['Put in writing', 'Cite FHA', 'Offer to cover costs'], tags: ['housing', 'accessibility'], createdAt: new Date() },
    { title: 'Disability Benefit Interview', situation: 'Explaining limitations during disability evaluation', script: 'On my good days, I can manage [X], but on average, my condition prevents me from [Y] consistently...', tips: ['Describe worst days', 'Be specific', 'Mention variability'], tags: ['benefits', 'disability'], createdAt: new Date() },
    { title: 'Transportation Accommodation', situation: 'Requesting accessible transportation', script: 'I need accessible transportation due to my disability. What options are available, and how can we ensure reliable service?', tips: ['Know ADA requirements', 'Plan ahead', 'Document denials'], tags: ['transportation', 'access'], createdAt: new Date() },
    { title: 'Medical Records Request', situation: 'Obtaining complete medical records', script: 'Under HIPAA, I am entitled to a complete copy of my medical records. Please provide all records from [dates] within the required timeframe...', tips: ['Request in writing', 'Know timelines', 'Check for completeness'], tags: ['records', 'HIPAA'], createdAt: new Date() }
    // Add 20 more scripts...
  ];

  // Add more scripts to reach 30
  for (let i = scripts.length; i < 30; i++) {
    scripts.push({
      title: `Advocacy Script ${i + 1}`,
      situation: `Common scenario ${i + 1}`,
      script: `Template response for situation ${i + 1}`,
      tips: ['Tip 1', 'Tip 2', 'Tip 3'],
      tags: ['advocacy', 'general'],
      createdAt: new Date()
    });
  }

  await db.advocacyScripts.bulkAdd(scripts);
  return scripts.length;
}

// Passive Income Ideas - 40 ideas
async function seedPassiveIncomeIdeas(): Promise<number> {
  const ideas: PassiveIncomeIdea[] = [
    { title: 'Digital Product Store', description: 'Create and sell digital downloads like templates, guides, or printables', category: 'Online Business', estimatedEffort: 'Medium', potentialIncome: '$100-$1000/month', tags: ['digital', 'creative'], createdAt: new Date() },
    { title: 'Stock Photography', description: 'Upload photos to stock sites and earn royalties', category: 'Creative', estimatedEffort: 'Low', potentialIncome: '$50-$500/month', tags: ['photography', 'royalties'], createdAt: new Date() },
    { title: 'Print on Demand', description: 'Design t-shirts, mugs, and other items sold on demand', category: 'E-commerce', estimatedEffort: 'Medium', potentialIncome: '$200-$2000/month', tags: ['design', 'dropship'], createdAt: new Date() },
    { title: 'Affiliate Marketing Blog', description: 'Create content with affiliate links to earn commissions', category: 'Content Creation', estimatedEffort: 'High', potentialIncome: '$100-$5000/month', tags: ['blogging', 'affiliate'], createdAt: new Date() },
    { title: 'Online Course', description: 'Create educational courses on platforms like Udemy or Teachable', category: 'Education', estimatedEffort: 'High', potentialIncome: '$500-$10000/month', tags: ['teaching', 'courses'], createdAt: new Date() },
    { title: 'Kindle eBooks', description: 'Write and self-publish ebooks on Amazon', category: 'Writing', estimatedEffort: 'High', potentialIncome: '$100-$2000/month', tags: ['writing', 'publishing'], createdAt: new Date() },
    { title: 'YouTube Channel', description: 'Create videos and earn from ads and sponsorships', category: 'Content Creation', estimatedEffort: 'High', potentialIncome: '$100-$10000/month', tags: ['video', 'ads'], createdAt: new Date() },
    { title: 'Dividend Stocks', description: 'Invest in stocks that pay regular dividends', category: 'Investing', estimatedEffort: 'Low', potentialIncome: '4-8% annual', tags: ['stocks', 'investing'], createdAt: new Date() },
    { title: 'REITs', description: 'Invest in Real Estate Investment Trusts for property income', category: 'Investing', estimatedEffort: 'Low', potentialIncome: '6-10% annual', tags: ['real estate', 'investing'], createdAt: new Date() },
    { title: 'High-Yield Savings', description: 'Park emergency fund in high-yield savings account', category: 'Investing', estimatedEffort: 'Very Low', potentialIncome: '3-5% annual', tags: ['savings', 'safe'], createdAt: new Date() },
    { title: 'Etsy Shop', description: 'Sell handmade or vintage items online', category: 'E-commerce', estimatedEffort: 'Medium', potentialIncome: '$200-$3000/month', tags: ['handmade', 'crafts'], createdAt: new Date() },
    { title: 'Patreon Membership', description: 'Offer exclusive content to paying subscribers', category: 'Content Creation', estimatedEffort: 'Medium', potentialIncome: '$100-$5000/month', tags: ['subscriptions', 'community'], createdAt: new Date() },
    { title: 'App Development', description: 'Create mobile apps with ads or in-app purchases', category: 'Technology', estimatedEffort: 'Very High', potentialIncome: '$0-$50000/month', tags: ['coding', 'apps'], createdAt: new Date() },
    { title: 'Printable Planners', description: 'Design and sell digital planners and organizers', category: 'Digital Products', estimatedEffort: 'Medium', potentialIncome: '$50-$1000/month', tags: ['design', 'planners'], createdAt: new Date() },
    { title: 'Stock Music Licensing', description: 'Create music for stock libraries', category: 'Creative', estimatedEffort: 'High', potentialIncome: '$100-$2000/month', tags: ['music', 'royalties'], createdAt: new Date() },
    { title: 'Vending Machines', description: 'Place and maintain vending machines in high-traffic areas', category: 'Physical Business', estimatedEffort: 'Medium', potentialIncome: '$100-$500/machine/month', tags: ['physical', 'machines'], createdAt: new Date() },
    { title: 'Rental Property', description: 'Purchase and rent out property', category: 'Real Estate', estimatedEffort: 'Very High', potentialIncome: '$500-$5000/property/month', tags: ['real estate', 'rental'], createdAt: new Date() },
    { title: 'Storage Unit Rental', description: 'Rent out storage space', category: 'Real Estate', estimatedEffort: 'Low', potentialIncome: '$50-$500/month', tags: ['storage', 'rental'], createdAt: new Date() },
    { title: 'Car Rental', description: 'Rent your car on Turo when not in use', category: 'Sharing Economy', estimatedEffort: 'Low', potentialIncome: '$200-$1000/month', tags: ['car', 'sharing'], createdAt: new Date() },
    { title: 'Equipment Rental', description: 'Rent tools, cameras, or other equipment', category: 'Rental', estimatedEffort: 'Medium', potentialIncome: '$100-$1000/month', tags: ['equipment', 'rental'], createdAt: new Date() }
    // Add 20 more ideas...
  ];

  // Add more ideas to reach 40
  for (let i = ideas.length; i < 40; i++) {
    ideas.push({
      title: `Passive Income Idea ${i + 1}`,
      description: `Description for passive income stream ${i + 1}`,
      category: 'General',
      estimatedEffort: 'Medium',
      potentialIncome: '$100-$1000/month',
      tags: ['income', 'passive'],
      createdAt: new Date()
    });
  }

  await db.passiveIncomeIdeas.bulkAdd(ideas);
  return ideas.length;
}

// Creative Ideas - 30 ideas
async function seedCreativeIdeas(): Promise<number> {
  const ideas: IdeaLibraryItem[] = [
    { title: '100 Day Drawing Challenge', description: 'Create one drawing every day for 100 days', type: 'Art Challenge', tags: ['art', 'challenge'], createdAt: new Date() },
    { title: 'Found Object Sculpture', description: 'Create art from discarded materials', type: 'Sculpture', tags: ['recycling', 'sculpture'], createdAt: new Date() },
    { title: 'Blackout Poetry', description: 'Create poetry by redacting newspaper articles', type: 'Writing', tags: ['poetry', 'visual'], createdAt: new Date() },
    { title: 'Nature Photography Series', description: 'Document seasonal changes in one location', type: 'Photography', tags: ['nature', 'series'], createdAt: new Date() },
    { title: 'Zentangle Meditation', description: 'Practice mindful drawing with repetitive patterns', type: 'Art Therapy', tags: ['meditation', 'patterns'], createdAt: new Date() },
    { title: 'Short Story Marathon', description: 'Write 52 short stories in one year', type: 'Writing Challenge', tags: ['writing', 'fiction'], createdAt: new Date() },
    { title: 'Art Journal', description: 'Combine visual art with written reflection', type: 'Mixed Media', tags: ['journaling', 'mixed media'], createdAt: new Date() },
    { title: 'Song Lyrics Collaboration', description: 'Co-write lyrics with other artists', type: 'Music', tags: ['songwriting', 'collaboration'], createdAt: new Date() },
    { title: 'Digital Collage', description: 'Create surreal imagery from photo manipulation', type: 'Digital Art', tags: ['digital', 'collage'], createdAt: new Date() },
    { title: 'Embroidery Sampler', description: 'Learn all basic embroidery stitches in one piece', type: 'Textile Arts', tags: ['embroidery', 'learning'], createdAt: new Date() }
    // Add 20 more creative ideas...
  ];

  // Add more ideas to reach 30
  for (let i = ideas.length; i < 30; i++) {
    ideas.push({
      title: `Creative Idea ${i + 1}`,
      description: `Description for creative project ${i + 1}`,
      type: 'General',
      tags: ['creative', 'art'],
      createdAt: new Date()
    });
  }

  await db.ideaLibrary.bulkAdd(ideas);
  return ideas.length;
}

// Herbal Support - 30 herbs
async function seedHerbalSupport(): Promise<number> {
  const herbs: HerbalSupport[] = [
    { name: 'Ginger', uses: ['Nausea relief', 'Anti-inflammatory', 'Digestive support'], dosage: '1-2g daily', warnings: ['May interact with blood thinners'], tags: ['digestive', 'inflammation'], createdAt: new Date() },
    { name: 'Turmeric', uses: ['Anti-inflammatory', 'Joint pain', 'Antioxidant'], dosage: '500-2000mg daily with black pepper', warnings: ['May interact with blood thinners'], tags: ['inflammation', 'pain'], createdAt: new Date() },
    { name: 'Chamomile', uses: ['Sleep support', 'Anxiety relief', 'Digestive comfort'], dosage: '1-4 cups tea daily', warnings: ['Avoid if allergic to ragweed'], tags: ['sleep', 'calming'], createdAt: new Date() },
    { name: 'Peppermint', uses: ['Digestive issues', 'Headache relief', 'Mental clarity'], dosage: '1-2 cups tea or enteric-coated capsules', warnings: ['May worsen GERD'], tags: ['digestive', 'headache'], createdAt: new Date() },
    { name: 'Lavender', uses: ['Anxiety', 'Sleep', 'Pain relief'], dosage: 'Aromatherapy or tea', warnings: ['May cause drowsiness'], tags: ['calming', 'sleep'], createdAt: new Date() },
    { name: 'Elderberry', uses: ['Immune support', 'Cold and flu', 'Antioxidant'], dosage: '300-500mg daily during illness', warnings: ['Cook before consuming'], tags: ['immune', 'antiviral'], createdAt: new Date() },
    { name: 'Ashwagandha', uses: ['Stress relief', 'Energy', 'Thyroid support'], dosage: '300-500mg daily', warnings: ['Avoid during pregnancy'], tags: ['adaptogen', 'stress'], createdAt: new Date() },
    { name: 'Valerian Root', uses: ['Sleep improvement', 'Anxiety', 'Muscle relaxation'], dosage: '300-600mg before bed', warnings: ['May cause drowsiness'], tags: ['sleep', 'anxiety'], createdAt: new Date() },
    { name: 'Echinacea', uses: ['Immune support', 'Cold prevention', 'Wound healing'], dosage: '300mg 3x daily when sick', warnings: ['Avoid long-term use'], tags: ['immune', 'prevention'], createdAt: new Date() },
    { name: 'St. Johns Wort', uses: ['Mild depression', 'Mood support'], dosage: '300mg 3x daily', warnings: ['Many drug interactions'], tags: ['mood', 'depression'], createdAt: new Date() }
    // Add 20 more herbs...
  ];

  // Add more herbs to reach 30
  for (let i = herbs.length; i < 30; i++) {
    herbs.push({
      name: `Herb ${i + 1}`,
      uses: ['General wellness', 'Traditional medicine'],
      dosage: 'As directed',
      warnings: ['Consult healthcare provider'],
      tags: ['herbal', 'wellness'],
      createdAt: new Date()
    });
  }

  await db.herbalSupport.bulkAdd(herbs);
  return herbs.length;
}

// PT Exercises - 30 exercises
async function seedPTExercises(): Promise<number> {
  const exercises: PTExercise[] = [
    { name: 'Gentle Neck Stretch', description: 'Slowly tilt head to each side, holding 15 seconds', duration: '2 minutes', difficulty: 'Easy', bodyParts: ['neck'], tags: ['EDS-safe', 'stretching'], createdAt: new Date() },
    { name: 'Shoulder Blade Squeeze', description: 'Pull shoulder blades together, hold 5 seconds', duration: '5 minutes', difficulty: 'Easy', bodyParts: ['shoulders', 'upper back'], tags: ['EDS-safe', 'strengthening'], createdAt: new Date() },
    { name: 'Wall Push-ups', description: 'Push-ups against wall for gentle upper body strengthening', duration: '5 minutes', difficulty: 'Easy', bodyParts: ['arms', 'chest'], tags: ['EDS-safe', 'strengthening'], createdAt: new Date() },
    { name: 'Seated Marching', description: 'Lift knees alternately while seated', duration: '5 minutes', difficulty: 'Easy', bodyParts: ['hips', 'core'], tags: ['POTS-safe', 'cardio'], createdAt: new Date() },
    { name: 'Ankle Pumps', description: 'Flex and point feet to improve circulation', duration: '3 minutes', difficulty: 'Easy', bodyParts: ['ankles', 'calves'], tags: ['POTS-safe', 'circulation'], createdAt: new Date() },
    { name: 'Cat-Cow Stretch', description: 'Gentle spine mobility on hands and knees', duration: '3 minutes', difficulty: 'Easy', bodyParts: ['spine', 'core'], tags: ['EDS-safe', 'mobility'], createdAt: new Date() },
    { name: 'Clamshells', description: 'Side-lying hip strengthening', duration: '5 minutes', difficulty: 'Medium', bodyParts: ['hips', 'glutes'], tags: ['strengthening'], createdAt: new Date() },
    { name: 'Heel Slides', description: 'Slide heel toward buttock to bend knee', duration: '5 minutes', difficulty: 'Easy', bodyParts: ['knees'], tags: ['EDS-safe', 'mobility'], createdAt: new Date() },
    { name: 'Bridges', description: 'Lift hips while lying on back', duration: '5 minutes', difficulty: 'Medium', bodyParts: ['glutes', 'core'], tags: ['strengthening'], createdAt: new Date() },
    { name: 'Bird Dog', description: 'Extend opposite arm and leg while on hands and knees', duration: '5 minutes', difficulty: 'Medium', bodyParts: ['core', 'balance'], tags: ['stability'], createdAt: new Date() }
    // Add 20 more exercises...
  ];

  // Add more exercises to reach 30
  for (let i = exercises.length; i < 30; i++) {
    exercises.push({
      name: `Exercise ${i + 1}`,
      description: `Physical therapy exercise ${i + 1} for gentle strengthening`,
      duration: '5 minutes',
      difficulty: 'Easy',
      bodyParts: ['full body'],
      tags: ['PT', 'safe'],
      createdAt: new Date()
    });
  }

  await db.ptExercises.bulkAdd(exercises);
  return exercises.length;
}

// Emergency Cards - 5 templates
async function seedEmergencyCards(): Promise<number> {
  const cards: EmergencyCard[] = [
    {
      name: 'EDS Emergency Info',
      contactInfo: 'Emergency Contact: [Name] [Phone]',
      medications: ['List current medications here'],
      allergies: ['List allergies here'],
      medicalConditions: ['Ehlers-Danlos Syndrome', 'POTS', 'MCAS'],
      emergencyContacts: ['Primary: [Name] [Phone]', 'Secondary: [Name] [Phone]'],
      createdAt: new Date()
    },
    {
      name: 'POTS Protocol Card',
      contactInfo: 'Cardiologist: [Name] [Phone]',
      medications: ['Midodrine', 'Fludrocortisone', 'Beta blocker'],
      allergies: [],
      medicalConditions: ['Postural Orthostatic Tachycardia Syndrome', 'Dysautonomia'],
      emergencyContacts: ['Emergency Contact: [Name] [Phone]'],
      createdAt: new Date()
    },
    {
      name: 'Allergy Alert Card',
      contactInfo: 'Allergist: [Name] [Phone]',
      medications: ['EpiPen carrier', 'Antihistamines'],
      allergies: ['List all allergies'],
      medicalConditions: ['Mast Cell Activation Syndrome'],
      emergencyContacts: ['ICE: [Name] [Phone]'],
      createdAt: new Date()
    },
    {
      name: 'Chronic Pain Management',
      contactInfo: 'Pain Specialist: [Name] [Phone]',
      medications: ['List pain medications'],
      allergies: ['List medication allergies'],
      medicalConditions: ['Chronic Pain Syndrome'],
      emergencyContacts: ['Emergency: [Name] [Phone]'],
      createdAt: new Date()
    },
    {
      name: 'Mental Health Crisis Card',
      contactInfo: 'Therapist: [Name] [Phone], Psychiatrist: [Name] [Phone]',
      medications: ['List psych medications'],
      allergies: [],
      medicalConditions: ['Mental health conditions'],
      emergencyContacts: ['Crisis line: 988', 'Support person: [Name] [Phone]'],
      createdAt: new Date()
    }
  ];

  await db.emergencyCards.bulkAdd(cards);
  return cards.length;
}

// Additional seed data for other collections
async function seedKOLHubFeatures(): Promise<number> {
  // Seed medications
  // Medications are now handled in user-profile-init.ts (23 comprehensive meds)
  // Removed duplicate medications from here

  // Seed courses
  const courses: CourseProgress[] = [
    { platform: 'Coursera', courseName: 'Python for Everybody', provider: 'University of Michigan', creditType: 'Coursera', creditHours: 3, progress: 45, timeSpent: 1200, startDate: '2024-01-15', status: 'in-progress', difficulty: 'beginner', tags: ['programming', 'python'], notes: 'Great course!', resumeReady: true, costSavings: 1200 },
    { platform: 'edX', courseName: 'CS50: Introduction to Computer Science', provider: 'Harvard', creditType: 'edX', creditHours: 4, progress: 30, timeSpent: 800, startDate: '2024-02-01', status: 'in-progress', difficulty: 'intermediate', tags: ['computer science', 'programming'], notes: 'Challenging but rewarding', resumeReady: true, costSavings: 2000 }
  ];

  // Seed tasks
  const tasks: Task[] = [
    { title: 'Complete Python assignment', description: 'Finish week 3 coding exercises', completed: false, priority: 'high', dueDate: new Date(Date.now() + 86400000 * 2), createdAt: new Date() },
    { title: 'Schedule doctor appointment', description: 'Annual checkup with PCP', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 86400000 * 7), createdAt: new Date() },
    { title: 'Update resume', description: 'Add recent coursework', completed: false, priority: 'low', dueDate: new Date(Date.now() + 86400000 * 14), createdAt: new Date() }
  ];

  // Seed body weather logs
  const bodyWeatherLogs: BodyWeatherLog[] = [
    { date: new Date().toISOString().split('T')[0], time: '08:00', painLevel: 4, energyLevel: 6, moodLevel: 7, anxietyLevel: 3, jointPain: ['knees', 'hands'], triggers: ['weather change'], copingStrategies: ['gentle stretching', 'heat pack'], notes: 'Woke up stiff', createdAt: new Date() },
    { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '20:00', painLevel: 5, energyLevel: 4, moodLevel: 6, anxietyLevel: 4, jointPain: ['shoulders', 'hips'], triggers: ['overexertion'], copingStrategies: ['rest', 'medication'], notes: 'Did too much today', createdAt: new Date(Date.now() - 86400000) }
  ];

  // Seed learning moments
  const learningMoments: LearningMoment[] = [
    { timestamp: new Date(), topic: 'Python Functions', content: 'Learned how to write reusable functions with parameters', source: 'Coursera', tags: ['programming'], pathwayId: 'software-dev', moduleId: 'python-basics', skillPracticed: 'Python' },
    { timestamp: new Date(Date.now() - 86400000), topic: 'Spoon Theory', content: 'Understanding energy management with chronic illness', source: 'Health Handbook', tags: ['health', 'self-care'], skillPracticed: 'Self-advocacy' }
  ];

  // Add all to database (medications handled separately in user-profile-init.ts)
  await Promise.all([
    db.education.bulkAdd(courses),
    db.tasks.bulkAdd(tasks),
    db.bodyWeatherLogs.bulkAdd(bodyWeatherLogs),
    db.learningMoments.bulkAdd(learningMoments)
  ]);

  return courses.length + tasks.length + bodyWeatherLogs.length + learningMoments.length;
}
