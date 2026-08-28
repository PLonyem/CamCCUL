export const CAMCCUL_CHAPTERS = [
  "Adamawa Chapter",
  "Centre Chapter",
  "East Chapter",
  "Far North Chapter",
  "Littoral Chapter",
  "North Chapter",
  "Northwest Chapter",
  "South Chapter",
  "Southwest Chapter",
  "West Chapter",
] as const;

export type CamcculChapter = (typeof CAMCCUL_CHAPTERS)[number];

export const CHAPTER_TO_REGION: Record<CamcculChapter, string> = {
  "Adamawa Chapter": "ADAMAWA",
  "Centre Chapter": "CENTRE",
  "East Chapter": "EAST",
  "Far North Chapter": "FAR NORTH",
  "Littoral Chapter": "LITTORAL",
  "North Chapter": "NORTH",
  "Northwest Chapter": "NORTHWEST",
  "South Chapter": "SOUTH",
  "Southwest Chapter": "SOUTHWEST",
  "West Chapter": "WEST",
};
