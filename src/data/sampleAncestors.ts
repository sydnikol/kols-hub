import { Ancestor } from '../services/ancestryService';

/**
 * Sample ancestry data for demonstration purposes
 * This can be imported to quickly populate the family tree
 */
export const sampleAncestors: Omit<Ancestor, 'id'>[] = [
  // Generation 1 - Parents
  {
    name: 'Mary Johnson',
    birthYear: 1955,
    deathYear: 2015,
    birthPlace: 'Chicago, Illinois',
    occupation: 'School Teacher',
    relation: 'Mother',
    generation: 1,
    culturalBackground: ['Irish', 'German'],
    stories: [
      'She always made Sunday dinners special, gathering the whole family around the table with her famous pot roast.',
      'A dedicated teacher for 35 years, she touched hundreds of young lives and never stopped learning herself.',
      'She loved gardening and would spend hours tending to her roses, which she said reminded her of her own mother.'
    ],
    personality: 'Warm, nurturing, and endlessly patient. She had a gift for making everyone feel heard and valued.',
    languages: ['English', 'Some German'],
    recipes: [
      {
        id: 'recipe_1',
        name: "Mary's Famous Pot Roast",
        description: 'A family tradition passed down through generations',
        ingredients: ['Chuck roast', 'Carrots', 'Potatoes', 'Onions', 'Beef broth', 'Secret spice blend'],
        culturalSignificance: 'This recipe was served every Sunday for 40 years, bringing family together'
      }
    ]
  },
  {
    name: 'Robert Johnson',
    birthYear: 1952,
    birthPlace: 'Detroit, Michigan',
    occupation: 'Auto Mechanic',
    relation: 'Father',
    generation: 1,
    culturalBackground: ['Polish', 'Italian'],
    stories: [
      'He could fix anything with wheels and taught all his kids the importance of hard work and self-reliance.',
      'Every Saturday morning was spent in his garage workshop, where he taught valuable life lessons through car repairs.'
    ],
    personality: 'Strong, dependable, and practical. A man of few words but immense wisdom.',
    languages: ['English', 'Polish']
  },

  // Generation 2 - Grandparents
  {
    name: 'Margaret O\'Brien',
    birthYear: 1930,
    deathYear: 2005,
    birthPlace: 'Dublin, Ireland',
    occupation: 'Seamstress',
    relation: 'Maternal Grandmother',
    generation: 2,
    culturalBackground: ['Irish'],
    stories: [
      'She immigrated to America in 1950 with just one suitcase and a head full of dreams.',
      'Her Irish lullabies and stories of the old country kept our heritage alive through generations.',
      'She made all her grandchildren\'s first communion dresses by hand, each one a work of art.'
    ],
    personality: 'Resilient, creative, and deeply spiritual. She faced hardships with grace and humor.',
    languages: ['English', 'Irish Gaelic'],
    recipes: [
      {
        id: 'recipe_2',
        name: 'Traditional Irish Soda Bread',
        description: 'Made every St. Patrick\'s Day',
        culturalSignificance: 'A taste of home from the old country'
      }
    ]
  },
  {
    name: 'Thomas O\'Brien',
    birthYear: 1928,
    deathYear: 2000,
    birthPlace: 'County Cork, Ireland',
    occupation: 'Factory Worker',
    relation: 'Maternal Grandfather',
    generation: 2,
    culturalBackground: ['Irish'],
    stories: [
      'He worked three jobs to support his family and never complained about the sacrifices.',
      'A talented fiddle player, he brought Irish music to every family gathering.'
    ],
    personality: 'Hardworking, musical, and proud of his Irish heritage.',
    languages: ['English', 'Irish Gaelic']
  },
  {
    name: 'Anna Kowalski',
    birthYear: 1935,
    deathYear: 2010,
    birthPlace: 'Warsaw, Poland',
    occupation: 'Homemaker',
    relation: 'Paternal Grandmother',
    generation: 2,
    culturalBackground: ['Polish'],
    stories: [
      'She survived World War II and carried those lessons of resilience throughout her life.',
      'Her pierogi recipe was legendary in the neighborhood, and she taught it to all who asked.'
    ],
    personality: 'Strong-willed, generous, and deeply family-oriented.',
    languages: ['Polish', 'English'],
    recipes: [
      {
        id: 'recipe_3',
        name: 'Babcia\'s Pierogi',
        description: 'Traditional Polish dumplings',
        culturalSignificance: 'Made for every holiday and celebration'
      }
    ]
  },
  {
    name: 'Stefan Kowalski',
    birthYear: 1932,
    deathYear: 1998,
    birthPlace: 'Krakow, Poland',
    occupation: 'Carpenter',
    relation: 'Paternal Grandfather',
    generation: 2,
    culturalBackground: ['Polish'],
    stories: [
      'A master craftsman who built furniture that lasted generations.',
      'He taught that quality and integrity matter more than speed.'
    ],
    personality: 'Patient, skilled, and principled.',
    languages: ['Polish', 'English']
  },

  // Generation 3 - Great-Grandparents
  {
    name: 'Catherine Murphy',
    birthYear: 1905,
    deathYear: 1985,
    birthPlace: 'Galway, Ireland',
    occupation: 'Farmer',
    relation: 'Great-Grandmother',
    generation: 3,
    culturalBackground: ['Irish'],
    stories: [
      'She ran the family farm while her husband was away working in England.',
      'Known throughout the village for her healing herbs and traditional remedies.'
    ],
    personality: 'Independent, knowledgeable, and connected to the land.',
    languages: ['Irish Gaelic', 'English']
  },
  {
    name: 'Patrick Murphy',
    birthYear: 1900,
    deathYear: 1975,
    birthPlace: 'Galway, Ireland',
    occupation: 'Farmer',
    relation: 'Great-Grandfather',
    generation: 3,
    culturalBackground: ['Irish'],
    stories: [
      'A storyteller who kept the oral traditions of Ireland alive.',
      'He could trace the family line back eight generations by memory.'
    ],
    personality: 'Wise, traditional, and a keeper of family history.',
    languages: ['Irish Gaelic', 'English']
  },
  {
    name: 'Władysław Kowalski',
    birthYear: 1910,
    deathYear: 1980,
    birthPlace: 'Warsaw, Poland',
    occupation: 'Blacksmith',
    relation: 'Great-Grandfather',
    generation: 3,
    culturalBackground: ['Polish'],
    stories: [
      'A master blacksmith whose work was sought after throughout Warsaw.',
      'He taught that fire and iron, like life, must be shaped with patience and respect.'
    ],
    personality: 'Strong, traditional, and devoted to his craft.',
    languages: ['Polish']
  },
  {
    name: 'Helena Nowak',
    birthYear: 1912,
    deathYear: 1988,
    birthPlace: 'Krakow, Poland',
    occupation: 'Baker',
    relation: 'Great-Grandmother',
    generation: 3,
    culturalBackground: ['Polish'],
    stories: [
      'Her bakery was the heart of the neighborhood before the war.',
      'She hid Jewish families in her bakery during WWII, risking everything for what was right.'
    ],
    personality: 'Brave, compassionate, and steadfast in her values.',
    languages: ['Polish', 'Yiddish']
  }
];

/**
 * Function to load sample data into the ancestry service
 */
export async function loadSampleAncestors(ancestryService: any) {
  try {
    for (const ancestor of sampleAncestors) {
      await ancestryService.addAncestor(ancestor);
    }
    console.log('Sample ancestry data loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load sample data:', error);
    return false;
  }
}
