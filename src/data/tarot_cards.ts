// Complete Tarot Deck Data
// 78 Cards: 22 Major Arcana + 56 Minor Arcana

export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  suit: Suit;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  symbolism: string;
  advice: string;
  gothicDescription: string;
  element?: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  zodiac?: string;
  planet?: string;
}

// Major Arcana (22 cards)
export const majorArcana: TarotCard[] = [
  {
    id: 'major-0',
    name: 'The Fool',
    number: 0,
    suit: 'major',
    uprightMeaning: 'New beginnings, innocence, spontaneity, a free spirit. Taking a leap of faith into the unknown with optimism and trust.',
    reversedMeaning: 'Recklessness, risk-taking, naivety. Being held back by fear or making careless decisions without considering consequences.',
    keywords: ['beginnings', 'innocence', 'spontaneity', 'leap of faith', 'freedom'],
    symbolism: 'A figure stands at the edge of a cliff, bag on shoulder, white rose in hand, accompanied by a loyal dog. The precipice represents the unknown journey ahead.',
    advice: 'Take the leap. Trust in the universe and your own inner wisdom. This is a time to embrace the unknown with an open heart.',
    gothicDescription: 'A pale wanderer draped in tattered finery stands at the edge of an ancient precipice, moonlight catching their wild eyes. A spectral hound circles their feet as ravens wheel overhead. The abyss below whispers of infinite possibilities.',
    element: 'air',
    planet: 'Uranus'
  },
  {
    id: 'major-1',
    name: 'The Magician',
    number: 1,
    suit: 'major',
    uprightMeaning: 'Manifestation, resourcefulness, power, inspired action. You have all the tools and resources you need to manifest your desires.',
    reversedMeaning: 'Manipulation, poor planning, untapped talents. Misuse of power or skills remaining dormant.',
    keywords: ['manifestation', 'power', 'action', 'concentration', 'resourcefulness'],
    symbolism: 'A figure stands at an altar with the four suit symbols: wand, cup, sword, and pentacle. One hand points to heaven, the other to earth, channeling divine will into material reality.',
    advice: 'You are the conduit between spirit and matter. Focus your will and take action. Everything you need is already within you.',
    gothicDescription: 'In a candlelit chamber draped in velvet, the alchemist stands before their obsidian altar. The elements dance at their command—flame, chalice, athame, and coin arranged in sacred geometry. Their eyes burn with arcane knowledge.',
    element: 'air',
    planet: 'Mercury'
  },
  {
    id: 'major-2',
    name: 'The High Priestess',
    number: 2,
    suit: 'major',
    uprightMeaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind. Hidden truths and mysteries waiting to be revealed.',
    reversedMeaning: 'Secrets, disconnection from intuition, withdrawal. Information being withheld or inner voice being ignored.',
    keywords: ['intuition', 'mystery', 'wisdom', 'secrets', 'inner voice'],
    symbolism: 'A veiled priestess sits between two pillars—one black, one white—before a pomegranate veil. The crescent moon at her feet and scroll in her lap speak of hidden knowledge.',
    advice: 'Trust your intuition. The answers you seek lie within. Be still, listen to your inner voice, and let the mysteries reveal themselves.',
    gothicDescription: 'She sits upon her throne of shadows between pillars of bone and ivory, veil of cobwebs draped across her knowing face. The moon hangs heavy in her obsidian eyes as she guards the gateway between worlds.',
    element: 'water',
    planet: 'Moon'
  },
  {
    id: 'major-3',
    name: 'The Empress',
    number: 3,
    suit: 'major',
    uprightMeaning: 'Fertility, femininity, beauty, nature, abundance. Nurturing energy and creative expression flowing freely.',
    reversedMeaning: 'Creative block, dependence on others, smothering. Neglecting self-care or difficulty connecting with feminine energy.',
    keywords: ['abundance', 'nature', 'fertility', 'nurturing', 'sensuality'],
    symbolism: 'A crowned woman sits in a lush garden, surrounded by wheat and flowing water. Her gown is adorned with pomegranates, symbol of fertility.',
    advice: 'Connect with nature and your senses. Create, nurture, and allow abundance to flow through you. Embrace the pleasure of being alive.',
    gothicDescription: 'The dark mother reclines in her garden of nightshade and black roses, crowned with thorns and stars. Her pregnant belly holds the universe; her fingers drip with honey and venom. Life and death intertwine in her embrace.',
    element: 'earth',
    planet: 'Venus'
  },
  {
    id: 'major-4',
    name: 'The Emperor',
    number: 4,
    suit: 'major',
    uprightMeaning: 'Authority, structure, control, fatherhood. Establishing order and taking charge of your domain with wisdom.',
    reversedMeaning: 'Domination, rigidity, lack of discipline. Tyranny or an inability to establish necessary structure.',
    keywords: ['authority', 'structure', 'control', 'leadership', 'stability'],
    symbolism: 'A stern figure sits upon a stone throne adorned with ram heads, symbols of Mars. Mountains rise behind him, representing unshakeable foundation.',
    advice: 'Take command of your life. Establish healthy boundaries and create the structure needed to achieve your goals. Lead with wisdom, not force.',
    gothicDescription: 'The iron king sits upon his throne of skulls and ancient stone, armor rusted with the blood of countless battles. His eyes are storm clouds; his word is law. The castle walls tremble at his commands.',
    element: 'fire',
    zodiac: 'Aries'
  },
  {
    id: 'major-5',
    name: 'The Hierophant',
    number: 5,
    suit: 'major',
    uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition. Learning from established systems and institutions.',
    reversedMeaning: 'Personal beliefs, freedom, challenging the status quo. Breaking from tradition or questioning authority.',
    keywords: ['tradition', 'institutions', 'learning', 'conformity', 'spirituality'],
    symbolism: 'A religious figure sits between two pillars, right hand raised in blessing, left holding a triple cross. Two acolytes kneel before him, seeking wisdom.',
    advice: 'Seek wisdom from trusted teachers and traditions. Consider what beliefs serve you and which need to be examined or released.',
    gothicDescription: 'The keeper of forbidden manuscripts sits in the crypt-cathedral, keys to heaven and hell jangling at his waist. Acolytes in black robes bow before ancient texts written in languages older than humanity.',
    element: 'earth',
    zodiac: 'Taurus'
  },
  {
    id: 'major-6',
    name: 'The Lovers',
    number: 6,
    suit: 'major',
    uprightMeaning: 'Love, harmony, relationships, values alignment. Union and important choices regarding relationships and beliefs.',
    reversedMeaning: 'Self-love, disharmony, imbalance. Misalignment of values or avoiding important decisions.',
    keywords: ['love', 'union', 'choice', 'harmony', 'partnership'],
    symbolism: 'Two figures stand beneath an angel, a tree of knowledge behind one and a tree of life behind the other. The angel blesses their union.',
    advice: 'Follow your heart but honor your values. Whether romantic or not, this is about alignment and making choices that reflect your true self.',
    gothicDescription: 'Two souls intertwined beneath the blood moon, their flesh becoming one in the graveyard of forgotten vows. The dark angel above them weeps tears of starlight as fate binds them eternally.',
    element: 'air',
    zodiac: 'Gemini'
  },
  {
    id: 'major-7',
    name: 'The Chariot',
    number: 7,
    suit: 'major',
    uprightMeaning: 'Control, willpower, success, action, determination. Moving forward with confidence and overcoming obstacles.',
    reversedMeaning: 'Lack of control, aggression, obstacles. Direction lost or opposing forces creating internal conflict.',
    keywords: ['victory', 'willpower', 'determination', 'success', 'control'],
    symbolism: 'A warrior stands in a chariot drawn by two sphinxes—one black, one white. Stars crown their head as they hold no reins, controlling through will alone.',
    advice: 'Take the reins of your life. Channel opposing forces into forward momentum. Victory is assured if you stay focused and determined.',
    gothicDescription: 'The pale rider emerges from the mist, their chariot of black iron pulled by skeletal horses breathing shadow. Stars of conquered realms gleam in their midnight armor as they charge toward destiny.',
    element: 'water',
    zodiac: 'Cancer'
  },
  {
    id: 'major-8',
    name: 'Strength',
    number: 8,
    suit: 'major',
    uprightMeaning: 'Courage, persuasion, influence, compassion. Inner strength that tames wild forces through gentle power.',
    reversedMeaning: 'Inner strength, self-doubt, low energy. Feeling weak or struggling to access your inner power.',
    keywords: ['courage', 'patience', 'control', 'compassion', 'inner strength'],
    symbolism: 'A woman gently closes the jaws of a lion, an infinity symbol above her head. Her white robe speaks of purity of spirit.',
    advice: 'True strength is gentle. Approach challenges with patience and compassion. You have the inner fortitude to overcome any obstacle.',
    gothicDescription: 'In the moonlit clearing, the witch-maiden runs her pale fingers through the mane of a great black beast. Her gentleness tames what violence could never conquer. The infinity sign glows above her raven hair.',
    element: 'fire',
    zodiac: 'Leo'
  },
  {
    id: 'major-9',
    name: 'The Hermit',
    number: 9,
    suit: 'major',
    uprightMeaning: 'Soul-searching, introspection, being alone, inner guidance. A time for withdrawal to find wisdom within.',
    reversedMeaning: 'Isolation, loneliness, withdrawal. Either too much solitude or fear of being alone with oneself.',
    keywords: ['introspection', 'solitude', 'guidance', 'wisdom', 'inner light'],
    symbolism: 'An old figure stands alone on a mountain peak, lantern in hand containing a six-pointed star. The staff represents the path already traveled.',
    advice: 'Withdraw from the noise of the world. The answers you seek are within. Let your inner light guide the way through the darkness.',
    gothicDescription: 'The ancient one climbs the spiral tower, their lantern casting long shadows on stone walls carved with forgotten prophecies. Alone in the darkness, they seek the truth that only silence can reveal.',
    element: 'earth',
    zodiac: 'Virgo'
  },
  {
    id: 'major-10',
    name: 'Wheel of Fortune',
    number: 10,
    suit: 'major',
    uprightMeaning: 'Good luck, karma, life cycles, destiny, a turning point. The wheel turns and change is inevitable.',
    reversedMeaning: 'Bad luck, resistance to change, breaking cycles. Feeling stuck in negative patterns or fighting against fate.',
    keywords: ['cycles', 'fate', 'destiny', 'luck', 'change'],
    symbolism: 'A great wheel turns in the sky, four creatures at the corners representing the fixed signs. Figures rise and fall on the wheel\'s edge.',
    advice: 'Embrace the cycles of life. What rises must fall, but what falls will rise again. Trust in the turning of the wheel.',
    gothicDescription: 'The great wheel turns in the void, its spokes carved from the bones of gods. Creatures rise and fall upon its rim—kings becoming beggars, paupers becoming emperors—all dancing to destiny\'s eternal rhythm.',
    element: 'fire',
    planet: 'Jupiter'
  },
  {
    id: 'major-11',
    name: 'Justice',
    number: 11,
    suit: 'major',
    uprightMeaning: 'Justice, fairness, truth, cause and effect. Legal matters and karmic balance seeking resolution.',
    reversedMeaning: 'Unfairness, lack of accountability, dishonesty. Karma not yet balanced or avoiding responsibility.',
    keywords: ['truth', 'fairness', 'law', 'karma', 'balance'],
    symbolism: 'A crowned figure sits between two pillars, sword in one hand and scales in the other. The veil behind speaks of hidden consequences.',
    advice: 'Act with integrity and accept responsibility. The truth will emerge. Weigh your decisions carefully, for actions have consequences.',
    gothicDescription: 'She sits upon the throne of judgment, scales of shadow and light balanced in her skeletal grip. Her sword has tasted the blood of liars. All who stand before her face the weight of their own souls.',
    element: 'air',
    zodiac: 'Libra'
  },
  {
    id: 'major-12',
    name: 'The Hanged Man',
    number: 12,
    suit: 'major',
    uprightMeaning: 'Pause, surrender, letting go, new perspectives. Seeing the world from a different angle through willing sacrifice.',
    reversedMeaning: 'Delays, resistance, stalling. Refusing to make necessary sacrifices or being stuck in limbo.',
    keywords: ['sacrifice', 'surrender', 'perspective', 'pause', 'release'],
    symbolism: 'A figure hangs upside down from a living tree, suspended by one foot. Their face is serene, a halo around their head, finding peace in surrender.',
    advice: 'Sometimes the path forward requires letting go. Suspend your usual way of thinking. In stillness and surrender, illumination comes.',
    gothicDescription: 'Suspended from the gallows tree between worlds, the mystic hangs in willing sacrifice. Their eyes see what the standing cannot perceive—the secret geometry of the universe revealed in their inverted vision.',
    element: 'water',
    planet: 'Neptune'
  },
  {
    id: 'major-13',
    name: 'Death',
    number: 13,
    suit: 'major',
    uprightMeaning: 'Endings, change, transformation, transition. The death of the old to make way for rebirth and renewal.',
    reversedMeaning: 'Resistance to change, fear of endings, stagnation. Holding on to what must be released.',
    keywords: ['endings', 'transformation', 'rebirth', 'transition', 'letting go'],
    symbolism: 'A skeletal knight rides a white horse, carrying a black banner with a white rose. The sun sets between two towers as figures bow before the inevitable.',
    advice: 'Do not fear endings—they are doorways to new beginnings. Release what no longer serves you. Transformation awaits on the other side.',
    gothicDescription: 'The pale rider approaches on their steed of mist and bone, the banner of the white rose fluttering in the wind of endings. All must bow before this transformation—king and commoner alike return to the earth.',
    element: 'water',
    zodiac: 'Scorpio'
  },
  {
    id: 'major-14',
    name: 'Temperance',
    number: 14,
    suit: 'major',
    uprightMeaning: 'Balance, moderation, patience, purpose. The alchemical blending of opposites into harmony.',
    reversedMeaning: 'Imbalance, excess, lack of long-term vision. Extremes or difficulty finding middle ground.',
    keywords: ['balance', 'moderation', 'patience', 'harmony', 'alchemy'],
    symbolism: 'An angel stands with one foot on land and one in water, pouring water between two cups in an endless flow. The path leads to a distant sun.',
    advice: 'Seek balance in all things. Patience and moderation will bring harmony. Blend the disparate elements of your life into something greater.',
    gothicDescription: 'The twilight angel stands at the threshold between realms, pouring essence from chalice to chalice—never spilling, always flowing. In their hands, poison becomes medicine, darkness becomes light.',
    element: 'fire',
    zodiac: 'Sagittarius'
  },
  {
    id: 'major-15',
    name: 'The Devil',
    number: 15,
    suit: 'major',
    uprightMeaning: 'Shadow self, attachment, addiction, restriction. Bondage to material things or unhealthy patterns.',
    reversedMeaning: 'Releasing limiting beliefs, exploring dark thoughts, detachment. Breaking free from chains that bind.',
    keywords: ['bondage', 'materialism', 'shadow', 'addiction', 'temptation'],
    symbolism: 'A horned figure sits on a throne, two chained figures before it. But the chains are loose—they could remove them if they chose.',
    advice: 'Examine what binds you. The chains of addiction, fear, and materialism are often self-imposed. Acknowledge your shadow to transcend it.',
    gothicDescription: 'The Adversary lounges upon their throne of desire, bat wings unfurled in the sulfurous dark. The lovers at their feet wear chains of their own making—golden shackles they could slip free at any moment, if only they would.',
    element: 'earth',
    zodiac: 'Capricorn'
  },
  {
    id: 'major-16',
    name: 'The Tower',
    number: 16,
    suit: 'major',
    uprightMeaning: 'Sudden change, upheaval, chaos, revelation. Structures built on false foundations crumbling to reveal truth.',
    reversedMeaning: 'Fear of change, averting disaster. Delaying inevitable collapse or resisting necessary destruction.',
    keywords: ['upheaval', 'revelation', 'chaos', 'awakening', 'destruction'],
    symbolism: 'Lightning strikes a tower, setting it ablaze. Figures fall from its heights as the crown of ego is dislodged. Flames consume false structures.',
    advice: 'Sometimes destruction is necessary for growth. What crumbles was not built to last. In the rubble, you will find the foundation for something true.',
    gothicDescription: 'Lightning splits the sky as the tower of pride burns against the blood-red night. Figures tumble through the flames, their screams lost in thunder. From the ashes of illusion, terrible truth will rise.',
    element: 'fire',
    planet: 'Mars'
  },
  {
    id: 'major-17',
    name: 'The Star',
    number: 17,
    suit: 'major',
    uprightMeaning: 'Hope, faith, purpose, renewal. The calm after the storm, bringing healing and inspiration.',
    reversedMeaning: 'Lack of faith, despair, self-trust issues. Disconnection from hope or losing sight of purpose.',
    keywords: ['hope', 'faith', 'renewal', 'inspiration', 'serenity'],
    symbolism: 'A naked woman kneels by a pool, pouring water onto land and water. Eight stars shine above, the largest representing her guiding light.',
    advice: 'Have faith. After darkness comes the dawn. Pour your gifts into the world without reservation. You are being guided by something greater.',
    gothicDescription: 'Beneath the eternal stars, the maiden of hope kneels at the black pool, pouring silver water upon the grave-cold earth. Her nakedness is truth; her tears become the dew that heals all wounds.',
    element: 'air',
    zodiac: 'Aquarius'
  },
  {
    id: 'major-18',
    name: 'The Moon',
    number: 18,
    suit: 'major',
    uprightMeaning: 'Illusion, fear, anxiety, subconscious. The realm of dreams and shadows where nothing is as it seems.',
    reversedMeaning: 'Release of fear, repressed emotion, inner confusion. Facing what lurks in the shadows of the psyche.',
    keywords: ['illusion', 'intuition', 'dreams', 'fear', 'subconscious'],
    symbolism: 'A full moon hangs between two towers, a path winding into the distance. A wolf and dog howl, while a crayfish emerges from the depths.',
    advice: 'Not all is as it seems. Trust your intuition through the fog of illusion. Face your fears and let the moonlight illuminate hidden truths.',
    gothicDescription: 'The blood moon rises between the towers of madness and truth as creatures of the night lift their voices in eerie chorus. The path winds through the haunted vale where shadows dance and reality bleeds.',
    element: 'water',
    zodiac: 'Pisces'
  },
  {
    id: 'major-19',
    name: 'The Sun',
    number: 19,
    suit: 'major',
    uprightMeaning: 'Positivity, fun, warmth, success, vitality. Joy and celebration, the light of consciousness shining bright.',
    reversedMeaning: 'Inner child, feeling down, overly optimistic. Temporary clouds obscuring the light or excessive positivity masking truth.',
    keywords: ['joy', 'success', 'vitality', 'confidence', 'celebration'],
    symbolism: 'A child rides a white horse beneath a blazing sun, arms open wide. Sunflowers bloom and all is bathed in golden light.',
    advice: 'Embrace the light within you. This is a time of joy, success, and celebration. Let your inner child play in the warmth of life.',
    gothicDescription: 'Even in the realm of shadows, the sun must rise. The golden child rides through the garden of dark sunflowers, their laughter echoing through the manor. Light touches even the deepest darkness.',
    element: 'fire',
    planet: 'Sun'
  },
  {
    id: 'major-20',
    name: 'Judgement',
    number: 20,
    suit: 'major',
    uprightMeaning: 'Judgement, rebirth, inner calling, absolution. Awakening to a higher purpose and answering the call.',
    reversedMeaning: 'Self-doubt, refusal of call. Ignoring the inner calling or harsh self-judgment preventing growth.',
    keywords: ['rebirth', 'awakening', 'absolution', 'purpose', 'calling'],
    symbolism: 'An angel sounds a trumpet from the clouds as figures rise from their coffins, arms raised. The call to a higher purpose cannot be ignored.',
    advice: 'Heed the call of your higher self. This is a time of spiritual awakening and rebirth. Rise up and embrace your true purpose.',
    gothicDescription: 'The angel of resurrection sounds the horn of final reckoning as the dead rise from their ornate tombs. Souls shed their mortal shrouds, answering the eternal call that echoes through dimensions.',
    element: 'fire',
    planet: 'Pluto'
  },
  {
    id: 'major-21',
    name: 'The World',
    number: 21,
    suit: 'major',
    uprightMeaning: 'Completion, integration, accomplishment. The end of a major life cycle and the achievement of wholeness.',
    reversedMeaning: 'Seeking personal closure, short-cuts, delays. So close to completion but something remains unfinished.',
    keywords: ['completion', 'accomplishment', 'travel', 'wholeness', 'fulfillment'],
    symbolism: 'A dancer floats within a wreath of victory, the four corners occupied by the fixed signs. Wands in hand, the eternal dance continues.',
    advice: 'Celebrate your achievements. You have come full circle. The world is open to you—this ending is also a new beginning.',
    gothicDescription: 'The cosmic dancer twirls within the wreath of eternity, the four guardians watching from the corners of existence. All journeys end here, where every ending spirals into infinite beginnings.',
    element: 'earth',
    planet: 'Saturn'
  }
];

