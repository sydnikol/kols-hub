# Ancestry Service Integration

## Overview

The Ancestry service provides a comprehensive family history and heritage tracking system integrated throughout the KOL Personal OS. This feature transforms ancestry from a static database into a living, interactive part of your daily life.

## Features

### 1. Family Tree Visualization

**Location:** `/ancestry` - Tree View

- **Interactive SVG Tree**: Beautiful, scalable family tree with zoom and pan capabilities
- **Generation Levels**: Clearly marked generations (1 = parents, 2 = grandparents, etc.)
- **Visual Connections**: Lines showing family relationships
- **Click to Explore**: Click any ancestor to view detailed profile
- **Vintage Aesthetic**: Old paper textures, sepia tones, and decorative elements

**Components:**
- `src/components/ancestry/FamilyTreeVisualization.tsx`

### 2. Ancestor Profiles

**Location:** Person Profile Modal

Comprehensive biographical information including:
- Full name, birth/death dates, birthplace
- Occupation and life's work
- Cultural background and heritage
- Personal stories and memories
- Life timeline with major events
- Documents and photos
- Family recipes and traditions
- Languages spoken

**Components:**
- `src/components/ancestry/PersonProfile.tsx`

### 3. AI Ancestor Chat

**Location:** `/ancestry` - Chat Tab

Talk to AI versions of your ancestors:
- Context-aware responses based on ancestor's life, occupation, era, and culture
- Historical Q&A about their lives
- Family stories and wisdom
- Cultural traditions and practices
- Personalized advice from ancestral wisdom
- Integration with ChronoMuse NPC system

**Features:**
- Era-appropriate language and references
- Occupation-based knowledge
- Cultural traditions specific to their background
- Suggested conversation starters
- Real-time typing indicators

**Components:**
- `src/components/ancestry/AncestorChatbot.tsx`

### 4. Heritage & Culture

**Location:** `/ancestry` - Heritage Tab

Explore your cultural roots:
- **Cultural Heritage Breakdown**: Percentage breakdown by region
- **Migration Patterns**: Map of where your ancestors lived
- **Cultural Practices**: Traditions, celebrations, languages
- **Family Recipes**: Traditional dishes with cultural significance
- **Language Connections**: Languages spoken across generations

### 5. Family Health History

**Location:** `/ancestry` - Health Tab

Health insights from family history:
- Genetic health markers
- Longevity patterns
- Common family traits
- Health predispositions
- Average lifespan tracking
- Integration with Health Dashboard

**Integration Points:**
- Links to `/health` dashboard
- Family medical history for preventive care
- Genetic predisposition tracking

### 6. Document Library

**Location:** `/ancestry` - Documents Tab

Store and organize family documents:
- Birth certificates
- Marriage records
- Photos and images
- Letters and correspondence
- Historical documents
- Audio/video recordings

**Document Types:**
- `birth_certificate`
- `marriage_certificate`
- `photo`
- `letter`
- `other`

## Data Structure

### Ancestor Interface

```typescript
interface Ancestor {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  occupation?: string;
  relation: string;
  generation: number;
  stories?: string[];
  personality?: string;
  culturalBackground?: string[];
  photoUrl?: string;
  documents?: AncestorDocument[];
  healthHistory?: HealthRecord[];
  recipes?: FamilyRecipe[];
  languages?: string[];
}
```

## Service API

**Location:** `src/services/ancestryService.ts`

### Core Methods

```typescript
// Add/Update/Delete
await ancestryService.addAncestor(ancestor);
await ancestryService.updateAncestor(id, updates);
await ancestryService.deleteAncestor(id);

// Retrieve
await ancestryService.getAncestors();
await ancestryService.searchAncestor(query);
await ancestryService.getAncestorsByGeneration(gen);

// Import/Export
await ancestryService.importGEDCOM(file);
await ancestryService.exportToJSON();
await ancestryService.importFromJSON(jsonData);

// Integration Methods
await ancestryService.getAncestorsAsNPCs();
await ancestryService.getFamilyHealthHistory();
await ancestryService.getAllFamilyRecipes();
await ancestryService.getMigrationPatterns();
await ancestryService.getCulturalTraditions();
await ancestryService.getStatistics();
```

## Custom Hooks

**Location:** `src/hooks/useAncestryData.ts`

### useAncestryData()

Main hook for accessing ancestry data:

