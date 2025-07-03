// src/lib/store-products.ts

export interface StoreProduct {
  id: string;
  titleKey: string; // Key for dictionary lookup
  descriptionKey: string; // Key for dictionary lookup
  image: string; // Placeholder image
  aiHint: string;
  amazonLink: string; // Placeholder affiliate link
}

// NOTE: Remember to replace YOUR_AMAZON_TAG-20 with your actual Amazon Associates tag.
const YOUR_AMAZON_TAG = 'YOUR_AMAZON_TAG-20';

export const products: StoreProduct[] = [
  {
    id: '1',
    titleKey: 'classicTarotDeck',
    descriptionKey: 'classicTarotDeckDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'tarot cards deck classic',
    amazonLink: `https://www.amazon.com/dp/091386613X?tag=${YOUR_AMAZON_TAG}`,
  },
  {
    id: '2',
    titleKey: 'astrologyIntroBook',
    descriptionKey: 'astrologyIntroBookDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'astrology book stars',
    amazonLink: `https://www.amazon.com/dp/1507208445?tag=${YOUR_AMAZON_TAG}`,
  },
  {
    id: '3',
    titleKey: 'healingCrystalsSet',
    descriptionKey: 'healingCrystalsSetDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'crystals collection healing',
    amazonLink: `https://www.amazon.com/dp/B084M22T33?tag=${YOUR_AMAZON_TAG}`,
  },
  {
    id: '4',
    titleKey: 'moonLamp',
    descriptionKey: 'moonLampDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'moon lamp glowing',
    amazonLink: `https://www.amazon.com/dp/B076BNCZ86?tag=${YOUR_AMAZON_TAG}`,
  },
  {
    id: '5',
    titleKey: 'zodiacJournal',
    descriptionKey: 'zodiacJournalDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'journal notebook astrology',
    amazonLink: `https://www.amazon.com/dp/1646041857?tag=${YOUR_AMAZON_TAG}`,
  },
  {
    id: '6',
    titleKey: 'incenseHolder',
    descriptionKey: 'incenseHolderDesc',
    image: 'https://placehold.co/600x600.png',
    aiHint: 'incense holder ceramic',
    amazonLink: `https://www.amazon.com/dp/B09C1G3BZC?tag=${YOUR_AMAZON_TAG}`,
  },
];
