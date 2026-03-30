const PROBLEM_SETS = [
  {
    problem: '\u{1F940} The roses are wilting badly!',
    solution: 'water_full',
    clues: {
      water: 'The soil feels bone dry and cracked.',
      sun: 'The sunlight seems fine \u2014 not too harsh today.',
      seed: 'The roots look healthy, but the stems are drooping.',
      animal: 'No animals nearby. The plants just look thirsty.',
    },
    hint: 'The plants need a deep drink.',
  },
  {
    problem: '\u{1F525} The leaves are scorching in the heat!',
    solution: 'sun_shade',
    clues: {
      water: 'The soil is moist enough \u2014 water won\'t help here.',
      sun: 'The UV index is dangerously high today!',
      seed: 'The leaf edges are curling and turning brown.',
      animal: 'The garden creatures are hiding in the shade.',
    },
    hint: 'Something needs to block the harsh light.',
  },
  {
    problem: '\u{1F41B} Something is eating the vegetables!',
    solution: 'animal_shoo',
    clues: {
      water: 'Tiny footprints in the wet mud near the carrots.',
      sun: 'You can see movement in the shadows between plants.',
      seed: 'Bite marks on the leaves \u2014 definitely not insects.',
      animal: 'A family of rabbits is hiding behind the tomatoes!',
    },
    hint: 'A critter needs to be dealt with.',
  },
  {
    problem: '\u{1F634} The seedlings have stopped growing!',
    solution: 'seed_fertilise',
    clues: {
      water: 'The watering schedule is fine \u2014 they\'re hydrated.',
      sun: 'They\'re getting enough light for their stage.',
      seed: 'The soil looks pale and nutrient-depleted.',
      animal: 'No pests visible. The problem seems to be underground.',
    },
    hint: 'The soil needs something extra.',
  },
  {
    problem: '\u{1F311} The new sprouts look pale and leggy!',
    solution: 'sun_lamp',
    clues: {
      water: 'Water levels are normal \u2014 this isn\'t a hydration issue.',
      sun: 'It\'s been overcast for a week. Very little natural light.',
      seed: 'The stems are stretching thin, reaching for any light source.',
      animal: 'All clear on the animal front.',
    },
    hint: 'The plants are desperate for light.',
  },
  {
    problem: '\u{1F30A} The garden bed is waterlogged!',
    solution: 'water_drain',
    clues: {
      water: 'The soil is completely saturated \u2014 puddles everywhere!',
      sun: 'Sunshine alone won\'t fix this flooding.',
      seed: 'The roots are starting to rot from too much moisture.',
      animal: 'Some worms are fleeing the flooded soil.',
    },
    hint: 'There\'s too much water here.',
  },
  {
    problem: '\u{1F342} The herb garden is overgrown and tangled!',
    solution: 'seed_prune',
    clues: {
      water: 'Water flow is being blocked by dense foliage.',
      sun: 'Light can\'t reach the lower leaves anymore.',
      seed: 'The branches are crossing and competing for space.',
      animal: 'Small insects are thriving in the dense undergrowth.',
    },
    hint: 'Something needs to be cut back.',
  },
  {
    problem: '\u{1F327}\uFE0F The delicate orchids are getting battered!',
    solution: 'water_mist',
    clues: {
      water: 'These flowers need humidity, not heavy watering.',
      sun: 'Light conditions are acceptable for orchids.',
      seed: 'The petals are fragile \u2014 they need gentle care.',
      animal: 'No animal issues with the orchids.',
    },
    hint: 'A soft touch with water is needed.',
  },
  {
    problem: '\u{1FAB9} Empty plots need new life!',
    solution: 'seed_plant',
    clues: {
      water: 'The soil has been pre-watered and is ready.',
      sun: 'Perfect planting conditions today.',
      seed: 'Three plots are bare \u2014 nothing growing at all.',
      animal: 'The area is pest-free and safe for new plants.',
    },
    hint: 'Something new needs to go into the ground.',
  },
  {
    problem: '\u{1F43F}\uFE0F Squirrels are digging up the bulbs!',
    solution: 'animal_trap',
    clues: {
      water: 'Fresh dig marks near the watering line.',
      sun: 'You can see bushy tails darting in the sunlight.',
      seed: 'The bulbs you planted last week are scattered on the surface.',
      animal: 'A persistent squirrel keeps coming back no matter what!',
    },
    hint: 'Shooing won\'t work this time \u2014 need a different approach.',
  },
  {
    problem: '\u2600\uFE0F The lettuce is bolting in the afternoon sun!',
    solution: 'sun_open',
    clues: {
      water: 'Watering is on schedule \u2014 not a moisture problem.',
      sun: 'The morning shade is lasting too long. They need more morning sun.',
      seed: 'The lettuce is flowering prematurely due to stress.',
      animal: 'No animal damage visible on the lettuce.',
    },
    hint: 'The plants need more natural light earlier in the day.',
  },
  {
    problem: '\u{1F41B} Caterpillars are munching the cabbage patch!',
    solution: 'animal_feed',
    clues: {
      water: 'Wet leaves seem to attract more of them.',
      sun: 'They\'re most active in the shaded areas.',
      seed: 'The cabbages have holes everywhere in their leaves.',
      animal: 'A hungry bird nearby could help \u2014 if it had something to eat here.',
    },
    hint: 'Attract a natural predator to handle this.',
  },
];

