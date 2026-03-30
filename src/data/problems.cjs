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

module.exports = { PROBLEM_SETS };
