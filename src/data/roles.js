export const ROLES = {
  water: { id: 'water', name: 'Water Keeper', icon: '💧', theme: 'theme-water' },
  sun: { id: 'sun', name: 'Sun Guide', icon: '☀️', theme: 'theme-sun' },
  seed: { id: 'seed', name: 'Seed Planter', icon: '🌱', theme: 'theme-seed' },
  animal: { id: 'animal', name: 'Animal Whisperer', icon: '🐾', theme: 'theme-animal' },
};

export const ACTIONS = {
  water: [
    { id: 'water_full', icon: '🚿', title: 'Full Water', sub: 'Deep soak for thirsty plants', effect: 'water_full' },
    { id: 'water_mist', icon: '💨', title: 'Gentle Mist', sub: 'Light spray for delicate leaves', effect: 'water_mist' },
    { id: 'water_drain', icon: '🔽', title: 'Drain Water', sub: 'Remove excess water from soil', effect: 'water_drain' },
  ],
  sun: [
    { id: 'sun_open', icon: '☀️', title: 'Open Blinds', sub: 'Let full sunlight in', effect: 'sun_open' },
    { id: 'sun_shade', icon: '⛱️', title: 'Add Shade', sub: 'Shield plants from harsh light', effect: 'sun_shade' },
    { id: 'sun_lamp', icon: '💡', title: 'Grow Lamp', sub: 'Artificial light for dark days', effect: 'sun_lamp' },
  ],
  seed: [
    { id: 'seed_plant', icon: '🌱', title: 'Plant Seed', sub: 'Place a new seed in the soil', effect: 'seed_plant' },
    { id: 'seed_fertilise', icon: '🧪', title: 'Fertilise', sub: 'Add nutrients to the soil', effect: 'seed_fertilise' },
    { id: 'seed_prune', icon: '✂️', title: 'Prune', sub: 'Trim overgrown branches', effect: 'seed_prune' },
  ],
  animal: [
    { id: 'animal_shoo', icon: '👋', title: 'Shoo Away', sub: 'Gently scare pests away', effect: 'animal_shoo' },
    { id: 'animal_trap', icon: '🪤', title: 'Set Trap', sub: 'Humane trap for critters', effect: 'animal_trap' },
    { id: 'animal_feed', icon: '🥕', title: 'Feed Animal', sub: 'Distract with tasty treats', effect: 'animal_feed' },
  ],
};