// Wands (Fire) - 14 cards
export const wands: TarotCard[] = [
  {
    id: 'wands-1',
    name: 'Ace of Wands',
    number: 1,
    suit: 'wands',
    uprightMeaning: 'Inspiration, new opportunities, growth, potential. A spark of creative fire igniting new beginnings.',
    reversedMeaning: 'Delays, lack of motivation, creative blocks. The flame struggles to catch or burns without purpose.',
    keywords: ['inspiration', 'creation', 'potential', 'new beginnings', 'enthusiasm'],
    symbolism: 'A hand emerges from a cloud, grasping a sprouting wand. Leaves fall like blessings as the seed of fire is planted.',
    advice: 'Seize this creative opportunity. The universe is handing you a gift of inspiration—use it wisely to begin something meaningful.',
    gothicDescription: 'From the storm clouds, a spectral hand offers a wand of black wood, its tip burning with green hellfire. Leaves of ash swirl around it—the gift of dark creation awaits.',
    element: 'fire'
  },
  {
    id: 'wands-2',
    name: 'Two of Wands',
    number: 2,
    suit: 'wands',
    uprightMeaning: 'Future planning, progress, decisions. Standing at the threshold of adventure, world in hand.',
    reversedMeaning: 'Fear of unknown, lack of planning. Staying in the comfort zone rather than venturing forth.',
    keywords: ['planning', 'decisions', 'discovery', 'progress', 'vision'],
    symbolism: 'A figure holds a globe while gazing out to sea from between two wands. The world awaits their choice.',
    advice: 'The world is in your hands. Make your plans and step boldly into the future. Adventure awaits those who dare to leave safety behind.',
    gothicDescription: 'From the parapet of the dark castle, the lord surveys distant lands through their scrying orb. Two torches burn at their sides—one road leads to glory, one to the abyss.',
    element: 'fire'
  },
  {
    id: 'wands-3',
    name: 'Three of Wands',
    number: 3,
    suit: 'wands',
    uprightMeaning: 'Expansion, foresight, overseas opportunities. Ships have been sent and now returns are awaited.',
    reversedMeaning: 'Playing small, lack of foresight, delays in plans. Unwilling to expand or ventures stalling.',
    keywords: ['expansion', 'foresight', 'enterprise', 'exploration', 'waiting'],
    symbolism: 'A figure watches ships sail toward distant shores, three wands planted behind them. The seeds of enterprise have been sown.',
    advice: 'Your efforts are underway. Watch for returning opportunities and prepare for expansion. Think bigger than your current boundaries.',
    gothicDescription: 'The merchant of shadows watches ghost ships sail through the mist from their cliff of obsidian. Three iron staves mark their territory—empires built on darkness and daring.',
    element: 'fire'
  },
  {
    id: 'wands-4',
    name: 'Four of Wands',
    number: 4,
    suit: 'wands',
    uprightMeaning: 'Celebration, joy, harmony, marriage. A time of happiness and the fruits of labor being enjoyed.',
    reversedMeaning: 'Personal celebration, inner harmony. Finding peace within rather than in external circumstances.',
    keywords: ['celebration', 'harmony', 'home', 'community', 'joy'],
    symbolism: 'Four wands form a canopy decorated with flowers as figures celebrate beneath. A castle in the distance represents home and security.',
    advice: 'Celebrate your achievements! This is a time for joy and community. Honor the milestones in your life with those you love.',
    gothicDescription: 'Beneath the bower of thorns and midnight roses, the dark revelry unfolds. Four iron stakes draped in spider silk frame the celebration—the Gothic wedding feast begins.',
    element: 'fire'
  },
  {
    id: 'wands-5',
    name: 'Five of Wands',
    number: 5,
    suit: 'wands',
    uprightMeaning: 'Conflict, competition, tension. Multiple forces struggling for dominance, chaos without resolution.',
    reversedMeaning: 'Avoiding conflict, respecting differences. Finding ways to work together despite disagreements.',
    keywords: ['conflict', 'competition', 'strife', 'tension', 'disagreement'],
    symbolism: 'Five figures brandish wands against each other in mock or real combat. The fight appears chaotic with no clear winner.',
    advice: 'Conflict can be productive if channeled well. Compete without destroying. Find the lesson in the struggle.',
    gothicDescription: 'In the courtyard of the ruined abbey, five souls clash with staves of shadow. Their battle echoes through empty halls—the struggle for supremacy in a realm of eternal night.',
    element: 'fire'
  },
  {
    id: 'wands-6',
    name: 'Six of Wands',
    number: 6,
    suit: 'wands',
    uprightMeaning: 'Success, public recognition, victory. The triumph parade as achievements are acknowledged by all.',
    reversedMeaning: 'Private achievement, fall from grace. Success that goes unrecognized or reputation being questioned.',
    keywords: ['victory', 'success', 'recognition', 'achievement', 'pride'],
    symbolism: 'A victorious figure rides through a crowd, wreath upon their wand, admirers cheering below. The battle has been won.',
    advice: 'Accept recognition gracefully. Your efforts have paid off and others see your success. Lead by example and inspire those who follow.',
    gothicDescription: 'Through the gates of the shadow city, the conqueror rides in their chariot of bone. Six torches light their path as the subjects of night bow in dark reverence.',
    element: 'fire'
  },
  {
    id: 'wands-7',
    name: 'Seven of Wands',
    number: 7,
    suit: 'wands',
    uprightMeaning: 'Defensiveness, perseverance, standing your ground. Holding position against multiple challenges.',
    reversedMeaning: 'Giving up, overwhelmed. Feeling unable to defend your position or abandoning the fight.',
    keywords: ['challenge', 'perseverance', 'defense', 'courage', 'determination'],
    symbolism: 'A lone figure stands on high ground, defending against six wands attacking from below. The advantageous position must be maintained.',
    advice: 'Stand your ground. You have the high ground—use it. Challenges may be many but your position is strong if you maintain courage.',
    gothicDescription: 'Atop the crumbling tower, the lone defender faces the rising tide of shadows. Six spectral staves thrust upward—but the high ground belongs to those who refuse to fall.',
    element: 'fire'
  },
  {
    id: 'wands-8',
    name: 'Eight of Wands',
    number: 8,
    suit: 'wands',
    uprightMeaning: 'Movement, fast-paced change, swift action. Everything is moving quickly toward resolution.',
    reversedMeaning: 'Delays, frustration, internal resistance. Things slowing down or messages not reaching their destination.',
    keywords: ['speed', 'action', 'movement', 'change', 'progress'],
    symbolism: 'Eight wands fly through the air toward a distant target. Nothing can stop their momentum—action is already in motion.',
    advice: 'Things are moving fast—stay alert and adaptable. Messages are coming. What you set in motion is about to arrive.',
    gothicDescription: 'Through the crimson sky, eight flaming arrows streak toward their doom. Time bends and races—the message of fate travels faster than mortal understanding.',
    element: 'fire'
  },
  {
    id: 'wands-9',
    name: 'Nine of Wands',
    number: 9,
    suit: 'wands',
    uprightMeaning: 'Resilience, courage, persistence. Wounded but still standing, preparing for what comes next.',
    reversedMeaning: 'Exhaustion, paranoia, giving up. Too tired to continue fighting or defending without real threat.',
    keywords: ['resilience', 'persistence', 'courage', 'stamina', 'defensiveness'],
    symbolism: 'A battered figure leans on a wand, eight others forming a defensive wall behind. Wounded but prepared for the final test.',
    advice: 'You have been through much, but the end is near. Gather your remaining strength. One more push and victory will be yours.',
    gothicDescription: 'Blood-soaked and weary, the warrior stands before their palisade of iron spears. The scars of countless battles mark their flesh—but they will not fall before the final dawn.',
    element: 'fire'
  },
  {
    id: 'wands-10',
    name: 'Ten of Wands',
    number: 10,
    suit: 'wands',
    uprightMeaning: 'Burden, extra responsibility, hard work. Carrying too much but pushing toward the goal nonetheless.',
    reversedMeaning: 'Doing it all, inability to delegate. Collapsing under pressure or learning to let go of excess burdens.',
    keywords: ['burden', 'responsibility', 'hard work', 'stress', 'achievement'],
    symbolism: 'A figure struggles to carry ten wands toward a distant town. The weight is almost too much, but the destination is in sight.',
    advice: 'You are carrying too much. Delegate, release, or push through—but recognize the weight you bear. The goal is close.',
    gothicDescription: 'Bent beneath the weight of ten iron staves, the bearer trudges toward the distant castle. Each burden represents a vow, a duty, a curse—the price of ambition in the realm of shadows.',
    element: 'fire'
  },
  {
    id: 'wands-11',
    name: 'Page of Wands',
    number: 11,
    suit: 'wands',
    uprightMeaning: 'Exploration, enthusiasm, free spirit. A young energy eager to discover and create without limits.',
    reversedMeaning: 'Hasty, lacking direction, unrealistic. Creative energy without focus or commitment issues.',
    keywords: ['exploration', 'enthusiasm', 'discovery', 'potential', 'free spirit'],
    symbolism: 'A young figure holds a wand, gazing at it with wonder. Desert and pyramids behind suggest distant adventures ahead.',
    advice: 'Let your enthusiasm guide you toward new discoveries. This is a time for exploration and creative play without judgment.',
    gothicDescription: 'The young acolyte of flame holds their first wand of power, eyes bright with the promise of dark arts yet to master. The crypt awaits their exploration.',
    element: 'fire'
  },
  {
    id: 'wands-12',
    name: 'Knight of Wands',
    number: 12,
    suit: 'wands',
    uprightMeaning: 'Energy, passion, adventure. Charging forward with enthusiasm and courage toward exciting goals.',
    reversedMeaning: 'Passion without direction, recklessness. Moving too fast without considering consequences.',
    keywords: ['action', 'passion', 'adventure', 'energy', 'impulsiveness'],
    symbolism: 'An armored knight charges on horseback, wand held high. Salamanders adorn their clothing, symbols of fire and transformation.',
    advice: 'Channel your passion into purposeful action. Charge forward but maintain direction. Adventure awaits the bold.',
    gothicDescription: 'The dark rider thunders through the burning forest, their cape of flames trailing behind. On their steed of shadow and smoke, they seek the next conquest, the next thrill.',
    element: 'fire'
  },
  {
    id: 'wands-13',
    name: 'Queen of Wands',
    number: 13,
    suit: 'wands',
    uprightMeaning: 'Courage, confidence, determination. A warm and inspiring presence who leads with passion and grace.',
    reversedMeaning: 'Self-respect, self-confidence. Needing to reclaim personal power or dealing with jealousy.',
    keywords: ['confidence', 'passion', 'warmth', 'determination', 'vibrancy'],
    symbolism: 'A queen sits upon her throne holding a wand, a sunflower in her other hand. Lions adorn her throne, and a black cat sits at her feet.',
    advice: 'Lead with warmth and confidence. Your presence inspires others. Embrace your power without apology.',
    gothicDescription: 'Upon her throne of obsidian, the Queen of Flames holds court. Her eyes burn with ancient power; her black cat familiar purrs dark prophecies. She rules with passion and without mercy.',
    element: 'fire'
  },
  {
    id: 'wands-14',
    name: 'King of Wands',
    number: 14,
    suit: 'wands',
    uprightMeaning: 'Natural-born leader, vision, entrepreneur. One who inspires others through bold action and clear direction.',
    reversedMeaning: 'High expectations, domineering. Leadership that becomes tyrannical or visions that become obsessions.',
    keywords: ['leadership', 'vision', 'entrepreneur', 'honor', 'boldness'],
    symbolism: 'A king sits upon a throne adorned with lions and salamanders, wand in hand. His gaze is focused on distant horizons.',
    advice: 'Lead with vision and inspire through action. Your natural authority draws others to your cause. Use this power wisely.',
    gothicDescription: 'The Fire King commands from his throne of forged iron and dragon bone. Salamanders dance in the flames around him—his word ignites revolutions, his vision shapes the night.',
    element: 'fire'
  }
];

