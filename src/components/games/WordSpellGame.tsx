// Word Spell Game Component
// Form words from random letters within a time limit

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { ArrowLeft, RotateCcw, Trophy, Clock, Shuffle, Send, Sparkles, X } from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Valid words list (~200 common 3-6 letter words)
const VALID_WORDS = new Set([
  // 3-letter words
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'let', 'may', 'new', 'now', 'old', 'see', 'two', 'way',
  'who', 'boy', 'did', 'own', 'say', 'she', 'too', 'use', 'dad', 'mom',
  'run', 'eat', 'big', 'dog', 'cat', 'hat', 'bat', 'rat', 'sat', 'mat',
  'pat', 'fat', 'sit', 'hit', 'bit', 'fit', 'kit', 'pit', 'wit', 'hot',
  'pot', 'lot', 'got', 'not', 'dot', 'cot', 'rot', 'cut', 'gut', 'hut',
  'nut', 'put', 'rut', 'tub', 'hub', 'pub', 'rub', 'sub', 'cub', 'dub',
  'bed', 'red', 'led', 'fed', 'wed', 'pen', 'ten', 'hen', 'men', 'den',
  'van', 'fan', 'man', 'pan', 'ran', 'tan', 'ban', 'can', 'top', 'hop',
  'mop', 'pop', 'cop', 'job', 'rob', 'sob', 'mob', 'nob', 'box', 'fox',
  'mix', 'fix', 'six', 'wax', 'tax', 'axe', 'ape', 'ate', 'ace', 'age',
  'aim', 'air', 'ant', 'arm', 'art', 'ask', 'bad', 'bag', 'bar', 'bay',
  'bee', 'bet', 'bow', 'bud', 'bug', 'bus', 'buy', 'cab', 'cap', 'car',
  'cry', 'cup', 'dam', 'dew', 'die', 'dig', 'dim', 'dip', 'dry', 'due',
  'dug', 'ear', 'egg', 'end', 'era', 'eve', 'eye', 'far', 'few', 'fig',
  'fin', 'fir', 'fit', 'fly', 'fog', 'fun', 'fur', 'gap', 'gas', 'gem',
  'gin', 'god', 'gum', 'gun', 'gut', 'guy', 'gym', 'ham', 'hay', 'hen',
  'hid', 'hip', 'hog', 'hop', 'hug', 'ice', 'ill', 'ink', 'inn', 'ion',
  'ivy', 'jam', 'jar', 'jaw', 'jet', 'jog', 'joy', 'jug', 'key', 'kid',
  'kin', 'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'leg', 'lid', 'lie',
  'lip', 'lit', 'log', 'low', 'mad', 'map', 'max', 'met', 'mid', 'mix',
  'mud', 'mug', 'nap', 'net', 'nod', 'nor', 'nun', 'oak', 'oar', 'odd',
  'oil', 'opt', 'orb', 'ore', 'owe', 'owl', 'pad', 'pal', 'paw', 'pay',
  'pea', 'peg', 'pet', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pry',
  'pup', 'rag', 'ram', 'raw', 'ray', 'rib', 'rid', 'rig', 'rim', 'rip',
  'rod', 'row', 'rug', 'rum', 'rye', 'sad', 'sag', 'sap', 'saw', 'set',
  'sew', 'shy', 'sin', 'sip', 'sir', 'sis', 'ski', 'sky', 'sly', 'sob',
  'sod', 'son', 'sop', 'sow', 'soy', 'spa', 'spy', 'sum', 'sun', 'tab',
  'tag', 'tap', 'tar', 'tea', 'ten', 'the', 'thy', 'tie', 'tin', 'tip',
  'toe', 'tom', 'ton', 'too', 'top', 'tow', 'toy', 'try', 'tug', 'urn',
  'van', 'vat', 'vet', 'via', 'vie', 'vow', 'wag', 'war', 'web', 'wed',
  'wig', 'win', 'wit', 'woe', 'wok', 'won', 'wry', 'yam', 'yap', 'yaw',
  'yes', 'yet', 'yew', 'zip', 'zoo',
  // 4-letter words
  'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'been',
  'call', 'come', 'make', 'than', 'time', 'very', 'when', 'want', 'also',
  'back', 'good', 'know', 'just', 'only', 'over', 'such', 'take', 'than',
  'them', 'then', 'well', 'what', 'work', 'year', 'more', 'some', 'look',
  'here', 'said', 'were', 'find', 'each', 'give', 'most', 'into', 'same',
  'both', 'life', 'many', 'much', 'must', 'name', 'even', 'part', 'last',
  'long', 'made', 'need', 'says', 'show', 'such', 'away', 'best', 'city',
  'does', 'down', 'ever', 'face', 'fact', 'feel', 'form', 'game', 'goes',
  'hand', 'head', 'help', 'high', 'home', 'idea', 'keep', 'kind', 'late',
  'left', 'line', 'live', 'love', 'mean', 'mind', 'move', 'next', 'once',
  'open', 'play', 'read', 'room', 'seen', 'side', 'talk', 'tell', 'turn',
  'used', 'want', 'week', 'went', 'word', 'area', 'body', 'book', 'care',
  'case', 'dear', 'done', 'door', 'draw', 'drop', 'else', 'fall', 'farm',
  'fast', 'fear', 'fire', 'fish', 'food', 'foot', 'four', 'free', 'full',
  'girl', 'gold', 'grow', 'half', 'hard', 'hear', 'held', 'hold', 'hope',
  'hour', 'huge', 'king', 'knew', 'land', 'lead', 'less', 'lost', 'mark',
  'meet', 'miss', 'near', 'note', 'pass', 'past', 'pick', 'plan', 'poor',
  'push', 'rain', 'real', 'rest', 'rich', 'ride', 'rise', 'road', 'rock',
  'rule', 'safe', 'sail', 'save', 'sell', 'send', 'ship', 'shop', 'shut',
  'sign', 'size', 'skin', 'slow', 'snow', 'soft', 'soon', 'sort', 'star',
  'stay', 'step', 'stop', 'sure', 'team', 'term', 'test', 'thin', 'thus',
  'town', 'tree', 'trip', 'true', 'upon', 'view', 'wait', 'walk', 'wall',
  'warm', 'wash', 'wide', 'wife', 'wild', 'wind', 'wish', 'wood', 'yard',
  'zero', 'bone', 'dark', 'deal', 'deep', 'desk', 'diet', 'dirt', 'disk',
  'drug', 'duty', 'earn', 'east', 'edge', 'exam', 'exit', 'fair', 'fate',
  'film', 'fine', 'flag', 'flat', 'flow', 'folk', 'fool', 'fork', 'gift',
  'glad', 'goal', 'golf', 'grab', 'gray', 'grey', 'grin', 'gulf', 'hall',
  'hang', 'harm', 'hate', 'heal', 'heat', 'hell', 'hide', 'hill', 'hire',
  'holy', 'hook', 'host', 'hunt', 'hurt', 'inch', 'iron', 'item', 'jack',
  'jail', 'join', 'joke', 'jump', 'jury', 'kick', 'kill', 'kiss', 'knee',
  'knot', 'lack', 'lady', 'lake', 'lamp', 'lane', 'lawn', 'lean', 'leap',
  'lend', 'lift', 'link', 'list', 'load', 'loan', 'lock', 'lone', 'loop',
  'luck', 'lung', 'mail', 'main', 'male', 'mall', 'mass', 'math', 'meal',
  'meat', 'milk', 'mine', 'mode', 'mood', 'moon', 'more', 'nail', 'neck',
  'noon', 'nose', 'oven', 'pace', 'pack', 'page', 'paid', 'pain', 'pair',
  'pale', 'palm', 'park', 'path', 'peak', 'peer', 'pile', 'pine', 'pink',
  'pipe', 'poll', 'pool', 'pose', 'post', 'pour', 'pray', 'pure', 'quit',
  'race', 'rack', 'rage', 'rail', 'rank', 'rare', 'rate', 'rely', 'rent',
  'ring', 'riot', 'risk', 'role', 'roll', 'roof', 'root', 'rose', 'rush',
  'salt', 'sand', 'scan', 'seal', 'seat', 'seed', 'seek', 'self', 'shed',
  'shoe', 'shot', 'sick', 'sink', 'site', 'slip', 'snap', 'sock', 'soil',
  'sold', 'sole', 'some', 'song', 'soul', 'spot', 'suit', 'swim', 'tail',
  'tale', 'tall', 'tank', 'tape', 'task', 'tear', 'tend', 'text', 'them',
  'tide', 'till', 'tiny', 'tire', 'toll', 'tomb', 'tone', 'tool', 'tops',
  'toss', 'tour', 'tube', 'tune', 'twin', 'type', 'unit', 'urge', 'vary',
  'vast', 'vote', 'wage', 'wake', 'warn', 'wave', 'weak', 'wear', 'weep',
  'west', 'wine', 'wing', 'wire', 'wise', 'wolf', 'wrap', 'zone',
  // 5-letter words
  'about', 'after', 'again', 'being', 'black', 'bring', 'cause', 'child',
  'close', 'could', 'court', 'early', 'every', 'field', 'first', 'force',
  'found', 'front', 'given', 'going', 'great', 'green', 'group', 'heard',
  'heart', 'house', 'human', 'large', 'later', 'learn', 'leave', 'level',
  'light', 'local', 'money', 'month', 'music', 'never', 'night', 'north',
  'often', 'order', 'other', 'party', 'place', 'plant', 'point', 'power',
  'press', 'price', 'quite', 'ready', 'right', 'river', 'round', 'small',
  'south', 'space', 'stand', 'start', 'state', 'still', 'study', 'table',
  'taken', 'thank', 'their', 'there', 'these', 'thing', 'think', 'third',
  'those', 'three', 'today', 'total', 'under', 'until', 'value', 'voice',
  'watch', 'water', 'where', 'which', 'while', 'white', 'whole', 'woman',
  'world', 'write', 'wrong', 'young', 'above', 'alone', 'among', 'apply',
  'avoid', 'basic', 'beach', 'begin', 'below', 'board', 'brain', 'bread',
  'break', 'brief', 'broad', 'brown', 'build', 'carry', 'catch', 'chair',
  'cheap', 'check', 'civil', 'claim', 'class', 'clean', 'clear', 'climb',
  'clock', 'cloth', 'cloud', 'coach', 'coast', 'cover', 'cream', 'cross',
  'crowd', 'daily', 'dance', 'death', 'depth', 'doubt', 'draft', 'drama',
  'drawn', 'dream', 'dress', 'drink', 'drive', 'earth', 'empty', 'enemy',
  'enjoy', 'enter', 'equal', 'event', 'exact', 'exist', 'extra', 'faith',
  'false', 'fault', 'favor', 'fence', 'fewer', 'fifth', 'fifty', 'fight',
  'final', 'fixed', 'flesh', 'float', 'floor', 'focus', 'forth', 'frame',
  'fresh', 'fruit', 'funny', 'giant', 'given', 'glass', 'globe', 'grace',
  'grade', 'grain', 'grand', 'grant', 'grass', 'grave', 'gross', 'guard',
  'guess', 'guest', 'guide', 'habit', 'happy', 'hence', 'honor', 'horse',
  'hotel', 'ideal', 'image', 'index', 'inner', 'input', 'issue', 'joint',
  'jones', 'judge', 'juice', 'knife', 'knock', 'known', 'labor', 'laugh',
  'layer', 'legal', 'limit', 'liver', 'loose', 'lover', 'lower', 'lucky',
  'lunch', 'magic', 'major', 'maker', 'march', 'marry', 'match', 'mayor',
  'meant', 'metal', 'midst', 'might', 'minor', 'mixed', 'model', 'moral',
  'motor', 'mount', 'mouse', 'mouth', 'movie', 'naked', 'nerve', 'noise',
  'north', 'novel', 'nurse', 'ocean', 'offer', 'olive', 'organ', 'ought',
  'outer', 'owner', 'paint', 'panel', 'paper', 'party', 'patch', 'pause',
  'peace', 'phase', 'phone', 'photo', 'piano', 'piece', 'pilot', 'pitch',
  'plain', 'plane', 'plate', 'poems', 'point', 'pound', 'pride', 'prime',
  'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick',
  'quiet', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'realm',
  'refer', 'relax', 'reply', 'rider', 'ridge', 'rifle', 'risen', 'rival',
  'robot', 'roman', 'rough', 'route', 'royal', 'rural', 'saint', 'salad',
  'sales', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven',
  'shade', 'shake', 'shall', 'shame', 'shape', 'share', 'sharp', 'sheep',
  'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot',
  'shore', 'short', 'sight', 'since', 'sixth', 'skill', 'slave', 'sleep',
  'slice', 'slide', 'slope', 'smart', 'smell', 'smile', 'smoke', 'snake',
  'solid', 'solve', 'sorry', 'sound', 'speak', 'speed', 'spend', 'spent',
  'split', 'spoke', 'sport', 'spray', 'staff', 'stage', 'stair', 'stake',
  'stamp', 'stare', 'steal', 'steam', 'steel', 'steep', 'stick', 'stock',
  'stone', 'store', 'storm', 'story', 'strip', 'stuck', 'stuff', 'style',
  'sugar', 'suite', 'super', 'sweet', 'swing', 'sword', 'taste', 'teach',
  'teeth', 'tempo', 'terms', 'texas', 'theme', 'thick', 'throw', 'tight',
  'times', 'tired', 'title', 'toast', 'token', 'tooth', 'topic', 'touch',
  'tough', 'tower', 'trace', 'track', 'trade', 'trail', 'train', 'trait',
  'trash', 'treat', 'trend', 'trial', 'tribe', 'trick', 'troop', 'truck',
  'truly', 'trunk', 'trust', 'truth', 'twice', 'twist', 'uncle', 'union',
  'upper', 'urban', 'usual', 'valid', 'video', 'viral', 'virus', 'visit',
  'vital', 'wagon', 'waste', 'weigh', 'weird', 'wheat', 'wheel', 'whose',
  'woods', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'wrist',
  'write', 'yield', 'youth',
  // 6-letter words
  'accept', 'across', 'action', 'actual', 'affect', 'afford', 'almost',
  'always', 'amount', 'animal', 'answer', 'anyone', 'appear', 'attack',
  'author', 'before', 'behind', 'belief', 'belong', 'better', 'beyond',
  'border', 'bottle', 'bottom', 'branch', 'bridge', 'bright', 'broken',
  'budget', 'burden', 'butter', 'button', 'camera', 'cancer', 'cannot',
  'carbon', 'career', 'castle', 'center', 'centre', 'chance', 'change',
  'charge', 'choice', 'choose', 'church', 'circle', 'client', 'closed',
  'coffee', 'column', 'combat', 'coming', 'common', 'comply', 'copper',
  'corner', 'cotton', 'couple', 'course', 'create', 'credit', 'crisis',
  'custom', 'damage', 'danger', 'dealer', 'debate', 'decade', 'decide',
  'deeply', 'defend', 'define', 'degree', 'demand', 'depend', 'desert',
  'design', 'desire', 'detail', 'device', 'differ', 'dinner', 'direct',
  'doctor', 'domain', 'double', 'driver', 'easily', 'eating', 'editor',
  'effect', 'effort', 'eighth', 'either', 'eleven', 'emerge', 'empire',
  'employ', 'enable', 'ending', 'energy', 'engage', 'engine', 'enough',
  'ensure', 'entire', 'entity', 'equity', 'escape', 'estate', 'ethnic',
  'exceed', 'except', 'expand', 'expect', 'expert', 'export', 'extend',
  'extent', 'fabric', 'facing', 'factor', 'failed', 'fairly', 'fallen',
  'family', 'famous', 'farmer', 'father', 'fellow', 'female', 'figure',
  'filing', 'finger', 'finish', 'fiscal', 'flight', 'flying', 'follow',
  'forced', 'forest', 'forget', 'formal', 'format', 'former', 'fourth',
  'freeze', 'french', 'friend', 'frozen', 'future', 'garden', 'gather',
  'gender', 'german', 'global', 'golden', 'ground', 'growth', 'guilty',
  'handle', 'happen', 'hardly', 'headed', 'health', 'heaven', 'height',
  'hidden', 'holder', 'honest', 'ignore', 'impact', 'import', 'impose',
  'income', 'indeed', 'injury', 'inside', 'intend', 'invest', 'island',
  'itself', 'jersey', 'joseph', 'keeper', 'killed', 'knight', 'launch',
  'lawyer', 'leader', 'league', 'legacy', 'lender', 'length', 'lesson',
  'letter', 'likely', 'listen', 'little', 'living', 'longer', 'losing',
  'lovely', 'luxury', 'mainly', 'manage', 'manner', 'margin', 'market',
  'master', 'matter', 'medium', 'member', 'memory', 'mental', 'merely',
  'merger', 'method', 'middle', 'miller', 'mining', 'minute', 'mirror',
  'mobile', 'modern', 'modest', 'moment', 'monkey', 'mostly', 'mother',
  'motion', 'moving', 'murder', 'museum', 'mutual', 'myriad', 'myself',
  'narrow', 'nation', 'native', 'nature', 'nearby', 'nearly', 'nobody',
  'normal', 'notice', 'notion', 'number', 'object', 'obtain', 'occupy',
  'office', 'offset', 'online', 'openly', 'oppose', 'option', 'orange',
  'origin', 'output', 'oxygen', 'palace', 'parent', 'partly', 'patent',
  'people', 'period', 'permit', 'person', 'phrase', 'picked', 'planet',
  'player', 'please', 'plenty', 'pocket', 'poetry', 'police', 'policy',
  'prefer', 'pretty', 'priest', 'prince', 'prison', 'profit', 'proper',
  'proven', 'public', 'pursue', 'raised', 'random', 'rarely', 'rather',
  'reader', 'really', 'reason', 'recall', 'recent', 'record', 'reduce',
  'reform', 'refuse', 'regard', 'regime', 'region', 'reject', 'relate',
  'relief', 'remain', 'remote', 'remove', 'rental', 'repair', 'repeat',
  'report', 'rescue', 'resign', 'resist', 'resort', 'result', 'retail',
  'retain', 'retire', 'return', 'reveal', 'review', 'reward', 'riding',
  'rising', 'robust', 'runner', 'safely', 'safety', 'salary', 'sample',
  'saving', 'scheme', 'school', 'screen', 'search', 'season', 'second',
  'secret', 'sector', 'secure', 'seeing', 'select', 'seller', 'senate',
  'senior', 'series', 'settle', 'severe', 'sexual', 'shadow', 'should',
  'shower', 'signal', 'signed', 'silent', 'silver', 'simple', 'simply',
  'single', 'sister', 'slight', 'smooth', 'social', 'solely', 'solver',
  'source', 'speech', 'sphere', 'spirit', 'spread', 'spring', 'square',
  'stable', 'status', 'steady', 'stolen', 'stored', 'strain', 'stream',
  'street', 'stress', 'strict', 'strike', 'string', 'strong', 'struck',
  'studio', 'stupid', 'submit', 'subtle', 'suburb', 'sudden', 'suffer',
  'summer', 'summit', 'supply', 'surely', 'survey', 'switch', 'symbol',
  'system', 'tackle', 'talent', 'target', 'temple', 'tenant', 'tender',
  'tennis', 'thanks', 'theory', 'thirty', 'though', 'threat', 'thrown',
  'ticket', 'timber', 'tissue', 'toward', 'travel', 'treaty', 'tribal',
  'trying', 'tunnel', 'turkey', 'turned', 'twelve', 'twenty', 'unique',
  'united', 'unless', 'unlike', 'update', 'useful', 'valley', 'varied',
  'vendor', 'versus', 'vessel', 'victim', 'vision', 'visual', 'volume',
  'voters', 'waiting', 'walker', 'wallet', 'warmth', 'wealth', 'weapon',
  'weekly', 'weight', 'wholly', 'widely', 'window', 'winner', 'winter',
  'within', 'wonder', 'wooden', 'worker', 'worthy', 'writer', 'yellow',
]);

