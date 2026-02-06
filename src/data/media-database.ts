/**
 * COMPREHENSIVE MEDIA DATABASE
 * =============================
 * All media types: Music, Movies, TV, Games, Books, Comics, Art, Audio
 * No external links - all data embedded directly
 */

// ===== MUSIC DATABASE =====
export interface MusicTrack {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  year: number;
  duration?: string;
  bpm?: number;
  key?: string;
  mood?: string[];
  tags: string[];
}

export interface MusicAlbum {
  title: string;
  artist: string;
  year: number;
  genre: string;
  tracks: number;
  description?: string;
  tags: string[];
}

export interface MusicArtist {
  name: string;
  genres: string[];
  activeYears: string;
  origin: string;
  description: string;
  albums: string[];
  influences?: string[];
  tags: string[];
}

export const MUSIC_GENRES = [
  { name: 'Rock', subgenres: ['Classic Rock', 'Alternative', 'Indie Rock', 'Punk', 'Grunge', 'Progressive', 'Hard Rock', 'Garage Rock', 'Post-Punk', 'Psychedelic'] },
  { name: 'Pop', subgenres: ['Synth-pop', 'Dance Pop', 'Electropop', 'Art Pop', 'Indie Pop', 'K-Pop', 'J-Pop', 'Teen Pop', 'Bubblegum'] },
  { name: 'Hip-Hop', subgenres: ['Trap', 'Conscious', 'Boom Bap', 'West Coast', 'East Coast', 'Southern', 'Drill', 'Lo-fi Hip-Hop', 'Cloud Rap'] },
  { name: 'Electronic', subgenres: ['House', 'Techno', 'Trance', 'Dubstep', 'Drum & Bass', 'Ambient', 'IDM', 'Synthwave', 'Chillwave', 'Vaporwave'] },
  { name: 'R&B', subgenres: ['Neo-Soul', 'Contemporary R&B', 'Funk', 'Soul', 'Quiet Storm', 'New Jack Swing'] },
  { name: 'Jazz', subgenres: ['Bebop', 'Swing', 'Cool Jazz', 'Free Jazz', 'Fusion', 'Smooth Jazz', 'Modal', 'Latin Jazz'] },
  { name: 'Classical', subgenres: ['Baroque', 'Romantic', 'Modern', 'Contemporary', 'Minimalist', 'Neo-Classical', 'Opera', 'Chamber'] },
  { name: 'Country', subgenres: ['Traditional', 'Outlaw', 'Americana', 'Bluegrass', 'Country Pop', 'Alt-Country'] },
  { name: 'Metal', subgenres: ['Heavy Metal', 'Thrash', 'Death Metal', 'Black Metal', 'Doom', 'Power Metal', 'Progressive Metal', 'Nu Metal'] },
  { name: 'Folk', subgenres: ['Traditional Folk', 'Contemporary Folk', 'Indie Folk', 'Celtic', 'Appalachian', 'World Folk'] },
  { name: 'Blues', subgenres: ['Delta Blues', 'Chicago Blues', 'Electric Blues', 'Blues Rock', 'Soul Blues'] },
  { name: 'Reggae', subgenres: ['Roots Reggae', 'Dub', 'Dancehall', 'Ska', 'Rocksteady'] },
  { name: 'Latin', subgenres: ['Salsa', 'Reggaeton', 'Bachata', 'Cumbia', 'Bossa Nova', 'Latin Pop', 'Latin Rock'] },
  { name: 'World', subgenres: ['African', 'Middle Eastern', 'Indian Classical', 'Asian Traditional', 'Celtic', 'Nordic'] }
];

export const LEGENDARY_ARTISTS: MusicArtist[] = [
  { name: 'The Beatles', genres: ['Rock', 'Pop'], activeYears: '1960-1970', origin: 'Liverpool, UK', description: 'Revolutionary rock band that transformed popular music', albums: ['Please Please Me', 'A Hard Days Night', 'Rubber Soul', 'Revolver', 'Sgt. Peppers Lonely Hearts Club Band', 'The White Album', 'Abbey Road', 'Let It Be'], influences: ['Chuck Berry', 'Little Richard', 'Elvis Presley'], tags: ['classic', 'influential', 'british-invasion'] },
  { name: 'Pink Floyd', genres: ['Progressive Rock', 'Psychedelic'], activeYears: '1965-1995', origin: 'London, UK', description: 'Pioneers of progressive and psychedelic rock', albums: ['The Piper at the Gates of Dawn', 'The Dark Side of the Moon', 'Wish You Were Here', 'Animals', 'The Wall'], tags: ['progressive', 'concept-albums', 'experimental'] },
  { name: 'Led Zeppelin', genres: ['Hard Rock', 'Blues Rock'], activeYears: '1968-1980', origin: 'London, UK', description: 'Pioneers of hard rock and heavy metal', albums: ['Led Zeppelin', 'Led Zeppelin II', 'Led Zeppelin IV', 'Houses of the Holy', 'Physical Graffiti'], tags: ['hard-rock', 'blues', 'legendary'] },
  { name: 'David Bowie', genres: ['Rock', 'Art Rock', 'Electronic'], activeYears: '1962-2016', origin: 'London, UK', description: 'Innovative artist known for reinvention and personas', albums: ['The Rise and Fall of Ziggy Stardust', 'Hunky Dory', 'Low', 'Heroes', 'Blackstar'], tags: ['innovative', 'glam', 'art-rock'] },
  { name: 'Queen', genres: ['Rock', 'Arena Rock'], activeYears: '1970-present', origin: 'London, UK', description: 'Theatrical rock band with operatic vocals', albums: ['A Night at the Opera', 'News of the World', 'The Game', 'Innuendo'], tags: ['theatrical', 'anthems', 'freddie-mercury'] },
  { name: 'Michael Jackson', genres: ['Pop', 'R&B', 'Soul'], activeYears: '1964-2009', origin: 'Gary, Indiana, USA', description: 'King of Pop who revolutionized music videos', albums: ['Off the Wall', 'Thriller', 'Bad', 'Dangerous', 'HIStory'], tags: ['king-of-pop', 'dance', 'iconic'] },
  { name: 'Prince', genres: ['Funk', 'R&B', 'Rock', 'Pop'], activeYears: '1976-2016', origin: 'Minneapolis, USA', description: 'Multi-instrumentalist genius and prolific songwriter', albums: ['1999', 'Purple Rain', 'Sign o the Times', 'Lovesexy'], tags: ['funk', 'genius', 'multi-instrumentalist'] },
  { name: 'Stevie Wonder', genres: ['Soul', 'R&B', 'Funk'], activeYears: '1961-present', origin: 'Michigan, USA', description: 'Blind musical prodigy and social activist', albums: ['Talking Book', 'Innervisions', 'Songs in the Key of Life', 'Hotter than July'], tags: ['soul', 'prodigy', 'activist'] },
  { name: 'Bob Dylan', genres: ['Folk', 'Rock', 'Country'], activeYears: '1961-present', origin: 'Minnesota, USA', description: 'Nobel Prize winning songwriter and cultural icon', albums: ['The Freewheelin Bob Dylan', 'Highway 61 Revisited', 'Blonde on Blonde', 'Blood on the Tracks'], tags: ['folk', 'poet', 'nobel-laureate'] },
  { name: 'Radiohead', genres: ['Alternative Rock', 'Art Rock', 'Electronic'], activeYears: '1985-present', origin: 'Oxfordshire, UK', description: 'Experimental rock band known for innovation', albums: ['The Bends', 'OK Computer', 'Kid A', 'In Rainbows', 'A Moon Shaped Pool'], tags: ['experimental', 'alternative', 'innovative'] },
  { name: 'Nirvana', genres: ['Grunge', 'Alternative'], activeYears: '1987-1994', origin: 'Seattle, USA', description: 'Defined the grunge movement of the 90s', albums: ['Bleach', 'Nevermind', 'In Utero'], tags: ['grunge', '90s', 'influential'] },
  { name: 'Kendrick Lamar', genres: ['Hip-Hop', 'Conscious Rap'], activeYears: '2004-present', origin: 'Compton, USA', description: 'Pulitzer Prize winning rapper and storyteller', albums: ['good kid, m.A.A.d city', 'To Pimp a Butterfly', 'DAMN.', 'Mr. Morale & The Big Steppers'], tags: ['conscious', 'storytelling', 'pulitzer'] },
  { name: 'Beyonce', genres: ['R&B', 'Pop', 'Hip-Hop'], activeYears: '1997-present', origin: 'Houston, USA', description: 'Global superstar and cultural icon', albums: ['Dangerously in Love', 'Bday', '4', 'Lemonade', 'Renaissance'], tags: ['diva', 'empowerment', 'visual-albums'] },
  { name: 'Daft Punk', genres: ['Electronic', 'House', 'Disco'], activeYears: '1993-2021', origin: 'Paris, France', description: 'Influential electronic duo with robot personas', albums: ['Homework', 'Discovery', 'Random Access Memories'], tags: ['electronic', 'french', 'robots'] },
  { name: 'Miles Davis', genres: ['Jazz', 'Fusion'], activeYears: '1944-1991', origin: 'Illinois, USA', description: 'Constantly evolving jazz pioneer', albums: ['Kind of Blue', 'Sketches of Spain', 'Bitches Brew', 'In a Silent Way'], tags: ['jazz', 'innovation', 'cool'] }
];

