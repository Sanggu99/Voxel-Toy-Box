
import { LandmarkType, LandmarkInfo } from './types';

export interface LandmarkInfoWithFact extends LandmarkInfo {
  fallbackFact: string;
}

export const LANDMARKS: Record<LandmarkType, LandmarkInfoWithFact> = {
  [LandmarkType.EIFFEL_TOWER]: {
    id: LandmarkType.EIFFEL_TOWER,
    name: "Eiffel Tower",
    country: "France 🇫🇷",
    description: "The iconic iron lattice tower of Paris, a global symbol of romance and engineering.",
    primaryColor: "#a39081",
    fallbackFact: "The Eiffel Tower was originally intended to be a temporary installation for the 1889 World's Fair!"
  },
  [LandmarkType.COLOSSEUM]: {
    id: LandmarkType.COLOSSEUM,
    name: "Colosseum",
    country: "Italy 🇮🇹",
    description: "Rome's grand amphitheatre, a testament to ancient Roman architectural prowess.",
    primaryColor: "#d2b48c",
    fallbackFact: "The Colosseum could be flooded to host mock naval battles for the Roman public."
  },
  [LandmarkType.PYRAMIDS]: {
    id: LandmarkType.PYRAMIDS,
    name: "Great Pyramids",
    country: "Egypt 🇪🇬",
    description: "The last remaining wonder of the ancient world, massive stone tombs in the Giza desert.",
    primaryColor: "#e6c384",
    fallbackFact: "The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years."
  },
  [LandmarkType.N_SEOUL_TOWER]: {
    id: LandmarkType.N_SEOUL_TOWER,
    name: "N Seoul Tower",
    country: "South Korea 🇰🇷",
    description: "A landmark communication and observation tower located on Namsan Mountain.",
    primaryColor: "#ffffff",
    fallbackFact: "The tower's digital colors change based on the current air quality in Seoul!"
  },
  [LandmarkType.SUNGNYEMUN]: {
    id: LandmarkType.SUNGNYEMUN,
    name: "Sungnyemun Gate",
    country: "South Korea 🇰🇷",
    description: "Also known as Namdaemun, Korea's No. 1 National Treasure with traditional multi-tiered roofs.",
    primaryColor: "#ae443a",
    fallbackFact: "Sungnyemun literally means 'Gate of Exalted Ceremonies' and was the main gate of old Seoul."
  },
  [LandmarkType.EMPIRE_STATE]: {
    id: LandmarkType.EMPIRE_STATE,
    name: "Empire State",
    country: "USA 🇺🇸",
    description: "A 102-story Art Deco skyscraper in Midtown Manhattan, once the world's tallest building.",
    primaryColor: "#b5a697",
    fallbackFact: "The Empire State Building has its own ZIP code (10118) because it houses so many businesses!"
  },
  [LandmarkType.SAGRADA_FAMILIA]: {
    id: LandmarkType.SAGRADA_FAMILIA,
    name: "Sagrada Família",
    country: "Spain 🇪🇸",
    description: "Gaudí's unfinished masterpiece, featuring organic Gothic and Art Nouveau spires.",
    primaryColor: "#c2b2a3",
    fallbackFact: "Construction of the Sagrada Família has taken longer to build than the Great Pyramids of Egypt."
  },
  [LandmarkType.OPERA_HOUSE]: {
    id: LandmarkType.OPERA_HOUSE,
    name: "Sydney Opera House",
    country: "Australia 🇦🇺",
    description: "A multi-venue performing arts centre known for its iconic white shell-shaped roof sails.",
    primaryColor: "#fcfcfc",
    fallbackFact: "The roof is covered with over 1 million ceramic tiles imported from Sweden."
  }
};