// Cups (Water) - 14 cards
export const cups: TarotCard[] = [
  {
    id: 'cups-1',
    name: 'Ace of Cups',
    number: 1,
    suit: 'cups',
    uprightMeaning: 'Love, new feelings, emotional awakening. The overflow of the heart bringing new connections and spiritual gifts.',
    reversedMeaning: 'Self-love, repressed emotions. Blocked emotional expression or need to fill one\'s own cup first.',
    keywords: ['love', 'emotions', 'intuition', 'spirituality', 'new relationships'],
    symbolism: 'A hand holds a chalice from which five streams of water flow. A dove descends with the host—divine love made manifest.',
    advice: 'Open your heart to receive and give love. New emotional experiences are offered to you. Let the waters of the soul flow freely.',
    gothicDescription: 'From the veiled beyond, a hand offers the chalice of tears and devotion. Five streams of moonlit water pour forth—love\'s poison and cure in a single sacred vessel.',
    element: 'water'
  },
  {
    id: 'cups-2',
    name: 'Two of Cups',
    number: 2,
    suit: 'cups',
    uprightMeaning: 'Unified love, partnership, attraction. Two souls finding each other and creating something greater together.',
    reversedMeaning: 'Self-love, break-ups, disharmony. Imbalance in partnership or needing to love oneself before another.',
    keywords: ['partnership', 'love', 'connection', 'attraction', 'union'],
    symbolism: 'Two figures exchange cups beneath a caduceus and lion\'s head. The chemistry between them is palpable and balanced.',
    advice: 'Honor this connection. Whether romantic or platonic, this partnership has the potential for beautiful balance and mutual growth.',
    gothicDescription: 'Beneath the winged serpent, two souls exchange chalices of blood and wine. Their bond transcends mortal understanding—love written in the stars and sealed in shadow.',
    element: 'water'
  },
  {
    id: 'cups-3',
    name: 'Three of Cups',
    number: 3,
    suit: 'cups',
    uprightMeaning: 'Celebration, friendship, community. Joy shared multiplies—the gathering of kindred spirits.',
    reversedMeaning: 'Independence, alone time, third party. Too much socializing or needing solitude to recharge.',
    keywords: ['celebration', 'friendship', 'community', 'joy', 'gathering'],
    symbolism: 'Three figures dance and raise their cups in celebration. Fruits and flowers surround them in abundance.',
    advice: 'Celebrate with your community. Joy is amplified when shared. Honor your friendships and the connections that sustain you.',
    gothicDescription: 'In the midnight garden, three witches raise their goblets beneath the harvest moon. Their laughter echoes through the mist—the coven celebrates another year of dark sisterhood.',
    element: 'water'
  },
  {
    id: 'cups-4',
    name: 'Four of Cups',
    number: 4,
    suit: 'cups',
    uprightMeaning: 'Meditation, contemplation, apathy. Turning inward and perhaps missing opportunities offered.',
    reversedMeaning: 'Retreat, withdrawal, re-evaluation. Taking time to assess what truly matters before accepting new offers.',
    keywords: ['contemplation', 'apathy', 're-evaluation', 'meditation', 'withdrawal'],
    symbolism: 'A figure sits under a tree, arms crossed, while a hand offers a fourth cup. Three cups sit before them unnoticed.',
    advice: 'Look beyond your current dissatisfaction. Opportunities are being offered—are you too caught in your own thoughts to see them?',
    gothicDescription: 'Beneath the weeping willow, the melancholic broods over three empty chalices. A spectral hand offers another, but their eyes see only the void within.',
    element: 'water'
  },
  {
    id: 'cups-5',
    name: 'Five of Cups',
    number: 5,
    suit: 'cups',
    uprightMeaning: 'Regret, failure, disappointment, loss. Grieving what has been lost while failing to see what remains.',
    reversedMeaning: 'Personal setbacks, self-forgiveness, moving on. Beginning to heal and turn toward the future.',
    keywords: ['loss', 'regret', 'disappointment', 'grief', 'pessimism'],
    symbolism: 'A cloaked figure mourns before three spilled cups, two standing cups behind unnoticed. A bridge leads to a distant castle.',
    advice: 'It is okay to grieve what you have lost. But when ready, turn around—there is still hope, still love, still a path forward.',
    gothicDescription: 'Cloaked in shadow, the mourner weeps before the spilled chalices of lost love. They cannot see the two vessels that still hold promise—grief blinds even in the moonlight.',
    element: 'water'
  },
  {
    id: 'cups-6',
    name: 'Six of Cups',
    number: 6,
    suit: 'cups',
    uprightMeaning: 'Nostalgia, reunion, childhood memories. The sweet return to simpler times and innocent joy.',
    reversedMeaning: 'Living in the past, moving forward. Needing to release the past to embrace the present.',
    keywords: ['nostalgia', 'memories', 'innocence', 'reunion', 'childhood'],
    symbolism: 'A child offers a cup filled with flowers to another. Six cups filled with blooms speak of innocent pleasures and shared gifts.',
    advice: 'Honor your past while living in the present. Reconnect with what brought you joy as a child. Simple pleasures still hold magic.',
    gothicDescription: 'In the ruined courtyard, ghost children exchange cups of black roses. Memories of innocence linger in the crumbling stones—the past whispers through the present.',
    element: 'water'
  },
  {
    id: 'cups-7',
    name: 'Seven of Cups',
    number: 7,
    suit: 'cups',
    uprightMeaning: 'Fantasy, illusion, wishful thinking. Many dreams float before you—but which are real? Choose wisely.',
    reversedMeaning: 'Alignment, personal values, getting real. Cutting through illusion to focus on what truly matters.',
    keywords: ['illusion', 'fantasy', 'choices', 'wishful thinking', 'imagination'],
    symbolism: 'A silhouette gazes at seven cups floating in clouds, each containing a vision: castle, treasure, dragon, snake, laurel, ghost, and veiled figure.',
    advice: 'Dreams are beautiful but discernment is necessary. Not all that glitters is gold. Ground your fantasies in reality and choose with wisdom.',
    gothicDescription: 'Before the dreamer, seven chalices float in the mist of possibility—each containing a dark gift, a tempting vision. But which is truth, and which is beautiful poison?',
    element: 'water'
  },
  {
    id: 'cups-8',
    name: 'Eight of Cups',
    number: 8,
    suit: 'cups',
    uprightMeaning: 'Disappointment, abandonment, walking away. Leaving behind what once mattered to seek something more meaningful.',
    reversedMeaning: 'Trying again, indecision, aimless drifting. Not yet ready to leave or unsure of direction.',
    keywords: ['departure', 'withdrawal', 'disappointment', 'seeking', 'letting go'],
    symbolism: 'A cloaked figure walks away from eight stacked cups, ascending into mountains beneath an eclipsing moon.',
    advice: 'Sometimes the bravest act is walking away. What you leave behind has served its purpose. New meaning awaits in the distance.',
    gothicDescription: 'Under the blood eclipse, the seeker abandons the eight empty chalices that once held meaning. The mountain path calls—somewhere beyond, the soul seeks its true home.',
    element: 'water'
  },
  {
    id: 'cups-9',
    name: 'Nine of Cups',
    number: 9,
    suit: 'cups',
    uprightMeaning: 'Contentment, satisfaction, wish fulfilled. The "wish card"—emotional satisfaction and gratitude achieved.',
    reversedMeaning: 'Inner happiness, materialism, dissatisfaction. Seeking validation outside rather than finding joy within.',
    keywords: ['satisfaction', 'wishes', 'contentment', 'gratitude', 'pleasure'],
    symbolism: 'A satisfied figure sits before nine golden cups, arms crossed contentedly. Their wish has been granted.',
    advice: 'Make a wish—it may well come true. Count your blessings and let satisfaction fill you. You have manifested something beautiful.',
    gothicDescription: 'The satisfied one sits before their collection of nine golden goblets, each containing a granted wish. In the candlelight, their smile is knowing—some wishes come with prices.',
    element: 'water'
  },
  {
    id: 'cups-10',
    name: 'Ten of Cups',
    number: 10,
    suit: 'cups',
    uprightMeaning: 'Divine love, harmony, alignment. The rainbow of emotional fulfillment—family, love, and lasting happiness.',
    reversedMeaning: 'Disconnection, misalignment. Family struggles or working toward but not yet achieving harmony.',
    keywords: ['harmony', 'family', 'fulfillment', 'happiness', 'homecoming'],
    symbolism: 'A family stands beneath a rainbow of ten cups, arms raised in celebration. Their home stands peacefully in the background.',
    advice: 'This is the emotional home you have always sought. Embrace love in all its forms. True fulfillment comes from connection and harmony.',
    gothicDescription: 'Beneath the aurora of ten ghostly chalices, the family of shadows stands united. Their ancestral manor rises behind them—across generations, love persists even in darkness.',
    element: 'water'
  },
  {
    id: 'cups-11',
    name: 'Page of Cups',
    number: 11,
    suit: 'cups',
    uprightMeaning: 'Creative opportunities, intuitive messages, inner child. A gentle soul with messages from the unconscious.',
    reversedMeaning: 'Creative blocks, emotional immaturity. Difficulty expressing feelings or messages being misunderstood.',
    keywords: ['messages', 'creativity', 'intuition', 'sensitivity', 'inner child'],
    symbolism: 'A young figure holds a cup from which a fish emerges, speaking messages from the deep. Their attire is fanciful and artistic.',
    advice: 'Listen to the messages of your heart and intuition. Creative inspiration is speaking to you. Approach life with childlike wonder.',
    gothicDescription: 'The dreaming page peers into their chalice where a spectral fish whispers secrets from the abyss. In their innocence, they hear what others cannot.',
    element: 'water'
  },
  {
    id: 'cups-12',
    name: 'Knight of Cups',
    number: 12,
    suit: 'cups',
    uprightMeaning: 'Romance, charm, imagination. The romantic hero arrives, bringing offers of love and creative inspiration.',
    reversedMeaning: 'Unrealistic, jealousy, moodiness. Romance without substance or emotions becoming overwhelming.',
    keywords: ['romance', 'imagination', 'charm', 'messenger', 'poetry'],
    symbolism: 'A knight rides slowly on a white horse, offering a cup. Wings adorn their helmet; fish dance on their garments.',
    advice: 'Follow your heart and let romance lead you. Whether love or creative passion, pursue what moves your soul.',
    gothicDescription: 'The poet-knight rides through the misty vale, chalice extended in eternal offering. Their heart bleeds verse and devotion—the romantic specter seeking their eternal muse.',
    element: 'water'
  },
  {
    id: 'cups-13',
    name: 'Queen of Cups',
    number: 13,
    suit: 'cups',
    uprightMeaning: 'Compassion, intuition, emotional security. A nurturing presence who understands the depths of the heart.',
    reversedMeaning: 'Self-care, emotional boundaries. Needing to nurture oneself or becoming too absorbed in others\' emotions.',
    keywords: ['compassion', 'intuition', 'nurturing', 'sensitivity', 'emotional security'],
    symbolism: 'A queen sits by the water, holding an ornate closed cup. Angels adorn her throne; she gazes at her treasure with knowing eyes.',
    advice: 'Trust your intuition absolutely. Nurture yourself and others with compassion. The depths of emotion are your greatest strength.',
    gothicDescription: 'Upon her throne of seashells and tears, the Ocean Queen holds her chalice of secrets. Her eyes contain fathomless depths—she has drowned in love and risen as its sovereign.',
    element: 'water'
  },
  {
    id: 'cups-14',
    name: 'King of Cups',
    number: 14,
    suit: 'cups',
    uprightMeaning: 'Emotional balance, compassion, diplomacy. A master of emotions who remains calm in any storm.',
    reversedMeaning: 'Emotional manipulation, moodiness. Using emotions to control or difficulty managing one\'s own feelings.',
    keywords: ['compassion', 'wisdom', 'diplomacy', 'emotional balance', 'calm'],
    symbolism: 'A king sits on a throne in turbulent waters, yet remains balanced. He holds cup and scepter with equal grace.',
    advice: 'Master your emotions rather than being mastered by them. Lead with compassion and diplomacy. Be the calm in the storm.',
    gothicDescription: 'Amid the tempest, the Storm King sits unmoved upon his floating throne. Leviathans rise around him, but his chalice never spills—he has become one with the ocean\'s chaos.',
    element: 'water'
  }
];