// ===== MOVIE DATABASE =====
export interface Movie {
  title: string;
  year: number;
  director: string;
  genre: string[];
  runtime: number; // minutes
  rating?: number;
  plot: string;
  cast: string[];
  country: string;
  language: string;
  awards?: string[];
  tags: string[];
}

export const MOVIE_GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Musical', 'Mystery',
  'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

export const CLASSIC_MOVIES: Movie[] = [
  { title: 'The Godfather', year: 1972, director: 'Francis Ford Coppola', genre: ['Crime', 'Drama'], runtime: 175, rating: 9.2, plot: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son', cast: ['Marlon Brando', 'Al Pacino', 'James Caan'], country: 'USA', language: 'English', awards: ['Academy Award Best Picture'], tags: ['mafia', 'classic', 'crime-epic'] },
  { title: 'Citizen Kane', year: 1941, director: 'Orson Welles', genre: ['Drama', 'Mystery'], runtime: 119, rating: 8.3, plot: 'A reporters investigation into the last words of a newspaper magnate', cast: ['Orson Welles', 'Joseph Cotten'], country: 'USA', language: 'English', tags: ['classic', 'influential', 'cinematography'] },
  { title: '2001: A Space Odyssey', year: 1968, director: 'Stanley Kubrick', genre: ['Sci-Fi', 'Adventure'], runtime: 149, rating: 8.3, plot: 'Humanity finds a mysterious artifact buried beneath the lunar surface', cast: ['Keir Dullea', 'Gary Lockwood'], country: 'USA', language: 'English', tags: ['sci-fi', 'kubrick', 'visionary'] },
  { title: 'Pulp Fiction', year: 1994, director: 'Quentin Tarantino', genre: ['Crime', 'Drama'], runtime: 154, rating: 8.9, plot: 'Interconnected stories of criminals in Los Angeles', cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'], country: 'USA', language: 'English', tags: ['nonlinear', 'dialogue', 'iconic'] },
  { title: 'The Shawshank Redemption', year: 1994, director: 'Frank Darabont', genre: ['Drama'], runtime: 142, rating: 9.3, plot: 'Two imprisoned men bond over years, finding solace and redemption', cast: ['Tim Robbins', 'Morgan Freeman'], country: 'USA', language: 'English', tags: ['prison', 'hope', 'friendship'] },
  { title: 'Schindlers List', year: 1993, director: 'Steven Spielberg', genre: ['Biography', 'Drama', 'History'], runtime: 195, rating: 9.0, plot: 'A businessman saves over a thousand Jews during the Holocaust', cast: ['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley'], country: 'USA', language: 'English', awards: ['Academy Award Best Picture'], tags: ['holocaust', 'historical', 'powerful'] },
  { title: 'The Dark Knight', year: 2008, director: 'Christopher Nolan', genre: ['Action', 'Crime', 'Drama'], runtime: 152, rating: 9.0, plot: 'Batman faces the Joker, a criminal mastermind', cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'], country: 'USA', language: 'English', tags: ['superhero', 'joker', 'dark'] },
  { title: 'Inception', year: 2010, director: 'Christopher Nolan', genre: ['Action', 'Sci-Fi', 'Thriller'], runtime: 148, rating: 8.8, plot: 'A thief who steals secrets through dream-sharing technology', cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'], country: 'USA', language: 'English', tags: ['dreams', 'mindbending', 'heist'] },
  { title: 'Spirited Away', year: 2001, director: 'Hayao Miyazaki', genre: ['Animation', 'Adventure', 'Family'], runtime: 125, rating: 8.6, plot: 'A young girl enters a world of spirits to save her parents', cast: ['Rumi Hiiragi', 'Miyu Irino'], country: 'Japan', language: 'Japanese', awards: ['Academy Award Best Animated'], tags: ['ghibli', 'animation', 'fantasy'] },
  { title: 'Parasite', year: 2019, director: 'Bong Joon-ho', genre: ['Comedy', 'Drama', 'Thriller'], runtime: 132, rating: 8.5, plot: 'A poor family schemes to work for a wealthy household', cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'], country: 'South Korea', language: 'Korean', awards: ['Academy Award Best Picture'], tags: ['class', 'korean', 'thriller'] },
  { title: 'Blade Runner', year: 1982, director: 'Ridley Scott', genre: ['Sci-Fi', 'Thriller'], runtime: 117, rating: 8.1, plot: 'A blade runner hunts down replicants in a dystopian future', cast: ['Harrison Ford', 'Rutger Hauer', 'Sean Young'], country: 'USA', language: 'English', tags: ['cyberpunk', 'noir', 'dystopia'] },
  { title: 'The Matrix', year: 1999, director: 'The Wachowskis', genre: ['Action', 'Sci-Fi'], runtime: 136, rating: 8.7, plot: 'A hacker discovers reality is a simulation', cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'], country: 'USA', language: 'English', tags: ['simulation', 'cyberpunk', 'action'] },
  { title: 'Goodfellas', year: 1990, director: 'Martin Scorsese', genre: ['Biography', 'Crime', 'Drama'], runtime: 146, rating: 8.7, plot: 'The story of Henry Hill and his life in the mob', cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'], country: 'USA', language: 'English', tags: ['mafia', 'scorsese', 'gangster'] },
  { title: 'Akira', year: 1988, director: 'Katsuhiro Otomo', genre: ['Animation', 'Action', 'Sci-Fi'], runtime: 124, rating: 8.0, plot: 'A biker gang leader gains psychic powers in Neo-Tokyo', cast: ['Mitsuo Iwata', 'Nozomu Sasaki'], country: 'Japan', language: 'Japanese', tags: ['anime', 'cyberpunk', 'influential'] },
  { title: 'Seven Samurai', year: 1954, director: 'Akira Kurosawa', genre: ['Action', 'Drama'], runtime: 207, rating: 8.6, plot: 'A village hires samurai to protect them from bandits', cast: ['Toshiro Mifune', 'Takashi Shimura'], country: 'Japan', language: 'Japanese', tags: ['kurosawa', 'samurai', 'epic'] }
];

// ===== TV SHOWS DATABASE =====
export interface TVShow {
  title: string;
  yearStart: number;
  yearEnd?: number;
  creator: string;
  genre: string[];
  seasons: number;
  episodes: number;
  rating?: number;
  plot: string;
  network: string;
  tags: string[];
}

export const LEGENDARY_TV_SHOWS: TVShow[] = [
  { title: 'Breaking Bad', yearStart: 2008, yearEnd: 2013, creator: 'Vince Gilligan', genre: ['Crime', 'Drama', 'Thriller'], seasons: 5, episodes: 62, rating: 9.5, plot: 'A chemistry teacher turned meth manufacturer', network: 'AMC', tags: ['crime', 'transformation', 'intense'] },
  { title: 'The Wire', yearStart: 2002, yearEnd: 2008, creator: 'David Simon', genre: ['Crime', 'Drama'], seasons: 5, episodes: 60, rating: 9.3, plot: 'Baltimore drug scene from multiple perspectives', network: 'HBO', tags: ['baltimore', 'realistic', 'institutions'] },
  { title: 'The Sopranos', yearStart: 1999, yearEnd: 2007, creator: 'David Chase', genre: ['Crime', 'Drama'], seasons: 6, episodes: 86, rating: 9.2, plot: 'A mob boss struggles with personal and professional issues', network: 'HBO', tags: ['mafia', 'therapy', 'groundbreaking'] },
  { title: 'Game of Thrones', yearStart: 2011, yearEnd: 2019, creator: 'David Benioff, D.B. Weiss', genre: ['Action', 'Drama', 'Fantasy'], seasons: 8, episodes: 73, rating: 9.2, plot: 'Noble families fight for control of Westeros', network: 'HBO', tags: ['fantasy', 'political', 'epic'] },
  { title: 'Chernobyl', yearStart: 2019, yearEnd: 2019, creator: 'Craig Mazin', genre: ['Drama', 'History', 'Thriller'], seasons: 1, episodes: 5, rating: 9.4, plot: 'The true story of the nuclear disaster', network: 'HBO', tags: ['historical', 'disaster', 'soviet'] },
  { title: 'The Office', yearStart: 2005, yearEnd: 2013, creator: 'Greg Daniels', genre: ['Comedy'], seasons: 9, episodes: 201, rating: 9.0, plot: 'A mockumentary on office employees', network: 'NBC', tags: ['comedy', 'workplace', 'mockumentary'] },
  { title: 'Friends', yearStart: 1994, yearEnd: 2004, creator: 'David Crane, Marta Kauffman', genre: ['Comedy', 'Romance'], seasons: 10, episodes: 236, rating: 8.9, plot: 'Six friends navigate life in New York City', network: 'NBC', tags: ['sitcom', 'friendship', 'classic'] },
  { title: 'Stranger Things', yearStart: 2016, creator: 'The Duffer Brothers', genre: ['Drama', 'Fantasy', 'Horror'], seasons: 4, episodes: 34, rating: 8.7, plot: 'Supernatural events in 1980s Indiana', network: 'Netflix', tags: ['80s', 'supernatural', 'nostalgia'] },
  { title: 'Avatar: The Last Airbender', yearStart: 2005, yearEnd: 2008, creator: 'Michael DiMartino, Bryan Konietzko', genre: ['Animation', 'Action', 'Adventure'], seasons: 3, episodes: 61, rating: 9.3, plot: 'The last airbender must master all elements', network: 'Nickelodeon', tags: ['animation', 'martial-arts', 'epic'] },
  { title: 'Planet Earth', yearStart: 2006, creator: 'David Attenborough', genre: ['Documentary'], seasons: 3, episodes: 27, rating: 9.4, plot: 'Comprehensive look at Earths diverse habitats', network: 'BBC', tags: ['nature', 'documentary', 'beautiful'] },
  { title: 'Twin Peaks', yearStart: 1990, yearEnd: 2017, creator: 'David Lynch, Mark Frost', genre: ['Crime', 'Drama', 'Mystery'], seasons: 3, episodes: 48, rating: 8.8, plot: 'Investigation into the murder of homecoming queen', network: 'ABC', tags: ['surreal', 'mystery', 'lynch'] },
  { title: 'The Twilight Zone', yearStart: 1959, yearEnd: 1964, creator: 'Rod Serling', genre: ['Drama', 'Fantasy', 'Horror'], seasons: 5, episodes: 156, rating: 9.0, plot: 'Anthology of strange and supernatural tales', network: 'CBS', tags: ['anthology', 'classic', 'twist'] },
  { title: 'Arcane', yearStart: 2021, creator: 'Christian Linke, Alex Yee', genre: ['Animation', 'Action', 'Adventure'], seasons: 2, episodes: 18, rating: 9.0, plot: 'Two sisters in the cities of Piltover and Zaun', network: 'Netflix', tags: ['animation', 'league-of-legends', 'stunning'] },
  { title: 'Black Mirror', yearStart: 2011, creator: 'Charlie Brooker', genre: ['Drama', 'Sci-Fi', 'Thriller'], seasons: 6, episodes: 27, rating: 8.7, plot: 'Anthology exploring technologys dark side', network: 'Netflix', tags: ['anthology', 'technology', 'dystopia'] },
  { title: 'The Simpsons', yearStart: 1989, creator: 'Matt Groening', genre: ['Animation', 'Comedy'], seasons: 35, episodes: 750, rating: 8.7, plot: 'Animated family in the town of Springfield', network: 'Fox', tags: ['animation', 'satire', 'longest-running'] }
];

// ===== VIDEO GAMES DATABASE =====
export interface VideoGame {
  title: string;
  year: number;
  developer: string;
  publisher: string;
  genre: string[];
  platforms: string[];
  rating?: number;
  description: string;
  features: string[];
  tags: string[];
}

export const GAME_GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing',
  'Puzzle', 'Fighting', 'Shooter', 'Platformer', 'Horror', 'Survival', 'Sandbox',
  'MMORPG', 'Roguelike', 'Metroidvania', 'Visual Novel', 'Rhythm', 'Battle Royale'
];

export const LEGENDARY_GAMES: VideoGame[] = [
  { title: 'The Legend of Zelda: Breath of the Wild', year: 2017, developer: 'Nintendo', publisher: 'Nintendo', genre: ['Action', 'Adventure', 'Open World'], platforms: ['Switch', 'Wii U'], rating: 10, description: 'Open-world adventure in the kingdom of Hyrule', features: ['Open world', 'Physics system', 'Climbing', 'Cooking'], tags: ['zelda', 'open-world', 'masterpiece'] },
  { title: 'The Witcher 3: Wild Hunt', year: 2015, developer: 'CD Projekt Red', publisher: 'CD Projekt', genre: ['RPG', 'Action', 'Open World'], platforms: ['PC', 'PS4', 'Xbox One', 'Switch'], rating: 9.5, description: 'Geralt searches for his adopted daughter', features: ['Story choices', 'Monster hunting', 'Crafting', 'Gwent'], tags: ['rpg', 'story', 'dark-fantasy'] },
  { title: 'Red Dead Redemption 2', year: 2018, developer: 'Rockstar Games', publisher: 'Rockstar Games', genre: ['Action', 'Adventure', 'Western'], platforms: ['PC', 'PS4', 'Xbox One'], rating: 9.7, description: 'Outlaw Arthur Morgan in the dying Wild West', features: ['Open world', 'Story', 'Hunting', 'Camp management'], tags: ['western', 'story', 'immersive'] },
  { title: 'Dark Souls', year: 2011, developer: 'FromSoftware', publisher: 'Bandai Namco', genre: ['Action', 'RPG'], platforms: ['PC', 'PS3', 'Xbox 360', 'PS4', 'Xbox One', 'Switch'], rating: 9.0, description: 'Challenging action RPG in a dark fantasy world', features: ['Difficulty', 'Lore', 'Combat', 'Exploration'], tags: ['souls-like', 'challenging', 'atmospheric'] },
  { title: 'Elden Ring', year: 2022, developer: 'FromSoftware', publisher: 'Bandai Namco', genre: ['Action', 'RPG', 'Open World'], platforms: ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series'], rating: 9.6, description: 'Open-world action RPG in the Lands Between', features: ['Open world', 'FromSoftware combat', 'Build variety'], tags: ['souls-like', 'open-world', 'goty'] },
  { title: 'Minecraft', year: 2011, developer: 'Mojang', publisher: 'Microsoft', genre: ['Sandbox', 'Survival'], platforms: ['PC', 'PS4', 'Xbox One', 'Switch', 'Mobile'], rating: 9.0, description: 'Build and survive in a blocky world', features: ['Building', 'Mining', 'Crafting', 'Multiplayer', 'Mods'], tags: ['sandbox', 'creative', 'endless'] },
  { title: 'Portal 2', year: 2011, developer: 'Valve', publisher: 'Valve', genre: ['Puzzle', 'Platformer'], platforms: ['PC', 'PS3', 'Xbox 360'], rating: 9.5, description: 'Puzzle game with portal technology', features: ['Puzzles', 'Co-op', 'Story', 'Humor'], tags: ['puzzle', 'valve', 'glados'] },
  { title: 'Half-Life 2', year: 2004, developer: 'Valve', publisher: 'Valve', genre: ['Shooter', 'Action'], platforms: ['PC', 'Xbox', 'PS3', 'Xbox 360'], rating: 9.5, description: 'Gordon Freeman fights alien occupation', features: ['Physics', 'Story', 'Gravity gun'], tags: ['fps', 'revolutionary', 'classic'] },
  { title: 'Super Mario Bros.', year: 1985, developer: 'Nintendo', publisher: 'Nintendo', genre: ['Platformer'], platforms: ['NES', 'SNES', 'GBA', 'Switch'], rating: 9.0, description: 'Mario rescues Princess Peach from Bowser', features: ['Platforming', 'Power-ups', 'Secrets'], tags: ['classic', 'mario', 'definitive'] },
  { title: 'Tetris', year: 1984, developer: 'Alexey Pajitnov', publisher: 'Various', genre: ['Puzzle'], platforms: ['Everything'], rating: 9.0, description: 'Arrange falling blocks to clear lines', features: ['Simple mechanics', 'Addictive', 'Timeless'], tags: ['puzzle', 'classic', 'timeless'] },
  { title: 'Chrono Trigger', year: 1995, developer: 'Square', publisher: 'Square', genre: ['RPG'], platforms: ['SNES', 'PS1', 'DS', 'PC', 'Mobile'], rating: 9.5, description: 'Time-traveling RPG adventure', features: ['Multiple endings', 'Time travel', 'Combo attacks'], tags: ['jrpg', 'classic', 'time-travel'] },
  { title: 'Final Fantasy VII', year: 1997, developer: 'Square', publisher: 'Square', genre: ['RPG'], platforms: ['PS1', 'PC', 'PS4', 'Switch', 'Xbox'], rating: 9.2, description: 'Cloud Strife fights against Shinra and Sephiroth', features: ['Materia system', 'Story', 'Characters'], tags: ['jrpg', 'classic', 'iconic'] },
  { title: 'Hollow Knight', year: 2017, developer: 'Team Cherry', publisher: 'Team Cherry', genre: ['Metroidvania', 'Action'], platforms: ['PC', 'PS4', 'Xbox One', 'Switch'], rating: 9.0, description: 'Explore the underground kingdom of Hallownest', features: ['Exploration', 'Combat', 'Charms', 'Atmosphere'], tags: ['metroidvania', 'indie', 'atmospheric'] },
  { title: 'Hades', year: 2020, developer: 'Supergiant Games', publisher: 'Supergiant Games', genre: ['Roguelike', 'Action'], platforms: ['PC', 'PS4', 'PS5', 'Xbox One', 'Switch'], rating: 9.3, description: 'Zagreus escapes the underworld', features: ['Roguelike', 'Story progression', 'Combat variety'], tags: ['roguelike', 'mythology', 'narrative'] },
  { title: 'Celeste', year: 2018, developer: 'Maddy Makes Games', publisher: 'Maddy Makes Games', genre: ['Platformer'], platforms: ['PC', 'PS4', 'Xbox One', 'Switch'], rating: 9.0, description: 'Madeline climbs Celeste Mountain', features: ['Precision platforming', 'Assist mode', 'Story'], tags: ['platformer', 'indie', 'challenging'] }
];

// ===== EMULATOR DATABASE =====
export interface Emulator {
  name: string;
  system: string;
  platforms: string[];
  description: string;
  features: string[];
  status: 'Active' | 'Stable' | 'Legacy';
  accuracy: 'High' | 'Medium' | 'Low';
  tags: string[];
}

export const EMULATORS: Emulator[] = [
  // Nintendo
  { name: 'mGBA', system: 'Game Boy Advance', platforms: ['Windows', 'Mac', 'Linux', 'Android', 'iOS'], description: 'Highly accurate GBA emulator', features: ['Save states', 'Fast forward', 'Cheats', 'Link cable'], status: 'Active', accuracy: 'High', tags: ['gba', 'nintendo', 'accurate'] },
  { name: 'DeSmuME', system: 'Nintendo DS', platforms: ['Windows', 'Mac', 'Linux'], description: 'Nintendo DS emulator', features: ['Save states', 'Cheats', 'Microphone'], status: 'Stable', accuracy: 'High', tags: ['nds', 'nintendo'] },
  { name: 'melonDS', system: 'Nintendo DS', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'DS emulator aiming for accuracy', features: ['Accurate', 'Wi-Fi support', 'DSi support'], status: 'Active', accuracy: 'High', tags: ['nds', 'accurate'] },
  { name: 'Citra', system: 'Nintendo 3DS', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: '3DS emulator', features: ['HD upscaling', 'Save states', 'Multiplayer'], status: 'Stable', accuracy: 'Medium', tags: ['3ds', 'nintendo'] },
  { name: 'Dolphin', system: 'GameCube/Wii', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'Highly compatible GC/Wii emulator', features: ['HD rendering', 'Netplay', 'Save states'], status: 'Active', accuracy: 'High', tags: ['gamecube', 'wii', 'nintendo'] },
  { name: 'Ryujinx', system: 'Nintendo Switch', platforms: ['Windows', 'Mac', 'Linux'], description: 'Switch emulator', features: ['Good compatibility', 'Motion controls'], status: 'Active', accuracy: 'Medium', tags: ['switch', 'nintendo'] },
  { name: 'Yuzu', system: 'Nintendo Switch', platforms: ['Windows', 'Linux'], description: 'Experimental Switch emulator', features: ['Vulkan support', 'Multicore'], status: 'Legacy', accuracy: 'Medium', tags: ['switch', 'nintendo'] },
  { name: 'Snes9x', system: 'Super Nintendo', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'Popular SNES emulator', features: ['Save states', 'Cheats', 'Netplay'], status: 'Active', accuracy: 'High', tags: ['snes', 'nintendo'] },
  { name: 'bsnes', system: 'Super Nintendo', platforms: ['Windows', 'Mac', 'Linux'], description: 'Accuracy-focused SNES emulator', features: ['Cycle accurate', 'HD mode 7'], status: 'Active', accuracy: 'High', tags: ['snes', 'accurate'] },
  { name: 'Nestopia', system: 'NES', platforms: ['Windows', 'Mac', 'Linux'], description: 'Accurate NES emulator', features: ['Accurate', 'Save states'], status: 'Stable', accuracy: 'High', tags: ['nes', 'nintendo'] },

  // Sony
  { name: 'PCSX2', system: 'PlayStation 2', platforms: ['Windows', 'Mac', 'Linux'], description: 'PS2 emulator with high compatibility', features: ['HD upscaling', 'Save states', 'Cheats'], status: 'Active', accuracy: 'High', tags: ['ps2', 'sony'] },
  { name: 'RPCS3', system: 'PlayStation 3', platforms: ['Windows', 'Linux'], description: 'PS3 emulator', features: ['Vulkan', 'Many games playable'], status: 'Active', accuracy: 'Medium', tags: ['ps3', 'sony'] },
  { name: 'DuckStation', system: 'PlayStation 1', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'Modern PS1 emulator', features: ['HD rendering', 'PGXP', 'Save states'], status: 'Active', accuracy: 'High', tags: ['ps1', 'sony', 'modern'] },
  { name: 'PPSSPP', system: 'PlayStation Portable', platforms: ['Windows', 'Mac', 'Linux', 'Android', 'iOS'], description: 'PSP emulator', features: ['HD upscaling', 'Save states', 'Cheats'], status: 'Active', accuracy: 'High', tags: ['psp', 'sony'] },
  { name: 'Vita3K', system: 'PlayStation Vita', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'PS Vita emulator', features: ['Experimental', 'Growing compatibility'], status: 'Active', accuracy: 'Medium', tags: ['vita', 'sony'] },

  // Sega
  { name: 'Kega Fusion', system: 'Sega Genesis/CD/32X', platforms: ['Windows'], description: 'Multi-system Sega emulator', features: ['Multiple systems', 'Save states'], status: 'Legacy', accuracy: 'High', tags: ['genesis', 'sega'] },
  { name: 'BlastEm', system: 'Sega Genesis', platforms: ['Windows', 'Mac', 'Linux'], description: 'Accuracy-focused Genesis emulator', features: ['Cycle accurate'], status: 'Active', accuracy: 'High', tags: ['genesis', 'accurate'] },
  { name: 'Flycast', system: 'Dreamcast', platforms: ['Windows', 'Mac', 'Linux', 'Android'], description: 'Dreamcast/Naomi emulator', features: ['HD rendering', 'Netplay'], status: 'Active', accuracy: 'High', tags: ['dreamcast', 'sega'] },

  // Other
  { name: 'RetroArch', system: 'Multi-system', platforms: ['Windows', 'Mac', 'Linux', 'Android', 'iOS'], description: 'Frontend for multiple emulator cores', features: ['Many systems', 'Shaders', 'Achievements', 'Netplay'], status: 'Active', accuracy: 'High', tags: ['multi-system', 'frontend'] },
  { name: 'MAME', system: 'Arcade', platforms: ['Windows', 'Mac', 'Linux'], description: 'Multiple Arcade Machine Emulator', features: ['Thousands of games', 'Preservation focus'], status: 'Active', accuracy: 'High', tags: ['arcade', 'preservation'] },
  { name: 'DOSBox', system: 'DOS', platforms: ['Windows', 'Mac', 'Linux'], description: 'DOS emulator for classic PC games', features: ['DOS compatibility', 'Modem emulation'], status: 'Active', accuracy: 'High', tags: ['dos', 'pc'] },
  { name: 'ScummVM', system: 'Adventure Games', platforms: ['Windows', 'Mac', 'Linux', 'Android', 'iOS'], description: 'Classic adventure game engine', features: ['Point-and-click support', 'Many engines'], status: 'Active', accuracy: 'High', tags: ['adventure', 'scumm'] }
];

// ===== BOOKS DATABASE =====
export interface Book {
  title: string;
  author: string;
  year: number;
  genre: string[];
  pages?: number;
  description: string;
  themes: string[];
  series?: string;
  tags: string[];
}

export const BOOK_GENRES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'Horror', 'Historical', 'Biography', 'Self-Help', 'Science',
  'Philosophy', 'Poetry', 'Drama', 'Young Adult', 'Childrens', 'Graphic Novel'
];

export const CLASSIC_BOOKS: Book[] = [
  { title: '1984', author: 'George Orwell', year: 1949, genre: ['Science Fiction', 'Dystopian'], pages: 328, description: 'A man struggles against totalitarian surveillance', themes: ['Totalitarianism', 'Surveillance', 'Truth'], tags: ['dystopia', 'classic', 'political'] },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genre: ['Fiction', 'Southern Gothic'], pages: 281, description: 'A lawyers fight against racial injustice', themes: ['Racism', 'Justice', 'Childhood'], tags: ['classic', 'american', 'civil-rights'] },
  { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, genre: ['Romance', 'Fiction'], pages: 432, description: 'Elizabeth Bennets journey to love', themes: ['Class', 'Marriage', 'Pride'], tags: ['romance', 'classic', 'regency'] },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genre: ['Fiction'], pages: 180, description: 'The mysterious Jay Gatsbys pursuit of the American Dream', themes: ['American Dream', 'Wealth', 'Love'], tags: ['jazz-age', 'classic', 'american'] },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez', year: 1967, genre: ['Magical Realism', 'Fiction'], pages: 417, description: 'The Buendia family saga over seven generations', themes: ['Family', 'Time', 'Solitude'], tags: ['magical-realism', 'latin-american', 'epic'] },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, genre: ['Fantasy'], pages: 1178, description: 'Frodo must destroy the One Ring', themes: ['Good vs Evil', 'Friendship', 'Courage'], series: 'Middle-earth', tags: ['fantasy', 'epic', 'influential'] },
  { title: 'Dune', author: 'Frank Herbert', year: 1965, genre: ['Science Fiction'], pages: 412, description: 'Paul Atreides on the desert planet Arrakis', themes: ['Politics', 'Religion', 'Ecology'], series: 'Dune', tags: ['sci-fi', 'epic', 'political'] },
  { title: 'The Hitchhikers Guide to the Galaxy', author: 'Douglas Adams', year: 1979, genre: ['Science Fiction', 'Comedy'], pages: 193, description: 'Arthur Dent travels the galaxy after Earths destruction', themes: ['Absurdism', 'Meaning of life'], series: 'Hitchhikers Guide', tags: ['comedy', 'sci-fi', 'absurd'] },
  { title: 'Brave New World', author: 'Aldous Huxley', year: 1932, genre: ['Science Fiction', 'Dystopian'], pages: 268, description: 'A future society controlled by pleasure', themes: ['Conformity', 'Technology', 'Freedom'], tags: ['dystopia', 'classic', 'philosophical'] },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', year: 1866, genre: ['Fiction', 'Psychological'], pages: 671, description: 'A students moral anguish after committing murder', themes: ['Guilt', 'Redemption', 'Morality'], tags: ['russian', 'psychological', 'classic'] },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, genre: ['Fiction'], pages: 234, description: 'Holden Caulfields cynical journey through New York', themes: ['Alienation', 'Identity', 'Loss of innocence'], tags: ['coming-of-age', 'american', 'classic'] },
  { title: 'Frankenstein', author: 'Mary Shelley', year: 1818, genre: ['Horror', 'Science Fiction', 'Gothic'], pages: 280, description: 'A scientist creates life with tragic consequences', themes: ['Creation', 'Responsibility', 'Isolation'], tags: ['gothic', 'horror', 'science'] },
  { title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', year: 1844, genre: ['Adventure', 'Historical'], pages: 1276, description: 'Edmond Dantes elaborate revenge', themes: ['Revenge', 'Justice', 'Redemption'], tags: ['adventure', 'revenge', 'classic'] },
  { title: 'Neuromancer', author: 'William Gibson', year: 1984, genre: ['Science Fiction', 'Cyberpunk'], pages: 271, description: 'A washed-up hacker is hired for one last job', themes: ['AI', 'Cyberspace', 'Identity'], tags: ['cyberpunk', 'influential', 'hacking'] },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', year: 2007, genre: ['Fantasy'], pages: 662, description: 'Kvothe tells his life story', themes: ['Magic', 'Music', 'Legend'], series: 'Kingkiller Chronicle', tags: ['fantasy', 'prose', 'magic'] }
];

// ===== COMIC BOOKS DATABASE =====
export interface Comic {
  title: string;
  writer: string;
  artist: string;
  publisher: string;
  year: number;
  genre: string[];
  issues?: number;
  description: string;
  characters?: string[];
  tags: string[];
}

export const LEGENDARY_COMICS: Comic[] = [
  { title: 'Watchmen', writer: 'Alan Moore', artist: 'Dave Gibbons', publisher: 'DC Comics', year: 1986, genre: ['Superhero', 'Drama'], issues: 12, description: 'Deconstruction of the superhero genre', characters: ['Rorschach', 'Dr. Manhattan', 'Ozymandias'], tags: ['deconstruction', 'mature', 'influential'] },
  { title: 'The Dark Knight Returns', writer: 'Frank Miller', artist: 'Frank Miller', publisher: 'DC Comics', year: 1986, genre: ['Superhero', 'Action'], issues: 4, description: 'Older Batman comes out of retirement', characters: ['Batman', 'Robin', 'Superman'], tags: ['batman', 'dark', 'influential'] },
  { title: 'Maus', writer: 'Art Spiegelman', artist: 'Art Spiegelman', publisher: 'Pantheon', year: 1980, genre: ['Biographical', 'Historical'], issues: 2, description: 'Holocaust survival story told with animals', characters: ['Vladek Spiegelman'], tags: ['holocaust', 'memoir', 'pulitzer'] },
  { title: 'Sandman', writer: 'Neil Gaiman', artist: 'Various', publisher: 'DC/Vertigo', year: 1989, genre: ['Fantasy', 'Horror'], issues: 75, description: 'Dream of the Endless and his realm', characters: ['Morpheus', 'Death', 'The Endless'], tags: ['fantasy', 'mythology', 'literary'] },
  { title: 'Saga', writer: 'Brian K. Vaughan', artist: 'Fiona Staples', publisher: 'Image', year: 2012, genre: ['Sci-Fi', 'Fantasy', 'Romance'], description: 'Star-crossed lovers from warring worlds', characters: ['Alana', 'Marko', 'Hazel'], tags: ['space-opera', 'romance', 'modern'] },
  { title: 'Batman: Year One', writer: 'Frank Miller', artist: 'David Mazzucchelli', publisher: 'DC Comics', year: 1987, genre: ['Superhero', 'Noir'], issues: 4, description: 'Batman and Gordon early days', characters: ['Batman', 'James Gordon'], tags: ['batman', 'origin', 'noir'] },
  { title: 'V for Vendetta', writer: 'Alan Moore', artist: 'David Lloyd', publisher: 'DC/Vertigo', year: 1982, genre: ['Political', 'Thriller'], issues: 10, description: 'Anarchist fights fascist Britain', characters: ['V', 'Evey Hammond'], tags: ['political', 'anarchism', 'dystopia'] },
  { title: 'Akira', writer: 'Katsuhiro Otomo', artist: 'Katsuhiro Otomo', publisher: 'Kodansha', year: 1982, genre: ['Sci-Fi', 'Action'], issues: 120, description: 'Psychic powers in Neo-Tokyo', characters: ['Kaneda', 'Tetsuo', 'Akira'], tags: ['manga', 'cyberpunk', 'influential'] },
  { title: 'Berserk', writer: 'Kentaro Miura', artist: 'Kentaro Miura', publisher: 'Hakusensha', year: 1989, genre: ['Dark Fantasy', 'Action'], description: 'Guts revenge quest in a dark medieval world', characters: ['Guts', 'Griffith', 'Casca'], tags: ['manga', 'dark-fantasy', 'epic'] },
  { title: 'One Piece', writer: 'Eiichiro Oda', artist: 'Eiichiro Oda', publisher: 'Shueisha', year: 1997, genre: ['Adventure', 'Action', 'Comedy'], description: 'Luffy seeks the legendary treasure', characters: ['Monkey D. Luffy', 'Straw Hat Pirates'], tags: ['manga', 'adventure', 'shonen'] },
  { title: 'Persepolis', writer: 'Marjane Satrapi', artist: 'Marjane Satrapi', publisher: 'Association', year: 2000, genre: ['Autobiographical'], description: 'Growing up during the Iranian Revolution', characters: ['Marjane'], tags: ['memoir', 'iran', 'coming-of-age'] },
  { title: 'Bone', writer: 'Jeff Smith', artist: 'Jeff Smith', publisher: 'Cartoon Books', year: 1991, genre: ['Fantasy', 'Comedy'], issues: 55, description: 'Bone cousins in a fantasy valley', characters: ['Fone Bone', 'Phoney Bone', 'Smiley Bone'], tags: ['all-ages', 'fantasy', 'indie'] },
  { title: 'Y: The Last Man', writer: 'Brian K. Vaughan', artist: 'Pia Guerra', publisher: 'DC/Vertigo', year: 2002, genre: ['Sci-Fi', 'Drama'], issues: 60, description: 'Last surviving man after plague', characters: ['Yorick Brown', 'Agent 355'], tags: ['post-apocalyptic', 'survival'] },
  { title: 'Invincible', writer: 'Robert Kirkman', artist: 'Ryan Ottley', publisher: 'Image', year: 2003, genre: ['Superhero', 'Action'], issues: 144, description: 'Mark Grayson becomes a superhero', characters: ['Invincible', 'Omni-Man'], tags: ['superhero', 'violent', 'complete'] },
  { title: 'Transmetropolitan', writer: 'Warren Ellis', artist: 'Darick Robertson', publisher: 'DC/Vertigo', year: 1997, genre: ['Sci-Fi', 'Satire'], issues: 60, description: 'Gonzo journalist in the future', characters: ['Spider Jerusalem'], tags: ['cyberpunk', 'journalism', 'satirical'] }
];

// ===== AUDIOBOOKS DATABASE =====
export interface Audiobook {
  title: string;
  author: string;
  narrator: string;
  duration: string;
  genre: string[];
  year: number;
  description: string;
  tags: string[];
}

export const RECOMMENDED_AUDIOBOOKS: Audiobook[] = [
  { title: 'Project Hail Mary', author: 'Andy Weir', narrator: 'Ray Porter', duration: '16h 10m', genre: ['Science Fiction'], year: 2021, description: 'An astronaut wakes up alone with no memory', tags: ['sci-fi', 'humor', 'science'] },
  { title: 'The Martian', author: 'Andy Weir', narrator: 'R.C. Bray', duration: '10h 53m', genre: ['Science Fiction'], year: 2012, description: 'Astronaut stranded on Mars must survive', tags: ['sci-fi', 'survival', 'humor'] },
  { title: 'World War Z', author: 'Max Brooks', narrator: 'Full Cast', duration: '12h 9m', genre: ['Horror', 'Science Fiction'], year: 2006, description: 'Oral history of the zombie war', tags: ['zombies', 'full-cast', 'interviews'] },
  { title: 'Dune', author: 'Frank Herbert', narrator: 'Full Cast', duration: '21h 2m', genre: ['Science Fiction'], year: 1965, description: 'Epic saga on desert planet Arrakis', tags: ['epic', 'full-cast', 'classic'] },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', narrator: 'Nick Podehl', duration: '27h 55m', genre: ['Fantasy'], year: 2007, description: 'Kvothe tells his legendary story', tags: ['fantasy', 'magic', 'narrative'] },
  { title: 'American Gods', author: 'Neil Gaiman', narrator: 'Full Cast', duration: '19h 39m', genre: ['Fantasy'], year: 2001, description: 'Old gods vs new in America', tags: ['mythology', 'full-cast', 'gaiman'] },
  { title: 'Ready Player One', author: 'Ernest Cline', narrator: 'Wil Wheaton', duration: '15h 40m', genre: ['Science Fiction'], year: 2011, description: 'Virtual reality treasure hunt', tags: ['gaming', '80s', 'nostalgia'] },
  { title: 'Born a Crime', author: 'Trevor Noah', narrator: 'Trevor Noah', duration: '8h 44m', genre: ['Memoir', 'Comedy'], year: 2016, description: 'Trevor Noahs South African childhood', tags: ['memoir', 'author-narrated', 'comedy'] },
  { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', narrator: 'Richard Matthews', duration: '18h 13m', genre: ['Science', 'Non-Fiction'], year: 2003, description: 'Accessible science history', tags: ['science', 'educational', 'engaging'] },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', narrator: 'Rob Inglis', duration: '11h 8m', genre: ['Fantasy'], year: 1937, description: 'Bilbo Baggins unexpected journey', tags: ['fantasy', 'classic', 'adventure'] }
];

// ===== ART DATABASE =====
export interface ArtMovement {
  name: string;
  period: string;
  description: string;
  characteristics: string[];
  keyArtists: string[];
  keyWorks: string[];
  influences: string[];
  tags: string[];
}

export const ART_MOVEMENTS: ArtMovement[] = [
  { name: 'Renaissance', period: '14th-17th century', description: 'Rebirth of classical learning and art', characteristics: ['Linear perspective', 'Naturalism', 'Humanism', 'Classical themes'], keyArtists: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli'], keyWorks: ['Mona Lisa', 'Sistine Chapel', 'The School of Athens', 'The Birth of Venus'], influences: ['Classical Greek and Roman art'], tags: ['classical', 'perspective', 'italy'] },
  { name: 'Baroque', period: '17th-18th century', description: 'Dramatic and emotional art with grandeur', characteristics: ['Drama', 'Rich colors', 'Light and shadow', 'Movement'], keyArtists: ['Caravaggio', 'Rembrandt', 'Vermeer', 'Rubens'], keyWorks: ['The Night Watch', 'Girl with a Pearl Earring', 'The Calling of St Matthew'], influences: ['Counter-Reformation', 'Renaissance'], tags: ['dramatic', 'chiaroscuro', 'religious'] },
  { name: 'Impressionism', period: '1860s-1880s', description: 'Capturing light and moment', characteristics: ['Visible brushstrokes', 'Light emphasis', 'Movement', 'Everyday subjects'], keyArtists: ['Monet', 'Renoir', 'Degas', 'Pissarro'], keyWorks: ['Water Lilies', 'Impression Sunrise', 'Ballet Class'], influences: ['Photography', 'Japanese prints'], tags: ['light', 'brushwork', 'france'] },
  { name: 'Post-Impressionism', period: '1886-1905', description: 'Extended Impressionism while rejecting its limitations', characteristics: ['Bold colors', 'Geometric forms', 'Emotional expression'], keyArtists: ['Van Gogh', 'Gauguin', 'Cezanne', 'Seurat'], keyWorks: ['Starry Night', 'Mont Sainte-Victoire', 'A Sunday on La Grande Jatte'], influences: ['Impressionism'], tags: ['expressive', 'color', 'form'] },
  { name: 'Expressionism', period: '1905-1920s', description: 'Emotional experience over physical reality', characteristics: ['Distortion', 'Bold colors', 'Emotional', 'Angular forms'], keyArtists: ['Munch', 'Kirchner', 'Kandinsky', 'Schiele'], keyWorks: ['The Scream', 'Street Berlin', 'Self-Portrait'], influences: ['Van Gogh', 'African art'], tags: ['emotion', 'distortion', 'germany'] },
  { name: 'Cubism', period: '1907-1920s', description: 'Objects from multiple viewpoints', characteristics: ['Geometric shapes', 'Multiple perspectives', 'Fragmentation'], keyArtists: ['Picasso', 'Braque', 'Juan Gris', 'Leger'], keyWorks: ['Les Demoiselles dAvignon', 'Guernica', 'Violin and Candlestick'], influences: ['Cezanne', 'African sculpture'], tags: ['geometric', 'revolutionary', 'abstract'] },
  { name: 'Surrealism', period: '1920s-1960s', description: 'Unconscious mind and dreamlike imagery', characteristics: ['Dream imagery', 'Unexpected juxtapositions', 'Automatism'], keyArtists: ['Dali', 'Magritte', 'Ernst', 'Miro'], keyWorks: ['The Persistence of Memory', 'The Treachery of Images', 'The Elephants'], influences: ['Freud', 'Dada'], tags: ['dreams', 'subconscious', 'bizarre'] },
  { name: 'Abstract Expressionism', period: '1940s-1960s', description: 'Spontaneous expression through abstraction', characteristics: ['Large scale', 'Gestural', 'Non-representational', 'Emotional'], keyArtists: ['Pollock', 'de Kooning', 'Rothko', 'Kline'], keyWorks: ['Number 1A', 'Woman I', 'Orange Red Yellow'], influences: ['Surrealism', 'Existentialism'], tags: ['american', 'gestural', 'action-painting'] },
  { name: 'Pop Art', period: '1950s-1970s', description: 'Art from popular and commercial culture', characteristics: ['Bold colors', 'Mass media imagery', 'Irony', 'Consumer culture'], keyArtists: ['Warhol', 'Lichtenstein', 'Johns', 'Hockney'], keyWorks: ['Campbells Soup Cans', 'Whaam!', 'Marilyn Diptych'], influences: ['Dada', 'Advertising'], tags: ['consumer', 'media', 'american'] },
  { name: 'Minimalism', period: '1960s-1970s', description: 'Art stripped to essential form', characteristics: ['Simple geometric forms', 'Industrial materials', 'Impersonal'], keyArtists: ['Judd', 'Andre', 'Flavin', 'LeWitt'], keyWorks: ['Untitled Stack', 'Equivalent VIII'], influences: ['Constructivism', 'Bauhaus'], tags: ['geometric', 'simple', 'sculpture'] },
  { name: 'Street Art', period: '1970s-present', description: 'Visual art in public locations', characteristics: ['Public spaces', 'Social commentary', 'Spray paint', 'Accessible'], keyArtists: ['Banksy', 'Keith Haring', 'Jean-Michel Basquiat', 'Shepard Fairey'], keyWorks: ['Girl with Balloon', 'Crack is Wack', 'SAMO'], influences: ['Graffiti', 'Pop Art'], tags: ['urban', 'graffiti', 'political'] }
];

// ===== SOUND EFFECTS DATABASE =====
export interface SoundEffect {
  name: string;
  category: string;
  description: string;
  variations?: string[];
  tags: string[];
}

export const SOUND_EFFECT_CATEGORIES = [
  { name: 'Nature', subcategories: ['Rain', 'Thunder', 'Wind', 'Water', 'Fire', 'Birds', 'Insects', 'Animals'] },
  { name: 'Urban', subcategories: ['Traffic', 'Sirens', 'Construction', 'Crowds', 'Public Transport'] },
  { name: 'Household', subcategories: ['Doors', 'Appliances', 'Footsteps', 'Glass', 'Metal'] },
  { name: 'Technology', subcategories: ['Computers', 'Phones', 'Cameras', 'Electronics', 'Machinery'] },
  { name: 'Human', subcategories: ['Voices', 'Breathing', 'Heartbeat', 'Laughter', 'Crying'] },
  { name: 'Sci-Fi', subcategories: ['Lasers', 'Spaceships', 'Robots', 'Teleport', 'Force Fields'] },
  { name: 'Fantasy', subcategories: ['Magic', 'Creatures', 'Swords', 'Spells', 'Ambience'] },
  { name: 'Horror', subcategories: ['Creepy', 'Monsters', 'Screams', 'Suspense', 'Gore'] },
  { name: 'UI/UX', subcategories: ['Clicks', 'Notifications', 'Success', 'Error', 'Transitions'] },
  { name: 'Musical', subcategories: ['Stingers', 'Hits', 'Whooshes', 'Risers', 'Drops'] }
];

// Helper functions
export function searchMedia(query: string, type?: string) {
  const q = query.toLowerCase();
  const results: any[] = [];

  if (!type || type === 'music') {
    results.push(...LEGENDARY_ARTISTS.filter(a =>
      a.name.toLowerCase().includes(q) || a.genres.some(g => g.toLowerCase().includes(q))
    ).map(a => ({ ...a, type: 'artist' })));
  }
  if (!type || type === 'movie') {
    results.push(...CLASSIC_MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q)
    ).map(m => ({ ...m, type: 'movie' })));
  }
  if (!type || type === 'tv') {
    results.push(...LEGENDARY_TV_SHOWS.filter(t =>
      t.title.toLowerCase().includes(q) || t.creator.toLowerCase().includes(q)
    ).map(t => ({ ...t, type: 'tvshow' })));
  }
  if (!type || type === 'game') {
    results.push(...LEGENDARY_GAMES.filter(g =>
      g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q)
    ).map(g => ({ ...g, type: 'game' })));
  }
  if (!type || type === 'book') {
    results.push(...CLASSIC_BOOKS.filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    ).map(b => ({ ...b, type: 'book' })));
  }
  if (!type || type === 'comic') {
    results.push(...LEGENDARY_COMICS.filter(c =>
      c.title.toLowerCase().includes(q) || c.writer.toLowerCase().includes(q)
    ).map(c => ({ ...c, type: 'comic' })));
  }

  return results;
}

export function getMediaByGenre(genre: string) {
  return {
    movies: CLASSIC_MOVIES.filter(m => m.genre.includes(genre)),
    shows: LEGENDARY_TV_SHOWS.filter(t => t.genre.includes(genre)),
    games: LEGENDARY_GAMES.filter(g => g.genre.includes(genre)),
    books: CLASSIC_BOOKS.filter(b => b.genre.includes(genre)),
    comics: LEGENDARY_COMICS.filter(c => c.genre.includes(genre))
  };
}

export function getEmulatorForSystem(system: string) {
  return EMULATORS.filter(e => e.system.toLowerCase().includes(system.toLowerCase()));
}