// Keyframes
const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const victoryGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
  50% { box-shadow: 0 0 60px rgba(212, 175, 55, 0.8); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

// Styled components
const GameContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Header = styled(Box)({
  width: '100%',
  maxWidth: '700px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const StatsBar = styled(Box)({
  display: 'flex',
  gap: '24px',
  justifyContent: 'center',
  marginBottom: '32px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
});

const TimerDisplay = styled(Box)<{ urgent: boolean }>(({ urgent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: urgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  border: `1px solid ${urgent ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
  animation: urgent ? `${pulse} 0.5s ease-in-out infinite` : 'none',
}));

const LetterTilesContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const LetterTile = styled(Box)<{ selected: boolean; used: boolean }>(({ selected, used }) => ({
  width: '60px',
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontFamily: '"Cinzel", serif',
  fontWeight: 700,
  borderRadius: '12px',
  cursor: used ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  background: selected
    ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
    : used
    ? 'rgba(30, 30, 40, 0.5)'
    : 'linear-gradient(135deg, #1a1028 0%, #2d1f4a 100%)',
  color: selected ? '#ffffff' : used ? '#555' : '#e0e0e0',
  border: `2px solid ${selected ? '#a78bfa' : used ? '#333' : 'rgba(139, 92, 246, 0.5)'}`,
  boxShadow: selected
    ? '0 0 20px rgba(139, 92, 246, 0.5)'
    : '0 4px 15px rgba(0, 0, 0, 0.3)',
  transform: selected ? 'translateY(-4px) scale(1.05)' : 'translateY(0)',
  opacity: used ? 0.5 : 1,
  '&:hover': {
    transform: used ? 'none' : 'translateY(-4px) scale(1.05)',
    borderColor: used ? '#333' : '#a78bfa',
  },
}));

const CurrentWordDisplay = styled(Box)({
  minHeight: '80px',
  padding: '16px 32px',
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  marginBottom: '24px',
  minWidth: '300px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const FoundWordsContainer = styled(Box)({
  maxWidth: '600px',
  width: '100%',
  marginTop: '24px',
});

const VictoryOverlay = styled(Box)({
  position: 'fixed',
  inset: 0,
  background: 'rgba(10, 8, 18, 0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const VictoryCard = styled(GothicCard)({
  maxWidth: '400px',
  textAlign: 'center',
  animation: `${victoryGlow} 2s ease-in-out infinite`,
});

const SparkleEffect = styled(Box)({
  position: 'absolute',
  width: '20px',
  height: '20px',
  animation: `${sparkle} 1.5s ease-in-out infinite`,
  '&::before': {
    content: '"*"',
    fontSize: '24px',
    color: '#d4af37',
  },
});

const TrophyIcon = styled(Box)({
  animation: `${float} 2s ease-in-out infinite`,
  marginBottom: '16px',
});

const FeedbackMessage = styled(Typography)<{ type: 'success' | 'error' }>(({ type }) => ({
  color: type === 'success' ? '#10b981' : '#ef4444',
  fontSize: '0.9rem',
  marginTop: '8px',
  animation: type === 'error' ? `${shake} 0.3s ease` : `${bounce} 0.3s ease`,
}));

// Vowels and consonants for letter generation
const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';

interface WordSpellGameProps {
  onBack: () => void;
}

const STORAGE_KEY = 'wordSpellHighScore';
const GAME_DURATION = 60;

export const WordSpellGame: React.FC<WordSpellGameProps> = ({ onBack }) => {
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Generate random letters with good vowel/consonant balance
  const generateLetters = useCallback(() => {
    const newLetters: string[] = [];
    // Ensure 2-3 vowels
    const vowelCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < vowelCount; i++) {
      newLetters.push(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
    }
    // Fill rest with consonants
    while (newLetters.length < 7) {
      newLetters.push(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
    }
    // Shuffle
    return newLetters.sort(() => Math.random() - 0.5);
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    setLetters(generateLetters());
    setSelectedIndices([]);
    setCurrentWord('');
    setFoundWords([]);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(false);
    setIsGameOver(false);
    setFeedback(null);
  }, [generateLetters]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    initializeGame();
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            setIsGameOver(true);
            // Check and save high score
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem(STORAGE_KEY, score.toString());
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, score, highScore]);

  // Handle letter click
  const handleLetterClick = (index: number) => {
    if (!isPlaying && !isGameOver) {
      setIsPlaying(true);
    }

    if (isGameOver) return;

    if (selectedIndices.includes(index)) {
      // Deselect this letter and all after it
      const position = selectedIndices.indexOf(index);
      const newSelected = selectedIndices.slice(0, position);
      setSelectedIndices(newSelected);
      setCurrentWord(newSelected.map((i) => letters[i]).join(''));
    } else {
      // Select this letter
      const newSelected = [...selectedIndices, index];
      setSelectedIndices(newSelected);
      setCurrentWord(newSelected.map((i) => letters[i]).join(''));
    }
    setFeedback(null);
  };

  // Calculate word score
  const getWordScore = (word: string): number => {
    const len = word.length;
    if (len === 3) return 100;
    if (len === 4) return 200;
    if (len === 5) return 400;
    if (len >= 6) return 800;
    return 0;
  };

  // Submit word
  const submitWord = () => {
    if (currentWord.length < 3) {
      setFeedback({ message: 'Words must be at least 3 letters!', type: 'error' });
      return;
    }

    const wordLower = currentWord.toLowerCase();

    if (foundWords.includes(wordLower)) {
      setFeedback({ message: 'Already found this word!', type: 'error' });
      return;
    }

    if (!VALID_WORDS.has(wordLower)) {
      setFeedback({ message: 'Not a valid word!', type: 'error' });
      return;
    }

    // Valid word!
    const wordScore = getWordScore(wordLower);
    setScore((s) => s + wordScore);
    setFoundWords((prev) => [...prev, wordLower]);
    setFeedback({ message: `+${wordScore} points!`, type: 'success' });
    setSelectedIndices([]);
    setCurrentWord('');
  };

  // Clear current word
  const clearWord = () => {
    setSelectedIndices([]);
    setCurrentWord('');
    setFeedback(null);
  };

  // Shuffle letters
  const shuffleLetters = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setLetters(shuffled);
    setSelectedIndices([]);
    setCurrentWord('');
  };

  return (
    <GameContainer>
      {/* Header */}
      <Header>
        <GothicButton variant="ghost" onClick={onBack} startIcon={<ArrowLeft size={18} />}>
          Back
        </GothicButton>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '1.8rem',
            color: '#8b5cf6',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
          }}
        >
          Word Spell
        </Typography>
        <GothicButton variant="secondary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
          New Game
        </GothicButton>
      </Header>

      {/* Stats */}
      <StatsBar>
        <TimerDisplay urgent={timeLeft <= 10 && isPlaying}>
          <Clock size={20} color={timeLeft <= 10 ? '#ef4444' : '#10b981'} />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Time</Typography>
            <Typography sx={{ color: timeLeft <= 10 ? '#ef4444' : '#e0e0e0', fontWeight: 600, fontSize: '1.2rem' }}>
              {timeLeft}s
            </Typography>
          </Box>
        </TimerDisplay>
        <StatItem>
          <Sparkles size={20} color="#d4af37" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Score</Typography>
            <Typography sx={{ color: '#d4af37', fontWeight: 600, fontSize: '1.2rem' }}>{score}</Typography>
          </Box>
        </StatItem>
        <StatItem>
          <Trophy size={20} color="#f97316" />
          <Box>
            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>High Score</Typography>
            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{highScore}</Typography>
          </Box>
        </StatItem>
      </StatsBar>

      {/* Letter Tiles */}
      <LetterTilesContainer>
        {letters.map((letter, index) => (
          <LetterTile
            key={index}
            selected={selectedIndices.includes(index)}
            used={false}
            onClick={() => handleLetterClick(index)}
          >
            {letter}
          </LetterTile>
        ))}
      </LetterTilesContainer>

      {/* Shuffle Button */}
      <GothicButton
        variant="ghost"
        onClick={shuffleLetters}
        startIcon={<Shuffle size={18} />}
        sx={{ mb: 3 }}
      >
        Shuffle Letters
      </GothicButton>

      {/* Current Word Display */}
      <CurrentWordDisplay>
        {currentWord ? (
          <Typography
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '2rem',
              color: '#d4af37',
              letterSpacing: '0.2em',
            }}
          >
            {currentWord}
          </Typography>
        ) : (
          <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
            Click letters to form a word...
          </Typography>
        )}
      </CurrentWordDisplay>

      {/* Feedback Message */}
      {feedback && <FeedbackMessage type={feedback.type}>{feedback.message}</FeedbackMessage>}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <GothicButton
          variant="primary"
          onClick={submitWord}
          startIcon={<Send size={18} />}
          disabled={currentWord.length < 3 || isGameOver}
        >
          Submit Word
        </GothicButton>
        <GothicButton
          variant="ghost"
          onClick={clearWord}
          startIcon={<X size={18} />}
          disabled={currentWord.length === 0}
        >
          Clear
        </GothicButton>
      </Box>

      {/* Found Words */}
      <FoundWordsContainer>
        <GothicCard variant="glass">
          <Typography
            sx={{
              color: '#888',
              fontSize: '0.9rem',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Found Words ({foundWords.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {foundWords.length === 0 ? (
              <Typography sx={{ color: '#555', fontStyle: 'italic' }}>
                No words found yet...
              </Typography>
            ) : (
              foundWords.map((word, index) => (
                <Chip
                  key={index}
                  label={`${word.toUpperCase()} (+${getWordScore(word)})`}
                  sx={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    fontFamily: '"Cinzel", serif',
                  }}
                />
              ))
            )}
          </Box>
        </GothicCard>
      </FoundWordsContainer>

      {/* Scoring Guide */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
          3 letters = 100pts | 4 letters = 200pts | 5 letters = 400pts | 6+ letters = 800pts
        </Typography>
      </Box>

      {/* Game Over Overlay */}
      {isGameOver && (
        <VictoryOverlay>
          <VictoryCard variant="elevated" ornate>
            {/* Sparkle effects */}
            <SparkleEffect sx={{ top: '10%', left: '10%', animationDelay: '0s' }} />
            <SparkleEffect sx={{ top: '20%', right: '15%', animationDelay: '0.3s' }} />
            <SparkleEffect sx={{ bottom: '30%', left: '20%', animationDelay: '0.6s' }} />
            <SparkleEffect sx={{ bottom: '15%', right: '10%', animationDelay: '0.9s' }} />

            <TrophyIcon>
              <Trophy size={64} color="#d4af37" />
            </TrophyIcon>

            <Typography
              sx={{
                fontFamily: '"Cinzel", serif',
                fontSize: '2rem',
                color: '#d4af37',
                mb: 2,
                textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
              }}
            >
              Time's Up!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#888', mb: 1 }}>Final Score</Typography>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#e0e0e0',
                  textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                }}
              >
                {score}
              </Typography>
            </Box>

            <Typography sx={{ color: '#888', mb: 1 }}>Words Found</Typography>
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 600, mb: 3 }}>
              {foundWords.length}
            </Typography>

            {score >= highScore && score > 0 && (
              <Typography
                sx={{
                  color: '#d4af37',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                New High Score!
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="primary" onClick={initializeGame} startIcon={<RotateCcw size={18} />}>
                Play Again
              </GothicButton>
              <GothicButton variant="ghost" onClick={onBack} startIcon={<ArrowLeft size={18} />}>
                Back to Hub
              </GothicButton>
            </Box>
          </VictoryCard>
        </VictoryOverlay>
      )}
    </GameContainer>
  );
};

export default WordSpellGame;