// Swords (Air) - 14 cards
export const swords: TarotCard[] = [
  {
    id: 'swords-1',
    name: 'Ace of Swords',
    number: 1,
    suit: 'swords',
    uprightMeaning: 'Breakthrough, clarity, sharp mind. A surge of mental power cutting through confusion to reveal truth.',
    reversedMeaning: 'Confusion, brutality, chaos. Mental fog or harsh truth causing more harm than healing.',
    keywords: ['clarity', 'truth', 'breakthrough', 'mental power', 'new ideas'],
    symbolism: 'A hand grasps a sword crowned with a laurel wreath, emerging from clouds. The double-edged blade cuts through illusion.',
    advice: 'Use this mental clarity wisely. The sword cuts both ways—speak truth but with care. This is your moment of breakthrough.',
    gothicDescription: 'From the storm, a pale hand thrusts forth the blade of revelation. Lightning crowns its edge—truth cuts through all shadow, but its wound never fully heals.',
    element: 'air'
  },
  {
    id: 'swords-2',
    name: 'Two of Swords',
    number: 2,
    suit: 'swords',
    uprightMeaning: 'Difficult choices, indecision, stalemate. Blindfolded to avoid seeing what must be decided.',
    reversedMeaning: 'Indecision, lies, information overload. Paralysis from too much information or deliberate avoidance of truth.',
    keywords: ['indecision', 'stalemate', 'denial', 'blocked emotions', 'avoidance'],
    symbolism: 'A blindfolded figure sits before the sea, two swords crossed over their heart. The moon rises over the water.',
    advice: 'You cannot avoid this decision forever. Remove the blindfold and face what you fear to see. The truth will set you free.',
    gothicDescription: 'Blindfolded in the moonlight, the maiden holds crossed blades against her heart. The sea whispers of choices she refuses to make—but the tide waits for no one.',
    element: 'air'
  },
  {
    id: 'swords-3',
    name: 'Three of Swords',
    number: 3,
    suit: 'swords',
    uprightMeaning: 'Heartbreak, emotional pain, grief. The piercing sorrow of loss and the storm of tears that follows.',
    reversedMeaning: 'Recovery, healing, releasing pain. Beginning to mend what was broken and letting go of grief.',
    keywords: ['heartbreak', 'grief', 'sorrow', 'pain', 'separation'],
    symbolism: 'Three swords pierce a heart against a backdrop of storm clouds and rain. The wound is fresh and deep.',
    advice: 'Allow yourself to feel this pain—it is part of the human experience. The rain will pass, and the heart will heal.',
    gothicDescription: 'In the eternal storm, three black blades pierce the bleeding heart suspended in the sky. Each sword is a truth too sharp to bear—yet bear it we must, to truly live.',
    element: 'air'
  },
  {
    id: 'swords-4',
    name: 'Four of Swords',
    number: 4,
    suit: 'swords',
    uprightMeaning: 'Rest, relaxation, meditation. A necessary pause to recover strength and clarity before continuing.',
    reversedMeaning: 'Exhaustion, recovery, stagnation. Either forced rest or inability to find peace and stillness.',
    keywords: ['rest', 'meditation', 'recuperation', 'stillness', 'contemplation'],
    symbolism: 'A knight lies in repose upon a tomb, three swords above and one below. Stained glass depicts a blessing.',
    advice: 'Rest is not surrender—it is strategy. Take this time to recover and reflect. The battle will wait for you.',
    gothicDescription: 'In the candlelit crypt, the knight rests upon their stone bed, three blades suspended above. Even warriors of shadow must sleep—and in dreams, they find strength for dawn.',
    element: 'air'
  },
  {
    id: 'swords-5',
    name: 'Five of Swords',
    number: 5,
    suit: 'swords',
    uprightMeaning: 'Conflict, defeat, winning at all costs. Victory that feels hollow because of how it was achieved.',
    reversedMeaning: 'Reconciliation, making amends. Learning from past conflicts and seeking to repair damage done.',
    keywords: ['conflict', 'defeat', 'betrayal', 'loss', 'dishonor'],
    symbolism: 'A figure smirks holding three swords while two others walk away dejected. Two swords lie on the ground. Storm clouds gather.',
    advice: 'Consider the cost of this victory. What have you truly won if you\'ve lost respect or connection? Sometimes the only way to win is not to fight.',
    gothicDescription: 'Beneath the storm-green sky, the victor collects the swords of the fallen. Their smile is hollow—for in the realm of shadows, to defeat another is to wound oneself.',
    element: 'air'
  },
  {
    id: 'swords-6',
    name: 'Six of Swords',
    number: 6,
    suit: 'swords',
    uprightMeaning: 'Transition, leaving behind, moving on. A difficult but necessary journey toward calmer waters.',
    reversedMeaning: 'Personal transition, resistance, unfinished business. Difficulty letting go of what should be left behind.',
    keywords: ['transition', 'moving on', 'travel', 'release', 'recovery'],
    symbolism: 'A ferryman guides a boat carrying a cloaked figure and child. Six swords stand in the bow as they journey from rough to calm waters.',
    advice: 'The journey may be difficult, but it leads to peace. Leave what burdens you on the shore behind. Better shores await.',
    gothicDescription: 'Across the river of the dead, the boatman ferries the living toward distant peace. Six phantom blades stand sentinel in the prow—the weight of what we carry shapes where we go.',
    element: 'air'
  },
  {
    id: 'swords-7',
    name: 'Seven of Swords',
    number: 7,
    suit: 'swords',
    uprightMeaning: 'Deception, trickery, strategy. Someone acting with less than honest intentions, perhaps even yourself.',
    reversedMeaning: 'Imposter syndrome, self-deceit. Coming clean about deceptions or realizing self-sabotaging patterns.',
    keywords: ['deception', 'stealth', 'strategy', 'betrayal', 'cunning'],
    symbolism: 'A figure sneaks away from a camp carrying five swords, leaving two behind. Their expression is cunning, glancing back.',
    advice: 'Examine your own actions—are you being fully honest? Or if this is about another, trust your instincts about their intentions.',
    gothicDescription: 'Through the sleeping encampment, the shadow thief creeps with stolen blades. Five truths concealed, two left behind—in the house of lies, everyone loses eventually.',
    element: 'air'
  },
  {
    id: 'swords-8',
    name: 'Eight of Swords',
    number: 8,
    suit: 'swords',
    uprightMeaning: 'Imprisonment, restriction, self-imposed limitation. Feeling trapped by circumstances that may be more flexible than they seem.',
    reversedMeaning: 'Self-acceptance, self-limitation, freedom. Recognizing that the bonds are not as tight as they seemed.',
    keywords: ['restriction', 'imprisonment', 'helplessness', 'self-imposed limitation', 'victim mentality'],
    symbolism: 'A bound and blindfolded figure stands amid eight swords. Water pools at their feet, castle in the distance.',
    advice: 'The cage may not be as locked as you believe. Question whether your limitations are real or self-imposed. Freedom is closer than you think.',
    gothicDescription: 'Bound in chains of her own thoughts, the maiden stands in the blade forest. But the bindings are silk, not steel—the prison exists only in the mind\'s shadow.',
    element: 'air'
  },
  {
    id: 'swords-9',
    name: 'Nine of Swords',
    number: 9,
    suit: 'swords',
    uprightMeaning: 'Anxiety, worry, fear. The dark night of the soul when worries overwhelm and sleep escapes.',
    reversedMeaning: 'Hope, reaching out, releasing worry. Beginning to see light at the end of the tunnel of anxiety.',
    keywords: ['anxiety', 'nightmare', 'worry', 'fear', 'despair'],
    symbolism: 'A figure sits up in bed, face in hands, nine swords hanging ominously on the wall behind them.',
    advice: 'The fears feel overwhelming, but they are often larger in our minds than in reality. Reach out, seek support, and let light in.',
    gothicDescription: 'At the witching hour, they wake screaming, nine phantom swords gleaming on the wall of their chamber. The nightmares are real—but so is the dawn that will come.',
    element: 'air'
  },
  {
    id: 'swords-10',
    name: 'Ten of Swords',
    number: 10,
    suit: 'swords',
    uprightMeaning: 'Betrayal, backstabbing, rock bottom. The final blow has fallen—this is as bad as it gets.',
    reversedMeaning: 'Recovery, regeneration, moving forward. Worse is over and healing can finally begin.',
    keywords: ['betrayal', 'ending', 'crisis', 'rock bottom', 'painful ending'],
    symbolism: 'A figure lies face down with ten swords in their back. The sky is black, but golden light appears on the horizon.',
    advice: 'This is the end of a painful cycle. Though you feel defeated, know that the dawn is coming. From rock bottom, the only direction is up.',
    gothicDescription: 'Upon the midnight shore, the fallen one lies pierced by ten blades of ending. But even in this darkest hour, golden light creeps along the horizon—death is also transformation.',
    element: 'air'
  },
  {
    id: 'swords-11',
    name: 'Page of Swords',
    number: 11,
    suit: 'swords',
    uprightMeaning: 'New ideas, curiosity, restless energy. A quick and curious mind seeking knowledge and truth.',
    reversedMeaning: 'Self-expression, scattered thoughts, gossip. Mental energy without focus or words used carelessly.',
    keywords: ['curiosity', 'new ideas', 'communication', 'vigilance', 'mental agility'],
    symbolism: 'A young figure holds a sword aloft, standing on a windswept hill. Their expression is alert and watchful.',
    advice: 'Stay curious and alert. New ideas and information are coming. Use your sharp mind wisely and speak truths carefully.',
    gothicDescription: 'On the windswept cliff, the young seeker holds their first blade of truth. Eyes keen as a raven\'s, they watch for secrets carried on the howling gale.',
    element: 'air'
  },
  {
    id: 'swords-12',
    name: 'Knight of Swords',
    number: 12,
    suit: 'swords',
    uprightMeaning: 'Ambition, action, drive. Charging forward with determination and mental power toward a goal.',
    reversedMeaning: 'No direction, restless energy. Moving fast without purpose or using intellect destructively.',
    keywords: ['action', 'ambition', 'drive', 'intellect', 'haste'],
    symbolism: 'An armored knight charges forward on a white horse, sword raised. Butterflies and birds scatter before them.',
    advice: 'Your determination is powerful—ensure it\'s pointed in the right direction. Think before you act, then act with full commitment.',
    gothicDescription: 'Through the hurricane of ideas, the blade knight charges on their steed of storm clouds. Intellect is their weapon—may they wield it with wisdom, not just fury.',
    element: 'air'
  },
  {
    id: 'swords-13',
    name: 'Queen of Swords',
    number: 13,
    suit: 'swords',
    uprightMeaning: 'Independent, unbiased judgment, clear boundaries. A wise counselor who speaks truth with precision.',
    reversedMeaning: 'Overly emotional, cold, bitter. Harsh judgment or closing off emotions entirely as self-protection.',
    keywords: ['clarity', 'independence', 'perception', 'boundaries', 'direct communication'],
    symbolism: 'A queen sits upon her throne holding a raised sword, one hand extended in welcome or warning. Butterflies adorn her crown.',
    advice: 'Speak your truth clearly and without apology. Set boundaries and maintain your independence. Your perception cuts through pretense.',
    gothicDescription: 'Upon her throne of frozen mist, the Queen of Blades passes judgment with merciful clarity. Her word is final, her vision penetrating—she has learned through suffering to see all.',
    element: 'air'
  },
  {
    id: 'swords-14',
    name: 'King of Swords',
    number: 14,
    suit: 'swords',
    uprightMeaning: 'Mental clarity, authority, truth. A master of intellect who makes decisions with logic and fairness.',
    reversedMeaning: 'Tyrannical, abusive of power, manipulation. Using intellect to control or deceive rather than enlighten.',
    keywords: ['authority', 'intellect', 'truth', 'ethics', 'mental discipline'],
    symbolism: 'A king sits sternly on his throne, sword of judgment held upright. Butterflies symbolize transformation through mental mastery.',
    advice: 'Lead with integrity and intellectual honesty. Make decisions based on facts and ethical principles. Your authority comes from truth.',
    gothicDescription: 'The Mind King sits in judgment, his blade of absolute truth held before the throne of rational power. All who stand before him are stripped of pretense—only truth survives his gaze.',
    element: 'air'
  }
];