```typescript
const {
  ancestors,           // All ancestors
  loading,            // Loading state
  heritageData,       // Cultural breakdown
  familyHealth,       // Health insights
  refreshData,        // Reload data
  addAncestor,        // Add new ancestor
  removeAncestor,     // Delete ancestor
  updateAncestor      // Update ancestor
} = useAncestryData();
```

### useAncestorWisdom()

Get ancestral wisdom for any context:

```typescript
const { getWisdom, ancestors } = useAncestorWisdom();

// Get wisdom for specific context
const advice = getWisdom('crisis');  // Crisis support
const advice = getWisdom('health');  // Health decisions
const advice = getWisdom('family');  // Family matters
```

### useFamilyHealth()

Integrate family health history:

```typescript
const { healthInsights, linkToHealthDashboard } = useFamilyHealth();
```

## Integration Points

### 1. ChronoMuse Integration

Ancestors can be summoned as NPCs in ChronoMuse:

```typescript
const ancestorNPCs = await ancestryService.getAncestorsAsNPCs();
// Use in ChronoMuse NPC system
```

### 2. Health Dashboard

Family health history integrates with health tracking:

```typescript
const healthHistory = await ancestryService.getFamilyHealthHistory();
// Link to health conditions tracking
```

### 3. Cooking Hub

Family recipes integrate with cooking features:

```typescript
const recipes = await ancestryService.getAllFamilyRecipes();
// Display in cooking hub
```

### 4. Crisis Support

Ancestral wisdom available during crisis:

```typescript
const { getWisdom } = useAncestorWisdom();
const support = getWisdom('crisis');
// Display in crisis support page
```

### 5. Spiritual/Learning

Cultural practices and traditions:

```typescript
const traditions = await ancestryService.getCulturalTraditions();
// Integrate with spirituality and learning hubs
```

## Sample Data

**Location:** `src/data/sampleAncestors.ts`

Load sample ancestry data for demonstration:

```typescript
import { loadSampleAncestors } from './data/sampleAncestors';
import { ancestryService } from './services/ancestryService';

await loadSampleAncestors(ancestryService);
```

Sample includes:
- 3 generations of family
- Multiple cultural backgrounds (Irish, Polish, German, Italian)
- Family stories and traditions
- Traditional recipes
- Migration patterns
- Various occupations and time periods

## GEDCOM Import

Import standard genealogy files:

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const ancestors = await ancestryService.importGEDCOM(file);
```

GEDCOM tags supported:
- `INDI` - Individual records
- `NAME` - Person's name
- `BIRT` - Birth information
- `DEAT` - Death information
- `PLAC` - Places
- `OCCU` - Occupation

## Visual Design

### Color Scheme
- **Primary**: Amber/Gold tones (`#D97706`, `#F59E0B`)
- **Backgrounds**: Dark gradients with vintage texture overlays
- **Borders**: Amber with transparency
- **Text**: Light colors on dark background (sepia aesthetic)

### Typography
- Headers: Bold, amber-toned
- Body: Readable, with good contrast
- Vintage feel throughout

### Textures
- Old paper background patterns
- Sepia photo filters
- Decorative borders and frames
- Antique styling

## Navigation

Access from:
- **Main Menu**: Relationships > Family Heritage
- **Direct URL**: `/ancestry`
- **ChronoMuse**: Summon ancestors as NPCs
- **Health Dashboard**: View family health history

## Future Enhancements

Potential additions:
1. DNA test integration (23andMe, Ancestry.com API if available)
2. Historical context for each time period
3. Family tree printing/export to PDF
4. Collaborative family tree editing
5. Automatic story generation from facts
6. Photo restoration tools
7. Family reunion planning
8. Genealogy research tools
9. Cemetery/burial location mapping
10. Integration with FamilySearch.org

## Technical Notes

- Data stored in localStorage as JSON
- No backend required (offline-first)
- Fully typed with TypeScript
- React + Framer Motion for animations
- SVG-based tree visualization
- Responsive design for all screen sizes

## Getting Started

1. Navigate to `/ancestry`
2. Click "Add Ancestor" to start building your tree
3. Or import a GEDCOM file from another genealogy service
4. Or load sample data to explore features

## Support

For issues or questions:
- Check the component documentation
- Review the service API methods
- Examine sample data structure
- Test with sample ancestors first