const MULTI_PROBLEM_SETS = [
  {
    problem: '\u{1F940}\u{1F525} The garden is parched AND scorching!',
    solutions: ['water_full', 'sun_shade'],
    clues: {
      water: 'The soil is cracked and bone dry \u2014 desperate for water!',
      sun: 'The UV index is dangerously high! Plants are burning!',
      seed: 'Leaves are browning at the edges AND stems are drooping badly.',
      animal: 'All animals fled. It\'s too hot and dry for anyone out here.',
    },
    hint: 'Two things are wrong \u2014 the heat AND the thirst.',
  },
  {
    problem: '\u{1F41B}\u{1F30A} Pests are invading the flooded garden!',
    solutions: ['animal_shoo', 'water_drain'],
    clues: {
      water: 'The soil is waterlogged \u2014 puddles are breeding pests!',
      sun: 'Damp conditions are creating a pest paradise.',
      seed: 'Roots are rotting AND something is eating the stems.',
      animal: 'Slugs and rabbits are having a field day in the wet soil!',
    },
    hint: 'Fix the flooding AND deal with the critters.',
  },
  {
    problem: '\u{1F311}\u{1F634} Dark skies and exhausted soil!',
    solutions: ['sun_lamp', 'seed_fertilise'],
    clues: {
      water: 'Water is fine \u2014 this problem isn\'t about hydration.',
      sun: 'A full week of heavy clouds. Plants are starving for light!',
      seed: 'The soil has no nutrients left AND the stems are stretching weakly.',
      animal: 'No pest issues. The problems are environmental.',
    },
    hint: 'The plants need light AND food.',
  },
  {
    problem: '\u{1F342}\u{1F43F}\uFE0F Overgrown garden attracting pests!',
    solutions: ['seed_prune', 'animal_trap'],
    clues: {
      water: 'Dense undergrowth is trapping moisture and hiding creatures.',
      sun: 'Thick canopy is blocking light AND providing pest cover.',
      seed: 'Branches are tangled, and something is nesting deep inside!',
      animal: 'A family of squirrels has built a home in the overgrowth!',
    },
    hint: 'Cut back the jungle AND trap the residents.',
  },
  {
    problem: '\u{1F327}\uFE0F\u{1F331} Delicate seedlings in harsh conditions!',
    solutions: ['water_mist', 'seed_plant'],
    clues: {
      water: 'Young plants need gentle moisture \u2014 heavy rain would destroy them.',
      sun: 'Conditions are otherwise fine for new growth.',
      seed: 'Half the plots are bare AND the existing seedlings need tender care.',
      animal: 'No pests around \u2014 focus on the plants themselves.',
    },
    hint: 'Plant new seeds AND gently water the fragile ones.',
  },
  {
    problem: '\u{1F525}\u{1F41B} Scorched earth brings desperate pests!',
    solutions: ['sun_shade', 'animal_feed'],
    clues: {
      water: 'The soil is warm but moist enough. Water isn\'t the issue.',
      sun: 'Blazing heat is driving animals into the garden for shade!',
      seed: 'Plants are burned AND chewed \u2014 double damage!',
      animal: 'Heat-stressed animals are eating everything in sight \u2014 they need redirecting.',
    },
    hint: 'Block the harsh sun AND redirect the hungry visitors.',
  },
  {
    problem: '\u{1F940}\u{1F342} Dehydrated overgrowth choking the garden!',
    solutions: ['water_full', 'seed_prune'],
    clues: {
      water: 'The soil under the dense foliage is completely dry.',
      sun: 'Tangled growth is blocking both light and rain.',
      seed: 'Overgrown branches are stealing water from the main plants!',
      animal: 'No pest issues, but the plants are fighting each other for resources.',
    },
    hint: 'Trim the excess AND give everything a deep drink.',
  },
  {
    problem: '\u2600\uFE0F\u{1F30A} Too much sun AND too much water!',
    solutions: ['sun_open', 'water_drain'],
    clues: {
      water: 'Irrigation malfunction has flooded the beds!',
      sun: 'The shade cloth is blocking necessary morning light.',
      seed: 'Roots are drowning AND leaves aren\'t photosynthesizing properly.',
      animal: 'Frogs have moved into the puddles. The ecosystem is off balance.',
    },
    hint: 'Let the light in AND let the water out.',
  },
  {
    problem: '\u{1FAB9}\u{1F311} New plots in darkness need everything!',
    solutions: ['seed_plant', 'sun_lamp'],
    clues: {
      water: 'Soil is prepped and watered \u2014 ready for planting.',
      sun: 'But it\'s been cloudy for days. New seeds won\'t sprout without light!',
      seed: 'Empty plots need seeds, but they also need help growing.',
      animal: 'Area is secure \u2014 no pest threats.',
    },
    hint: 'Fill the empty beds AND give them artificial light.',
  },
  {
    problem: '\u{1F41B}\u{1F940} Pest damage on dehydrated plants!',
    solutions: ['animal_shoo', 'water_full'],
    clues: {
      water: 'Weakened, thirsty plants are more vulnerable to pests!',
      sun: 'Light conditions are normal. The issue is elsewhere.',
      seed: 'Chewed leaves on wilting stems \u2014 a double crisis!',
      animal: 'Rabbits are targeting the weakest, driest plants first.',
    },
    hint: 'Chase away the pests AND revive the plants with water.',
  },
];

module.exports = { PROBLEM_SETS, MULTI_PROBLEM_SETS };