// Pentacles (Earth) - 14 cards
export const pentacles: TarotCard[] = [
  {
    id: 'pentacles-1',
    name: 'Ace of Pentacles',
    number: 1,
    suit: 'pentacles',
    uprightMeaning: 'New financial opportunity, manifestation, prosperity. The seed of material abundance is planted.',
    reversedMeaning: 'Lost opportunity, lack of planning. Financial opportunity missed or material obsession.',
    keywords: ['opportunity', 'prosperity', 'manifestation', 'abundance', 'new venture'],
    symbolism: 'A hand emerges from a cloud holding a golden pentacle. Below lies a flourishing garden with an archway to new paths.',
    advice: 'Receive this gift of material opportunity wisely. Plant the seed and nurture it with patience. Abundance awaits.',
    gothicDescription: 'From the shadow-clouds, a hand extends a pentacle of blackened gold. Below, the moonlit garden blooms with nightshade prosperity—wealth wears many masks in the realm of darkness.',
    element: 'earth'
  },
  {
    id: 'pentacles-2',
    name: 'Two of Pentacles',
    number: 2,
    suit: 'pentacles',
    uprightMeaning: 'Balance, adaptability, time management. Juggling resources and priorities with skill.',
    reversedMeaning: 'Disorganization, financial disarray. Dropping balls or inability to maintain balance.',
    keywords: ['balance', 'adaptability', 'priorities', 'flexibility', 'time management'],
    symbolism: 'A figure juggles two pentacles in an infinity loop while ships ride waves behind. The dance of balance continues.',
    advice: 'Keep adapting and stay flexible. The waves of life require constant adjustment. You have the skill to maintain balance.',
    gothicDescription: 'The eternal juggler dances upon the shore of fortune, two coins of fate spinning in their hands. Behind them, ghost ships rise and fall on tides of chance.',
    element: 'earth'
  },
  {
    id: 'pentacles-3',
    name: 'Three of Pentacles',
    number: 3,
    suit: 'pentacles',
    uprightMeaning: 'Teamwork, collaboration, learning. Skilled craftsmanship recognized and valued by others.',
    reversedMeaning: 'Lack of teamwork, disorganization. Working alone when collaboration is needed or skills undervalued.',
    keywords: ['teamwork', 'collaboration', 'skill', 'craftsmanship', 'learning'],
    symbolism: 'A mason works on cathedral stonework while two others consult on plans. The craft is valued and respected.',
    advice: 'Your skills are recognized and valued. Collaborate with others who complement your abilities. Learning continues even for masters.',
    gothicDescription: 'In the cathedral of bones, the artisans of shadow consult on their masterwork. Three coins embedded in the skull-stone mark their craft—beauty built from darkness.',
    element: 'earth'
  },
  {
    id: 'pentacles-4',
    name: 'Four of Pentacles',
    number: 4,
    suit: 'pentacles',
    uprightMeaning: 'Security, control, holding on. Protecting resources but perhaps gripping too tightly.',
    reversedMeaning: 'Greed, materialism, letting go. Either excessive hoarding or learning to release attachment.',
    keywords: ['security', 'control', 'saving', 'materialism', 'possession'],
    symbolism: 'A figure clutches a pentacle to their chest, one under each foot, one atop their head. The city lies behind them.',
    advice: 'Security is valuable, but examine if you\'re holding too tightly. Sometimes we must release to receive. Find healthy balance.',
    gothicDescription: 'The miser of midnight clutches their coins in the graveyard of wealth. One upon the head, one at the heart, two beneath the feet—but can the dead take their gold to the grave?',
    element: 'earth'
  },
  {
    id: 'pentacles-5',
    name: 'Five of Pentacles',
    number: 5,
    suit: 'pentacles',
    uprightMeaning: 'Financial loss, poverty, insecurity. Feeling left out in the cold, but help may be closer than you realize.',
    reversedMeaning: 'Recovery, faith, spiritual wealth. Beginning to recover from loss or finding value beyond the material.',
    keywords: ['hardship', 'loss', 'poverty', 'isolation', 'worry'],
    symbolism: 'Two impoverished figures struggle past a stained-glass window of sanctuary. They don\'t look up to see the help available.',
    advice: 'Though times are hard, you are not as alone as you feel. Look up—help is available. This poverty is temporary.',
    gothicDescription: 'Through the blizzard of despair, the outcasts limp past the cathedral\'s glowing windows. They do not see the door that would open—pride and shame make the coldest prisons.',
    element: 'earth'
  },
  {
    id: 'pentacles-6',
    name: 'Six of Pentacles',
    number: 6,
    suit: 'pentacles',
    uprightMeaning: 'Giving, receiving, sharing wealth. The cycle of generosity flows in both directions.',
    reversedMeaning: 'Self-care, unpaid debts, one-sided charity. Imbalance in giving and receiving.',
    keywords: ['generosity', 'charity', 'sharing', 'giving', 'receiving'],
    symbolism: 'A wealthy figure distributes coins to the needy while holding scales. The balance of giving is maintained.',
    advice: 'Be generous when you can, gracious when receiving. The flow of abundance works both ways. Give without conditions.',
    gothicDescription: 'The mysterious benefactor in velvet and shadow weighs each coin before gifting it to the supplicants. But scales in the dark can tip either way—what debt is created with each gift?',
    element: 'earth'
  },
  {
    id: 'pentacles-7',
    name: 'Seven of Pentacles',
    number: 7,
    suit: 'pentacles',
    uprightMeaning: 'Long-term view, perseverance, investment. Pausing to assess the growth of what you\'ve planted.',
    reversedMeaning: 'Impatience, lack of growth, frustration. Results not matching effort or wanting instant gratification.',
    keywords: ['patience', 'investment', 'growth', 'perseverance', 'assessment'],
    symbolism: 'A farmer leans on their hoe, gazing at a bush bearing seven pentacles. The crop grows, but slowly.',
    advice: 'Your efforts are taking root. Be patient—true growth takes time. Pause to assess, but keep tending your garden.',
    gothicDescription: 'In the garden of night, the cultivator contemplates the seven coins blooming from the thorns. Patience is its own kind of darkness—waiting for harvest requires faith in unseen growth.',
    element: 'earth'
  },
  {
    id: 'pentacles-8',
    name: 'Eight of Pentacles',
    number: 8,
    suit: 'pentacles',
    uprightMeaning: 'Apprenticeship, repetitive work, mastery. Dedication to craft through consistent practice.',
    reversedMeaning: 'Perfectionism, lack of motivation, shoddy work. Either obsessing over details or lacking dedication.',
    keywords: ['skill', 'craftsmanship', 'dedication', 'apprenticeship', 'mastery'],
    symbolism: 'An artisan works at their bench, carefully crafting pentacles. Eight coins show their growing mastery.',
    advice: 'Master your craft through dedicated practice. Each repetition brings improvement. Honor the journey of learning.',
    gothicDescription: 'By candlelight, the artisan of shadows hammers coin after coin into being. Eight symbols of mastered darkness hang upon the wall—skill is purchased with endless midnight labor.',
    element: 'earth'
  },
  {
    id: 'pentacles-9',
    name: 'Nine of Pentacles',
    number: 9,
    suit: 'pentacles',
    uprightMeaning: 'Abundance, luxury, self-sufficiency. Enjoying the fruits of your labor in elegant independence.',
    reversedMeaning: 'Self-worth, overworking, financial setbacks. Seeking validation through wealth or sacrificing too much for success.',
    keywords: ['abundance', 'luxury', 'independence', 'self-sufficiency', 'refinement'],
    symbolism: 'A well-dressed figure stands in a vineyard of abundance, a falcon on their wrist. Nine pentacles bloom on the vines.',
    advice: 'Enjoy what you have created. You\'ve earned this abundance through your efforts. Savor your independence and success.',
    gothicDescription: 'In her garden of black grapes and silver moonlight, the lady of independent wealth stands in solitary splendor. Her raven companion speaks of freedom earned—luxury that belongs only to herself.',
    element: 'earth'
  },
  {
    id: 'pentacles-10',
    name: 'Ten of Pentacles',
    number: 10,
    suit: 'pentacles',
    uprightMeaning: 'Legacy, inheritance, family. Wealth passed through generations and the security of belonging.',
    reversedMeaning: 'Family disputes, bankruptcy, instability. Legacy threatened or material focus damaging relationships.',
    keywords: ['legacy', 'inheritance', 'family', 'wealth', 'establishment'],
    symbolism: 'An elderly figure sits at the gates of a family estate, surrounded by generations. Ten pentacles form the tree of life.',
    advice: 'Consider what legacy you wish to leave. Family wealth is not just material—it includes wisdom, values, and connection.',
    gothicDescription: 'At the gates of the ancestral manor, the patriarch of shadows surveys three generations gathered beneath the family crest. Ten coins mark the bloodline\'s wealth—what was built in darkness, in darkness shall endure.',
    element: 'earth'
  },
  {
    id: 'pentacles-11',
    name: 'Page of Pentacles',
    number: 11,
    suit: 'pentacles',
    uprightMeaning: 'Manifestation, opportunity, study. A student of material wisdom with practical dreams.',
    reversedMeaning: 'Lack of progress, procrastination. Dreams without action or impatience with practical matters.',
    keywords: ['opportunity', 'manifestation', 'study', 'ambition', 'practicality'],
    symbolism: 'A young figure gazes at a pentacle held before them, standing in a plowed field ready for planting.',
    advice: 'Study well and dream practically. This opportunity requires nurturing through dedicated effort. Ground your visions in reality.',
    gothicDescription: 'In the barren field awaiting seed, the young student of earthly mysteries contemplates the coin of potential. All great fortunes begin with a single dark dream.',
    element: 'earth'
  },
  {
    id: 'pentacles-12',
    name: 'Knight of Pentacles',
    number: 12,
    suit: 'pentacles',
    uprightMeaning: 'Efficiency, routine, conservatism. Steady progress through patience and methodical work.',
    reversedMeaning: 'Stagnation, laziness, feeling stuck. Routine becoming rut or losing motivation.',
    keywords: ['efficiency', 'routine', 'patience', 'conservatism', 'persistence'],
    symbolism: 'A knight sits upon a heavy draft horse, holding a pentacle. They go slowly but surely toward their goal.',
    advice: 'Steady progress beats flashy inconsistency. Stay the course with patience and diligence. The tortoise wins this race.',
    gothicDescription: 'Upon their steed of midnight earth, the patient knight holds the coin of slow-won fortune. No glory in their pace—only the certainty that all who rush will fall while they endure.',
    element: 'earth'
  },
  {
    id: 'pentacles-13',
    name: 'Queen of Pentacles',
    number: 13,
    suit: 'pentacles',
    uprightMeaning: 'Nurturing, practical, providing. A warm presence who creates abundance and security for all.',
    reversedMeaning: 'Self-care, work-home balance. Either neglecting oneself for others or material focus at cost of warmth.',
    keywords: ['nurturing', 'practicality', 'abundance', 'comfort', 'generosity'],
    symbolism: 'A queen sits in a flourishing garden, cradling a pentacle like a child. Rabbits at her feet suggest fertility.',
    advice: 'Create a nurturing abundance for yourself and others. Practical magic is making a house a home. Care for the garden of life.',
    gothicDescription: 'In her garden of perpetual twilight, the Earth Queen nurtures the dark abundance she has cultivated. Her coin births harvest after harvest—the witch of hearth and home provides for all.',
    element: 'earth'
  },
  {
    id: 'pentacles-14',
    name: 'King of Pentacles',
    number: 14,
    suit: 'pentacles',
    uprightMeaning: 'Wealth, business, leadership. A master of material realm who builds lasting success.',
    reversedMeaning: 'Materialism, greed, indulgence. Wealth without wisdom or success at any cost.',
    keywords: ['wealth', 'success', 'leadership', 'discipline', 'abundance'],
    symbolism: 'A king sits amid symbols of wealth—castle, vines, bull imagery. His pentacle rests securely on his knee.',
    advice: 'Build your empire wisely. Material success is meant to be shared and sustained. Lead with generosity and wisdom.',
    gothicDescription: 'Upon his throne of forged gold and ancient stone, the Earth King surveys his realm of dark prosperity. His word is bond, his wealth is power—the kingdom of shadow rests secure in his iron grip.',
    element: 'earth'
  }
];

