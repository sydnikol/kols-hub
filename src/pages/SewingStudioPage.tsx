import React, { useState } from 'react';
import { Scissors, Download, BookOpen, Package, Heart, Clock, Star, Search, Filter, Plus, Check, Circle, TrendingUp, Grid, List, Shirt, Folder, Archive, AlertCircle, CheckCircle, Sparkles, Zap, Battery, Flag } from 'lucide-react';

interface SewingProject {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  sensoryRating: number;
  fabricTypes: string[];
  supplies: string[];
  progress?: number;
  isFavorite?: boolean;
  hasPattern?: boolean;
}

interface Fabric {
  id: string;
  name: string;
  texture: string;
  sensoryProfile: string;
  breathability: number;
  softness: number;
  recommended: boolean;
}

interface Supply {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
}

export default function SewingStudioPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 200+ Sensory-Safe Sewing Projects
  const sewingProjects: SewingProject[] = [
    // Clothing Projects (50)
    { id: '1', name: 'Tagless Comfort T-Shirt', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2-3 hours', sensoryRating: 5, fabricTypes: ['100% Cotton Jersey', 'Bamboo Knit'], supplies: ['Thread', 'Pattern', 'Scissors'], progress: 0, hasPattern: true },
    { id: '2', name: 'Seamless Waistband Pants', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4-5 hours', sensoryRating: 5, fabricTypes: ['Soft French Terry', 'Modal Blend'], supplies: ['Thread', 'Elastic', 'Pattern'], progress: 30, hasPattern: true },
    { id: '3', name: 'Sensory-Friendly Hoodie', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '5-6 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Organic Cotton'], supplies: ['Thread', 'Zipper', 'Pattern'], isFavorite: true, hasPattern: true },
    { id: '4', name: 'No-Tag Leggings', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Spandex Blend', 'Athletic Knit'], supplies: ['Thread', 'Elastic'], progress: 100, hasPattern: true },
    { id: '5', name: 'Adaptive Button Shirt', category: 'Clothing', difficulty: 'advanced', timeEstimate: '6-8 hours', sensoryRating: 4, fabricTypes: ['Cotton Poplin', 'Linen'], supplies: ['Thread', 'Buttons', 'Interfacing'], hasPattern: true },
    { id: '6', name: 'Weighted Compression Vest', category: 'Clothing', difficulty: 'advanced', timeEstimate: '8-10 hours', sensoryRating: 5, fabricTypes: ['Denim', 'Canvas'], supplies: ['Thread', 'Poly Pellets', 'Pattern'], hasPattern: true },
    { id: '7', name: 'Elastic-Free Underwear', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Organic Cotton', 'Bamboo'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '8', name: 'Soft Seam Sleep Pants', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Modal', 'Pima Cotton'], supplies: ['Thread', 'Elastic'], progress: 50, hasPattern: true },
    { id: '9', name: 'Reversible Sensory Dress', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Cotton Voile', 'Double Gauze'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '10', name: 'Magnetic Closure Jacket', category: 'Clothing', difficulty: 'advanced', timeEstimate: '7 hours', sensoryRating: 4, fabricTypes: ['Fleece', 'Wool Blend'], supplies: ['Thread', 'Magnetic Snaps'], hasPattern: true },
    { id: '11', name: 'Flat-Seam Socks', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Merino Wool', 'Bamboo Blend'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '12', name: 'Adaptive Wrap Skirt', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Rayon', 'Jersey Knit'], supplies: ['Thread', 'Ties'], hasPattern: true },
    { id: '13', name: 'Sensory Compression Shorts', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Spandex', 'Lycra Blend'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '14', name: 'Tag-Free Henley', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Cotton Rib Knit', 'Thermal'], supplies: ['Thread', 'Buttons'], hasPattern: true },
    { id: '15', name: 'Seamless Tube Top', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Stretch Cotton', 'Modal'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '16', name: 'Weighted Lap Blanket Skirt', category: 'Clothing', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Flannel'], supplies: ['Thread', 'Weights', 'Pattern'], hasPattern: true },
    { id: '17', name: 'Soft Band Pajamas', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Flannel', 'Cotton Knit'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '18', name: 'Velcro Closure Vest', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Denim', 'Cotton'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '19', name: 'No-Waist Palazzo Pants', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Rayon', 'Linen Blend'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '20', name: 'Adaptive Kimono Robe', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Silk', 'Satin'], supplies: ['Thread', 'Belt'], hasPattern: true },
    { id: '21', name: 'Seamless Crop Top', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Athletic Knit', 'Spandex'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '22', name: 'Compression Gloves', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Lycra', 'Nylon Blend'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '23', name: 'Flat-Front Joggers', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['French Terry', 'Sweatshirt Fleece'], supplies: ['Thread', 'Drawstring'], hasPattern: true },
    { id: '24', name: 'Sensory Apron', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cotton Duck', 'Canvas'], supplies: ['Thread', 'Straps'], hasPattern: true },
    { id: '25', name: 'Adaptive Cardigan', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Sweater Knit'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '26', name: 'Pull-On Shorts', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '27', name: 'Weighted Blanket Poncho', category: 'Clothing', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights', 'Pattern'], hasPattern: true },
    { id: '28', name: 'Seamless Beanie', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Rib Knit'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '29', name: 'Soft Waist Maxi Skirt', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Rayon', 'Jersey'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '30', name: 'Adaptive Romper', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Snaps'], hasPattern: true },
    { id: '31', name: 'Compression Arm Sleeves', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Spandex', 'Nylon'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '32', name: 'No-Button Tunic', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '33', name: 'Weighted Shoulder Wrap', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '34', name: 'Elastic-Free Bralette', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Organic Cotton', 'Bamboo'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '35', name: 'Sensory Bandana', category: 'Clothing', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 5, fabricTypes: ['Cotton', 'Silk'], supplies: ['Thread', 'Scissors'], hasPattern: true },
    { id: '36', name: 'Adaptive Cape', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Wool'], supplies: ['Thread', 'Fasteners'], hasPattern: true },
    { id: '37', name: 'Flat-Seam Tights', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Nylon Blend', 'Lycra'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '38', name: 'Pull-On Jumpsuit', category: 'Clothing', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Jersey'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '39', name: 'Sensory Pocket Belt', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Cotton', 'Canvas'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '40', name: 'Adaptive Sleep Sack', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Flannel', 'Fleece'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '41', name: 'Seamless Tank Top', category: 'Clothing', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Modal'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '42', name: 'Weighted Neck Pillow Scarf', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '43', name: 'No-Scratch Mittens', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Fleece', 'Cotton'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '44', name: 'Adaptive Overalls', category: 'Clothing', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 4, fabricTypes: ['Denim', 'Cotton Duck'], supplies: ['Thread', 'Buckles'], hasPattern: true },
    { id: '45', name: 'Soft Band Sweatshirt', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['French Terry', 'Fleece'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '46', name: 'Pull-On Capris', category: 'Clothing', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '47', name: 'Sensory Wrist Weights', category: 'Clothing', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Neoprene', 'Nylon'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '48', name: 'Adaptive Swim Wrap', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Swimsuit Fabric', 'Lycra'], supplies: ['Thread', 'Ties'], hasPattern: true },
    { id: '49', name: 'Seamless Headband', category: 'Clothing', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Spandex'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '50', name: 'Weighted Lap Pad', category: 'Clothing', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },

    // Home & Comfort (50)
    { id: '51', name: 'Weighted Lap Blanket', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '6-8 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Poly Pellets', 'Pattern'], isFavorite: true, hasPattern: true },
    { id: '52', name: 'Sensory Pillowcase Set', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Satin', 'Silk'], supplies: ['Thread', 'Scissors'], hasPattern: true },
    { id: '53', name: 'Textured Throw Blanket', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Flannel'], supplies: ['Thread', 'Pattern'], progress: 20, hasPattern: true },
    { id: '54', name: 'Body Pillow Cover', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Velour'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '55', name: 'Fidget Pocket Quilt', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '12 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Various Textures'], supplies: ['Thread', 'Batting', 'Notions'], hasPattern: true },
    { id: '56', name: 'Weighted Sleep Mask', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Silk', 'Satin'], supplies: ['Thread', 'Elastic', 'Weights'], hasPattern: true },
    { id: '57', name: 'Sensory Bean Bag Chair Cover', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Corduroy'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '58', name: 'Compression Bedding Set', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Stretch Cotton', 'Jersey'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '59', name: 'Textured Floor Cushion', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Velvet', 'Corduroy'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '60', name: 'Weighted Neck Pillow', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '61', name: 'Sensory Curtains', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 4, fabricTypes: ['Blackout Fabric', 'Cotton'], supplies: ['Thread', 'Grommets'], hasPattern: true },
    { id: '62', name: 'Fidget Blanket', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Various'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '63', name: 'Weighted Stuffed Animal', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '64', name: 'Reading Pillow with Arms', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 4, fabricTypes: ['Fleece', 'Cotton'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '65', name: 'Sensory Seat Cushion', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Corduroy', 'Velvet'], supplies: ['Thread', 'Foam'], hasPattern: true },
    { id: '66', name: 'Weighted Table Runner', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '67', name: 'Textured Bath Mat', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Terry Cloth', 'Cotton'], supplies: ['Thread', 'Non-slip'], hasPattern: true },
    { id: '68', name: 'Sensory Wall Hanging', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Various Textures'], supplies: ['Thread', 'Backing'], hasPattern: true },
    { id: '69', name: 'Weighted Eye Pillow', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Silk', 'Cotton'], supplies: ['Thread', 'Flax Seeds'], hasPattern: true },
    { id: '70', name: 'Compression Body Pillow', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Stretch Velour', 'Jersey'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '71', name: 'Sensory Canopy', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Tulle', 'Chiffon'], supplies: ['Thread', 'Hoop'], hasPattern: true },
    { id: '72', name: 'Weighted Throw Pillows', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Velvet', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '73', name: 'Textured Table Cloth', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Linen', 'Cotton'], supplies: ['Thread', 'Scissors'], hasPattern: true },
    { id: '74', name: 'Sensory Door Snake', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Fleece', 'Cotton'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '75', name: 'Weighted Pet Bed', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '76', name: 'Compression Mattress Topper Cover', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Stretch Cotton'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '77', name: 'Sensory Rug', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '10 hours', sensoryRating: 5, fabricTypes: ['Various Textures'], supplies: ['Thread', 'Backing'], hasPattern: true },
    { id: '78', name: 'Weighted Heating Pad Cover', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Flannel', 'Minky'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '79', name: 'Textured Meditation Cushion', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Velvet', 'Canvas'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '80', name: 'Sensory Ottoman Cover', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Corduroy', 'Velvet'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '81', name: 'Weighted Shoulder Pillow', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '82', name: 'Compression Duvet Cover', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '7 hours', sensoryRating: 5, fabricTypes: ['Stretch Cotton'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '83', name: 'Sensory Bookshelf Curtain', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cotton', 'Linen'], supplies: ['Thread', 'Rod'], hasPattern: true },
    { id: '84', name: 'Weighted Armchair Pad', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '85', name: 'Textured Couch Throw', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Sherpa'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '86', name: 'Sensory Closet Organizer', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Grommets'], hasPattern: true },
    { id: '87', name: 'Weighted Crib Bumper', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Minky'], supplies: ['Thread', 'Weights', 'Ties'], hasPattern: true },
    { id: '88', name: 'Compression Sleeping Bag', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Stretch Cotton'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '89', name: 'Sensory Footstool Cover', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Velvet', 'Corduroy'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '90', name: 'Weighted Knee Pillow', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '91', name: 'Textured Window Seat Cushion', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Velvet', 'Canvas'], supplies: ['Thread', 'Foam'], hasPattern: true },
    { id: '92', name: 'Sensory Storage Basket', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Interfacing'], hasPattern: true },
    { id: '93', name: 'Weighted Desk Pad', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Felt', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '94', name: 'Compression Hammock', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Stretch Canvas'], supplies: ['Thread', 'Rope'], hasPattern: true },
    { id: '95', name: 'Sensory Plant Hanger', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 3, fabricTypes: ['Cotton', 'Macrame Cord'], supplies: ['Scissors', 'Ring'], hasPattern: true },
    { id: '96', name: 'Weighted Car Seat Cover', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '97', name: 'Textured Yoga Mat Bag', category: 'Home & Comfort', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Drawstring'], hasPattern: true },
    { id: '98', name: 'Sensory Wall Pocket Organizer', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Felt', 'Canvas'], supplies: ['Thread', 'Backing'], hasPattern: true },
    { id: '99', name: 'Weighted Travel Blanket', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '100', name: 'Compression Floor Pouf', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Stretch Velvet'], supplies: ['Thread', 'Stuffing'], hasPattern: true },

    // Accessories (50)
    { id: '101', name: 'Weighted Keychain', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Leather'], supplies: ['Thread', 'Keyring', 'Weights'], hasPattern: true },
    { id: '102', name: 'Fidget Wristband', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 5, fabricTypes: ['Elastic', 'Various'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '103', name: 'Sensory Tote Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Straps'], hasPattern: true },
    { id: '104', name: 'Weighted Hair Scrunchie', category: 'Accessories', difficulty: 'beginner', timeEstimate: '20 min', sensoryRating: 4, fabricTypes: ['Satin', 'Silk'], supplies: ['Thread', 'Elastic', 'Weights'], hasPattern: true },
    { id: '105', name: 'Textured Wallet', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cork', 'Leather'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '106', name: 'Sensory Backpack', category: 'Accessories', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Nylon'], supplies: ['Thread', 'Zippers', 'Straps'], hasPattern: true },
    { id: '107', name: 'Weighted Bookmark', category: 'Accessories', difficulty: 'beginner', timeEstimate: '20 min', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '108', name: 'Fidget Zipper Pouch', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Cotton', 'Canvas'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '109', name: 'Sensory Lanyard', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Cotton', 'Ribbon'], supplies: ['Thread', 'Clip'], hasPattern: true },
    { id: '110', name: 'Weighted Coin Purse', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Cotton'], supplies: ['Thread', 'Snap', 'Weights'], hasPattern: true },
    { id: '111', name: 'Textured Phone Case', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '112', name: 'Sensory Crossbody Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Corduroy'], supplies: ['Thread', 'Zipper', 'Strap'], hasPattern: true },
    { id: '113', name: 'Weighted Belt', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Webbing'], supplies: ['Thread', 'Buckle', 'Weights'], hasPattern: true },
    { id: '114', name: 'Fidget Earring Holder', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 3, fabricTypes: ['Felt', 'Canvas'], supplies: ['Thread', 'Frame'], hasPattern: true },
    { id: '115', name: 'Sensory Clutch', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Velvet', 'Satin'], supplies: ['Thread', 'Magnetic Snap'], hasPattern: true },
    { id: '116', name: 'Weighted Ankle Strap', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Neoprene', 'Velcro'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '117', name: 'Textured Messenger Bag', category: 'Accessories', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Leather'], supplies: ['Thread', 'Hardware'], hasPattern: true },
    { id: '118', name: 'Sensory Badge Holder', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Clip'], hasPattern: true },
    { id: '119', name: 'Weighted Watch Band', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Elastic', 'Nylon'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '120', name: 'Fidget Laptop Sleeve', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Neoprene'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '121', name: 'Sensory Fanny Pack', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Nylon', 'Canvas'], supplies: ['Thread', 'Zipper', 'Buckle'], hasPattern: true },
    { id: '122', name: 'Weighted Headband', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 5, fabricTypes: ['Jersey', 'Elastic'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '123', name: 'Textured Pencil Case', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '124', name: 'Sensory Drawstring Bag', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Cotton', 'Canvas'], supplies: ['Thread', 'Cord'], hasPattern: true },
    { id: '125', name: 'Weighted Shoulder Strap', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Webbing', 'Neoprene'], supplies: ['Thread', 'Weights', 'Clips'], hasPattern: true },
    { id: '126', name: 'Fidget Book Cover', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Cotton', 'Felt'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '127', name: 'Sensory Gym Bag', category: 'Accessories', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Nylon', 'Canvas'], supplies: ['Thread', 'Zippers', 'Straps'], hasPattern: true },
    { id: '128', name: 'Weighted Hair Tie', category: 'Accessories', difficulty: 'beginner', timeEstimate: '15 min', sensoryRating: 4, fabricTypes: ['Elastic', 'Fabric'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '129', name: 'Textured Sunglasses Case', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '130', name: 'Sensory Lunch Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Insulated Fabric', 'Canvas'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '131', name: 'Weighted Grip Strengthener', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '132', name: 'Fidget Mask Holder', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Cotton', 'Elastic'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '133', name: 'Sensory Water Bottle Carrier', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Neoprene', 'Canvas'], supplies: ['Thread', 'Strap'], hasPattern: true },
    { id: '134', name: 'Weighted Camera Strap', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Webbing', 'Neoprene'], supplies: ['Thread', 'Weights', 'Clips'], hasPattern: true },
    { id: '135', name: 'Textured Passport Holder', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '136', name: 'Sensory Toiletry Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Waterproof Fabric', 'Nylon'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '137', name: 'Weighted Guitar Strap', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Leather', 'Webbing'], supplies: ['Thread', 'Weights', 'Clips'], hasPattern: true },
    { id: '138', name: 'Fidget Tablet Case', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Canvas'], supplies: ['Thread', 'Elastic', 'Notions'], hasPattern: true },
    { id: '139', name: 'Sensory Diaper Bag', category: 'Accessories', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Nylon'], supplies: ['Thread', 'Zippers', 'Straps'], hasPattern: true },
    { id: '140', name: 'Weighted Wrist Rest', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '141', name: 'Textured Grocery Bag', category: 'Accessories', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Handles'], hasPattern: true },
    { id: '142', name: 'Sensory Beach Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Mesh'], supplies: ['Thread', 'Straps'], hasPattern: true },
    { id: '143', name: 'Weighted Foot Rest', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Corduroy'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '144', name: 'Fidget Cord Organizer', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Elastic'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '145', name: 'Sensory Yoga Mat Strap', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Webbing', 'Canvas'], supplies: ['Thread', 'Buckle'], hasPattern: true },
    { id: '146', name: 'Weighted Neck Gaiter', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Fleece', 'Jersey'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '147', name: 'Textured Cooler Bag', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Insulated Fabric', 'Canvas'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '148', name: 'Sensory Picnic Blanket', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Waterproof'], supplies: ['Thread', 'Handles'], hasPattern: true },
    { id: '149', name: 'Weighted Stress Ball Cover', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 5, fabricTypes: ['Stretch Fabric'], supplies: ['Thread', 'Ball'], hasPattern: true },
    { id: '150', name: 'Fidget Key Holder', category: 'Accessories', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Leather'], supplies: ['Thread', 'Snap', 'Notions'], hasPattern: true },

    // Kids & Play (30)
    { id: '151', name: 'Sensory Play Mat', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Various Textures'], supplies: ['Thread', 'Batting', 'Backing'], hasPattern: true },
    { id: '152', name: 'Weighted Stuffed Dragon', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing', 'Safety Eyes'], hasPattern: true },
    { id: '153', name: 'Fidget Quiet Book', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '12 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Various'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '154', name: 'Sensory Teepee', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '10 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Dowels'], hasPattern: true },
    { id: '155', name: 'Weighted Puppet', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Felt'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '156', name: 'Textured Ball Pit Balls Bag', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Mesh', 'Canvas'], supplies: ['Thread', 'Drawstring'], hasPattern: true },
    { id: '157', name: 'Sensory Dress-Up Cape', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Satin', 'Fleece'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '158', name: 'Weighted Baby Blanket', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '159', name: 'Fidget Activity Cube', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '10 hours', sensoryRating: 5, fabricTypes: ['Various'], supplies: ['Thread', 'Notions', 'Stuffing'], hasPattern: true },
    { id: '160', name: 'Sensory Tunnel', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Nylon', 'Mesh'], supplies: ['Thread', 'Wire Frame'], hasPattern: true },
    { id: '161', name: 'Weighted Doll', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Felt'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '162', name: 'Textured Toy Storage', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Handles'], hasPattern: true },
    { id: '163', name: 'Sensory Swing Seat', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Nylon'], supplies: ['Thread', 'Rope', 'Hardware'], hasPattern: true },
    { id: '164', name: 'Weighted Dinosaur', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Felt'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '165', name: 'Fidget Sensory Board', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Various'], supplies: ['Thread', 'Notions', 'Backing'], hasPattern: true },
    { id: '166', name: 'Textured Playhouse Curtains', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Cotton', 'Canvas'], supplies: ['Thread', 'Ties'], hasPattern: true },
    { id: '167', name: 'Sensory Changing Pad Cover', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '168', name: 'Weighted Unicorn', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '10 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing', 'Horn'], hasPattern: true },
    { id: '169', name: 'Fidget Busy Board', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Various'], supplies: ['Thread', 'Notions', 'Board'], hasPattern: true },
    { id: '170', name: 'Sensory Crib Skirt', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cotton', 'Tulle'], supplies: ['Thread', 'Velcro'], hasPattern: true },
    { id: '171', name: 'Weighted Octopus', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '172', name: 'Textured Activity Mat', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Various Textures'], supplies: ['Thread', 'Batting', 'Notions'], hasPattern: true },
    { id: '173', name: 'Sensory Highchair Cover', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Waterproof', 'Cotton'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '174', name: 'Weighted Bear', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '6 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing', 'Eyes'], hasPattern: true },
    { id: '175', name: 'Fidget Ribbon Tag Blanket', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Ribbons'], supplies: ['Thread', 'Various Ribbons'], hasPattern: true },
    { id: '176', name: 'Sensory Car Seat Cover', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '177', name: 'Weighted Elephant', category: 'Kids & Play', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '178', name: 'Textured Play Tunnel', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Nylon', 'Crinkle Material'], supplies: ['Thread', 'Wire'], hasPattern: true },
    { id: '179', name: 'Sensory Nursing Pillow Cover', category: 'Kids & Play', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Cotton'], supplies: ['Thread', 'Zipper'], hasPattern: true },
    { id: '180', name: 'Weighted Cat', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },

    // Craft & Creative (20)
    { id: '181', name: 'Sensory Embroidery Hoop Art', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Cotton', 'Felt'], supplies: ['Thread', 'Hoop', 'Embroidery Floss'], hasPattern: true },
    { id: '182', name: 'Weighted Pin Cushion', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '183', name: 'Textured Scissors Case', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Canvas'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '184', name: 'Sensory Thread Organizer', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Clear Vinyl'], supplies: ['Thread', 'Grommets'], hasPattern: true },
    { id: '185', name: 'Weighted Needle Book', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Wool'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '186', name: 'Fidget Sewing Kit Pouch', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Zipper', 'Notions'], hasPattern: true },
    { id: '187', name: 'Sensory Fabric Scrap Basket', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Interfacing'], hasPattern: true },
    { id: '188', name: 'Weighted Chalk Bag', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Canvas', 'Fleece'], supplies: ['Thread', 'Drawstring'], hasPattern: true },
    { id: '189', name: 'Textured Project Bag', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Corduroy'], supplies: ['Thread', 'Drawstring', 'Pockets'], hasPattern: true },
    { id: '190', name: 'Sensory Zipper Pouch Set', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Cotton', 'Canvas'], supplies: ['Thread', 'Zippers'], hasPattern: true },
    { id: '191', name: 'Weighted Marker Roll', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Felt'], supplies: ['Thread', 'Ties'], hasPattern: true },
    { id: '192', name: 'Fidget Crochet Hook Case', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Cotton'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '193', name: 'Sensory Craft Apron', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Cotton'], supplies: ['Thread', 'Pockets', 'Ties'], hasPattern: true },
    { id: '194', name: 'Weighted Wrist Pin Cushion', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Elastic'], supplies: ['Thread', 'Stuffing'], hasPattern: true },
    { id: '195', name: 'Textured Knitting Needle Case', category: 'Craft & Creative', difficulty: 'intermediate', timeEstimate: '2 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Felt'], supplies: ['Thread', 'Ties'], hasPattern: true },
    { id: '196', name: 'Sensory Button Jar Cover', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 3, fabricTypes: ['Cotton', 'Fabric Scraps'], supplies: ['Thread', 'Elastic'], hasPattern: true },
    { id: '197', name: 'Weighted Pattern Weights', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '198', name: 'Fidget Seam Ripper Holder', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Elastic'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '199', name: 'Sensory Bobbin Organizer', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 4, fabricTypes: ['Felt', 'Clear Vinyl'], supplies: ['Thread', 'Snap'], hasPattern: true },
    { id: '200', name: 'Weighted Measuring Tape Cover', category: 'Craft & Creative', difficulty: 'beginner', timeEstimate: '30 min', sensoryRating: 4, fabricTypes: ['Felt', 'Fabric'], supplies: ['Thread', 'Snap'], hasPattern: true },

    // Bonus Projects (10)
    { id: '201', name: 'Compression Body Sock', category: 'Clothing', difficulty: 'advanced', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Lycra', 'Spandex'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '202', name: 'Weighted Snake Pillow', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '203', name: 'Sensory Infinity Scarf', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Jersey Knit', 'Fleece'], supplies: ['Thread', 'Pattern'], hasPattern: true },
    { id: '204', name: 'Weighted Lap Cat', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Minky', 'Fleece'], supplies: ['Thread', 'Weights', 'Stuffing'], hasPattern: true },
    { id: '205', name: 'Fidget Cube Pouch', category: 'Accessories', difficulty: 'beginner', timeEstimate: '1 hour', sensoryRating: 5, fabricTypes: ['Felt', 'Various'], supplies: ['Thread', 'Notions'], hasPattern: true },
    { id: '206', name: 'Sensory Hammock Chair', category: 'Home & Comfort', difficulty: 'advanced', timeEstimate: '8 hours', sensoryRating: 5, fabricTypes: ['Canvas', 'Nylon'], supplies: ['Thread', 'Rope', 'Hardware'], hasPattern: true },
    { id: '207', name: 'Weighted Mermaid Tail Blanket', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '5 hours', sensoryRating: 5, fabricTypes: ['Fleece', 'Minky'], supplies: ['Thread', 'Weights'], hasPattern: true },
    { id: '208', name: 'Compression Sensory Sack', category: 'Kids & Play', difficulty: 'intermediate', timeEstimate: '3 hours', sensoryRating: 5, fabricTypes: ['Lycra', 'Spandex'], supplies: ['Thread', 'Drawstring'], hasPattern: true },
    { id: '209', name: 'Textured Door Hanging Organizer', category: 'Home & Comfort', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 4, fabricTypes: ['Canvas', 'Clear Vinyl'], supplies: ['Thread', 'Grommets'], hasPattern: true },
    { id: '210', name: 'Weighted Anxiety Relief Kit', category: 'Accessories', difficulty: 'intermediate', timeEstimate: '4 hours', sensoryRating: 5, fabricTypes: ['Felt', 'Minky', 'Various'], supplies: ['Thread', 'Weights', 'Notions'], hasPattern: true }
  ];

  // Fabric recommendations for sensitive skin
  const fabricRecommendations: Fabric[] = [
    { id: '1', name: '100% Organic Cotton', texture: 'Soft, natural, breathable', sensoryProfile: 'Neutral, minimal sensory input', breathability: 5, softness: 4, recommended: true },
    { id: '2', name: 'Bamboo Knit', texture: 'Silky, smooth, cooling', sensoryProfile: 'Cooling, gentle on skin', breathability: 5, softness: 5, recommended: true },
    { id: '3', name: 'Pima Cotton', texture: 'Extra soft, durable', sensoryProfile: 'Luxurious, non-irritating', breathability: 5, softness: 5, recommended: true },
    { id: '4', name: 'Modal Blend', texture: 'Silky, lightweight', sensoryProfile: 'Smooth, barely-there feel', breathability: 4, softness: 5, recommended: true },
    { id: '5', name: 'Merino Wool', texture: 'Soft, temperature regulating', sensoryProfile: 'Natural, non-itchy', breathability: 4, softness: 4, recommended: true },
    { id: '6', name: 'Silk Charmeuse', texture: 'Luxurious, smooth', sensoryProfile: 'Sensory soothing, cool', breathability: 3, softness: 5, recommended: true },
    { id: '7', name: 'French Terry', texture: 'Soft loops, stretchy', sensoryProfile: 'Gentle texture, comforting', breathability: 4, softness: 4, recommended: true },
    { id: '8', name: 'Minky Plush', texture: 'Ultra-soft, plush', sensoryProfile: 'Deep pressure input', breathability: 3, softness: 5, recommended: true },
    { id: '9', name: 'Cotton Jersey', texture: 'Stretchy, soft', sensoryProfile: 'Comfortable, flexible', breathability: 5, softness: 4, recommended: true },
    { id: '10', name: 'Linen', texture: 'Natural, textured', sensoryProfile: 'Cooling, relaxed feel', breathability: 5, softness: 3, recommended: false },
    { id: '11', name: 'Tencel/Lyocell', texture: 'Silky, eco-friendly', sensoryProfile: 'Smooth, moisture-wicking', breathability: 5, softness: 5, recommended: true },
    { id: '12', name: 'Double Gauze', texture: 'Light, airy, soft', sensoryProfile: 'Gentle, breathable', breathability: 5, softness: 4, recommended: true }
  ];

  // Supply inventory
  const [supplies, setSupplies] = useState<Supply[]>([
    { id: '1', name: 'All-Purpose Thread (White)', category: 'Thread', quantity: 5, minStock: 3, unit: 'spools' },
    { id: '2', name: 'All-Purpose Thread (Black)', category: 'Thread', quantity: 4, minStock: 3, unit: 'spools' },
    { id: '3', name: 'Poly Pellets', category: 'Weights', quantity: 2, minStock: 1, unit: 'lbs' },
    { id: '4', name: 'Bamboo Knit Fabric', category: 'Fabric', quantity: 3, minStock: 2, unit: 'yards' },
    { id: '5', name: 'Minky Fabric', category: 'Fabric', quantity: 4, minStock: 2, unit: 'yards' },
    { id: '6', name: 'Invisible Zipper', category: 'Notions', quantity: 8, minStock: 5, unit: 'pieces' },
    { id: '7', name: 'Soft Elastic (1 inch)', category: 'Notions', quantity: 10, minStock: 5, unit: 'yards' },
    { id: '8', name: 'Glass Bead Weights', category: 'Weights', quantity: 1, minStock: 1, unit: 'lbs' },
    { id: '9', name: 'Organic Cotton', category: 'Fabric', quantity: 6, minStock: 3, unit: 'yards' },
    { id: '10', name: 'Fleece', category: 'Fabric', quantity: 5, minStock: 2, unit: 'yards' },
    { id: '11', name: 'Velcro Tape', category: 'Notions', quantity: 3, minStock: 2, unit: 'yards' },
    { id: '12', name: 'Safety Eyes (12mm)', category: 'Notions', quantity: 20, minStock: 10, unit: 'pairs' },
    { id: '13', name: 'Magnetic Snaps', category: 'Notions', quantity: 12, minStock: 8, unit: 'sets' },
    { id: '14', name: 'Polyfill Stuffing', category: 'Stuffing', quantity: 2, minStock: 1, unit: 'bags' },
    { id: '15', name: 'Cotton Batting', category: 'Stuffing', quantity: 1, minStock: 1, unit: 'rolls' }
  ]);

  // Filter projects
  const filteredProjects = sewingProjects.filter(project => {
    const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       project.category.toLowerCase().includes(searchQuery.toLowerCase());
    const favoriteMatch = !showFavoritesOnly || project.isFavorite;
    return categoryMatch && difficultyMatch && searchMatch && favoriteMatch;
  });

  const categories = ['all', 'Clothing', 'Home & Comfort', 'Accessories', 'Kids & Play', 'Craft & Creative'];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'from-gray-500 to-gray-600';
    if (progress === 100) return 'from-green-500 to-emerald-500';
    return 'from-emerald-500 to-teal-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-4">
          Sewing Studio
        </h1>
        <p className="text-indigo-300 text-lg">200+ sensory-safe sewing projects with fabric recommendations and progress tracking</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Scissors className="text-emerald-400" size={24} />
            <span className="text-2xl font-bold text-white">{sewingProjects.length}</span>
          </div>
          <p className="text-indigo-300">Total Projects</p>
        </div>
        <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-emerald-400" size={24} />
            <span className="text-2xl font-bold text-white">{sewingProjects.filter(p => p.progress && p.progress > 0).length}</span>
          </div>
          <p className="text-indigo-300">In Progress</p>
        </div>
        <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-emerald-400" size={24} />
            <span className="text-2xl font-bold text-white">{sewingProjects.filter(p => p.progress === 100).length}</span>
          </div>
          <p className="text-indigo-300">Completed</p>
        </div>
        <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Heart className="text-emerald-400" size={24} />
            <span className="text-2xl font-bold text-white">{sewingProjects.filter(p => p.isFavorite).length}</span>
          </div>
          <p className="text-indigo-300">Favorites</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['projects', 'fabrics', 'patterns', 'inventory', 'progress'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* View Mode & Favorites */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  showFavoritesOnly
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'
                }`}
              >
                <Heart className="inline mr-2" size={16} />
                Favorites
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white hover:bg-indigo-800/50 transition-all"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-indigo-300">
            Showing {filteredProjects.length} of {sewingProjects.length} projects
          </div>

          {/* Projects Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-300">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    {project.isFavorite ? <Heart className="fill-emerald-400" size={20} /> : <Heart size={20} />}
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-indigo-300 text-sm">
                    <Clock size={14} />
                    <span>{project.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-300 text-sm">
                    <Star className="fill-emerald-400 text-emerald-400" size={14} />
                    <span>Sensory Rating: {project.sensoryRating}/5</span>
                  </div>
                  {project.hasPattern && (
                    <div className="flex items-center space-x-2 text-emerald-400 text-sm">
                      <Download size={14} />
                      <span>Pattern available</span>
                    </div>
                  )}
                </div>

                {/* Fabrics */}
                <div className="mb-4">
                  <p className="text-xs text-indigo-400 mb-2">Recommended Fabrics:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.fabricTypes.slice(0, 2).map((fabric, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                        {fabric}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-indigo-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getProgressColor(project.progress)} h-2 rounded-full transition-all`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                    {project.progress === 100 ? 'View Details' : project.progress ? 'Continue' : 'Start Project'}
                  </button>
                  {project.hasPattern && (
                    <button className="bg-indigo-700/50 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fabrics Tab */}
      {activeTab === 'fabrics' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Sensory-Safe Fabric Guide</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Add Custom Fabric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fabricRecommendations.map(fabric => (
              <div key={fabric.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{fabric.name}</h3>
                  {fabric.recommended && (
                    <Sparkles className="text-emerald-400" size={20} />
                  )}
                </div>

                <p className="text-indigo-300 text-sm mb-4">{fabric.texture}</p>

                <div className="space-y-3 mb-4">
                  {/* Breathability */}
                  <div>
                    <div className="flex justify-between text-xs text-indigo-400 mb-1">
                      <span>Breathability</span>
                      <span>{fabric.breathability}/5</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${fabric.breathability * 20}%` }}
                      />
                    </div>
                  </div>

                  {/* Softness */}
                  <div>
                    <div className="flex justify-between text-xs text-indigo-400 mb-1">
                      <span>Softness</span>
                      <span>{fabric.softness}/5</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                        style={{ width: `${fabric.softness * 20}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 mb-4">
                  <p className="text-emerald-300 text-sm">{fabric.sensoryProfile}</p>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                  View Compatible Projects
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Pattern Library</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Upload Pattern</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.filter(c => c !== 'all').map((category, idx) => (
              <div key={idx} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all cursor-pointer">
                <BookOpen className="text-emerald-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">{category}</h3>
                <p className="text-indigo-300 mb-4">
                  {sewingProjects.filter(p => p.category === category && p.hasPattern).length} patterns
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Download size={16} />
                  <span>Browse</span>
                </button>
              </div>
            ))}
          </div>

          {/* Popular Patterns */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Popular Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sewingProjects.filter(p => p.hasPattern).slice(0, 6).map(project => (
                <div key={project.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all">
                  <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                    <span className="text-indigo-300 text-sm">{project.timeEstimate}</span>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Download size={16} />
                    <span>Download Pattern</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Supply Inventory</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Add Supply</span>
            </button>
          </div>

          {/* Low Stock Alert */}
          {supplies.filter(s => s.quantity <= s.minStock).length > 0 && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="text-yellow-400" size={24} />
                <h3 className="text-xl font-bold text-white">Low Stock Alert</h3>
              </div>
              <p className="text-yellow-300">
                {supplies.filter(s => s.quantity <= s.minStock).length} items need restocking
              </p>
            </div>
          )}

          {/* Inventory by Category */}
          {['Thread', 'Fabric', 'Notions', 'Weights', 'Stuffing'].map(category => {
            const categorySupplies = supplies.filter(s => s.category === category);
            if (categorySupplies.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Package className="text-emerald-400" size={24} />
                  <span>{category}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySupplies.map(supply => (
                    <div key={supply.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-2">{supply.name}</h4>
                          <div className="flex items-center space-x-2">
                            {supply.quantity <= supply.minStock ? (
                              <AlertCircle className="text-yellow-400" size={16} />
                            ) : (
                              <CheckCircle className="text-green-400" size={16} />
                            )}
                            <span className={supply.quantity <= supply.minStock ? 'text-yellow-400' : 'text-green-400'}>
                              {supply.quantity} {supply.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-indigo-300">
                          <span>Min Stock:</span>
                          <span>{supply.minStock} {supply.unit}</span>
                        </div>
                        <div className="w-full bg-indigo-900/60 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              supply.quantity <= supply.minStock
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{ width: `${Math.min((supply.quantity / (supply.minStock * 2)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Update
                        </button>
                        <button className="bg-indigo-700/50 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Project Progress Tracker</h2>

          {/* In Progress */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Zap className="text-emerald-400" size={24} />
              <span>In Progress</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sewingProjects.filter(p => p.progress && p.progress > 0 && p.progress < 100).map(project => (
                <div key={project.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-indigo-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Continue Working
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <CheckCircle className="text-emerald-400" size={24} />
              <span>Completed Projects</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sewingProjects.filter(p => p.progress === 100).map(project => (
                <div key={project.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">{project.name}</h4>
                    <CheckCircle className="text-green-400" size={24} />
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full border border-green-500/30 bg-green-500/20 text-green-300">
                      COMPLETED
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      View Details
                    </button>
                    <button className="bg-indigo-700/50 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Started */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Flag className="text-emerald-400" size={24} />
              <span>Ready to Start</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sewingProjects.filter(p => !p.progress || p.progress === 0).slice(0, 6).map(project => (
                <div key={project.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                    <Clock className="text-indigo-400" size={14} />
                    <span className="text-indigo-300 text-sm">{project.timeEstimate}</span>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Start Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