// Complete deck assembly
export const completeTarotDeck: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

// Helper functions
export const getCardById = (id: string): TarotCard | undefined => {
  return completeTarotDeck.find(card => card.id === id);
};

export const getCardsBySuit = (suit: Suit): TarotCard[] => {
  return completeTarotDeck.filter(card => card.suit === suit);
};

export const getMajorArcana = (): TarotCard[] => {
  return majorArcana;
};

export const getMinorArcana = (): TarotCard[] => {
  return [...wands, ...cups, ...swords, ...pentacles];
};

export const shuffleDeck = (deck: TarotCard[]): TarotCard[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const drawCards = (count: number, deck?: TarotCard[]): TarotCard[] => {
  const shuffled = shuffleDeck(deck || completeTarotDeck);
  return shuffled.slice(0, count);
};

// Suit information
export const suitInfo = {
  major: { name: 'Major Arcana', element: 'spirit', color: '#d4af37', description: 'The soul\'s journey through life\'s major lessons' },
  wands: { name: 'Wands', element: 'fire', color: '#ef4444', description: 'Passion, creativity, action, and will' },
  cups: { name: 'Cups', element: 'water', color: '#3b82f6', description: 'Emotions, relationships, intuition, and the heart' },
  swords: { name: 'Swords', element: 'air', color: '#a78bfa', description: 'Intellect, conflict, truth, and communication' },
  pentacles: { name: 'Pentacles', element: 'earth', color: '#10b981', description: 'Material world, work, money, and the body' }
};

export default completeTarotDeck;
