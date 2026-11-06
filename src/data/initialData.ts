import { ArchiveItem, CommunityMember } from '../types';

export const INITIAL_MEMBERS: CommunityMember[] = [
  {
    id: 'member-1',
    name: 'Rajaraja Croos',
    email: 'rajarajacroos2000@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'M.Sc Computer Science, 2024',
    fellowshipYear: 'Fellowship Class of 2021-Present',
    noteOfGratitude: 'They opened their door to me when I was lost in academic pressure. Every bowl of warm soup and every patient talk reshaped how I view God\'s grace.',
    starsEarned: 18,
    contributionsCount: 7,
    role: 'MASTER_ADMIN',
    status: 'approved',
  },
  {
    id: 'member-2',
    name: 'Priscilla David',
    email: 'priscilla.d@hathbodhiya.community',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'Ph.D Molecular Biology, 2023',
    fellowshipYear: 'Fellowship Class of 2019-2023',
    noteOfGratitude: 'Learning that hospitality is a spiritual discipline that requires no pretense. Sitting at the Hathbodhiya table kept my faith alive through tough lab seasons.',
    starsEarned: 24,
    contributionsCount: 9,
    role: 'MEMBER',
    status: 'approved',
  },
  {
    id: 'member-3',
    name: 'Samuel Ebenezer',
    email: 'samuel.eb@hathbodhiya.community',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'M.Eng Structural Engineering, 2024',
    fellowshipYear: 'Fellowship Class of 2022-Present',
    noteOfGratitude: 'Whenever the world demanded performance, this home reminded us that we are sons and daughters first. Forever grateful for the claypot stews and life advice.',
    starsEarned: 15,
    contributionsCount: 5,
    role: 'MEMBER',
    status: 'approved',
  },
  {
    id: 'member-4',
    name: 'Hannah Grace Matthews',
    email: 'hannah.m@hathbodhiya.community',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'M.A. English Literature, 2023',
    fellowshipYear: 'Fellowship Class of 2020-Present',
    noteOfGratitude: 'The handwritten essays and biblical reflections tucked into notebooks by the lamp inspired my entire master thesis on grace in everyday living.',
    starsEarned: 29,
    contributionsCount: 11,
    role: 'MEMBER',
    status: 'approved',
  },
  {
    id: 'member-5',
    name: 'Joshua Christopher',
    email: 'joshua.c@hathbodhiya.community',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'M.D. Pediatrics Resident, 2025',
    fellowshipYear: 'Fellowship Class of 2021-Present',
    noteOfGratitude: 'I learned more about genuine Christian care and bedside presence by watching how tea was brewed and served here than in lecture halls.',
    starsEarned: 12,
    contributionsCount: 4,
    role: 'MEMBER',
    status: 'approved',
  },
  {
    id: 'member-6',
    name: 'Kavitha Emmanuel',
    email: 'kavitha.e@hathbodhiya.community',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    gradDegree: 'M.Sc Data Science, 2024',
    fellowshipYear: 'Fellowship Class of 2022-Present',
    noteOfGratitude: 'They never asked for anything in return, not even praise. That quiet Christlikeness is the standard for my own home one day.',
    starsEarned: 21,
    contributionsCount: 6,
    role: 'MEMBER',
    status: 'approved',
  }
];

export const INITIAL_ARCHIVE_ITEMS: ArchiveItem[] = [
  // --- MUSEUM: ARTWORK ---
  {
    id: 'museum-art-1',
    authorId: 'member-1',
    category: 'museum',
    subCategory: 'art',
    title: 'Sanctuary Under the Olive Trees',
    content: 'Drawn quietly at the back verandah during the quiet hour before evening fellowship. A study of an enduring shelter where travelers find rest, reminding us that God is an unshakeable dwelling place across all our generations.',
    images: ['/src/assets/images/charcoal_landscape_drawing_1793896594505.jpg'],
    author: {
      name: 'Rajaraja Croos',
      email: 'rajarajacroos2000@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-10-14',
    starsCount: 16,
    starredBy: ['member-2', 'member-3'],
    commentsCount: 2,
    metadata: {
      medium: 'Charcoal, graphite and tea wash on cold-press archival paper',
      yearCreated: 'Autumn 2024',
      scriptureVerse: 'Psalm 90:1 — "Lord, you have been our dwelling place throughout all generations."',
    },
    comments: [
      {
        id: 'c-1',
        authorId: 'member-4',
        authorName: 'Hannah Grace Matthews',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'hannah.m@hathbodhiya.community',
        text: 'This drawing hangs on the wall right next to the grandfather clock. Seeing it every Friday always calms my racing mind after classes.',
        createdAt: '2024-10-16',
      },
      {
        id: 'c-2',
        authorId: 'member-5',
        authorName: 'Joshua Christopher',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'joshua.c@hathbodhiya.community',
        text: 'The texture of the trees looks so alive. What a gift to have this documented forever.',
        createdAt: '2024-10-18',
      }
    ],
  },

  // --- MUSEUM: ESSAY / ARTICLE ---
  {
    id: 'museum-article-1',
    authorId: 'member-4',
    category: 'museum',
    subCategory: 'articles',
    title: 'The Table as an Altar of Grace',
    content: `When the modern world measures your worth by output, GPA, job titles, and pedigree, the greatest theological statement a believer can make is an unhurried wooden table loaded with warm food.

At Hathbodhiya, nobody asks what your resume looks like before passing the bread. Christ never interviewed the crowds on the hillside before breaking the loaves; He had compassion on them because they were hungry and weary.

True biblical hospitality is distinct from entertaining. Entertaining focuses on impressing guests with perfection and status. Hospitality focuses on ministering to the vulnerable with open hands. When we cook and wash dishes without expecting repayment, we reflect the Father who sent rain on the just and the unjust.

As grads, our natural temptation will be to climb and hoard our time. But remember this home: your highest calling in Christ is to leave an empty chair and a warm bowl for the weary brother or sister walking through your city.`,
    images: [],
    author: {
      name: 'Hannah Grace Matthews',
      email: 'hannah.m@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2023',
    },
    createdAt: '2024-08-20',
    starsCount: 22,
    starredBy: ['member-1', 'member-6'],
    commentsCount: 1,
    metadata: {
      readingTime: '4 min read',
      scripturePassage: 'Hebrews 13:2 & Luke 14:12-14',
    },
    comments: [
      {
        id: 'c-3',
        authorId: 'member-3',
        authorName: 'Samuel Ebenezer',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'samuel.eb@hathbodhiya.community',
        text: '"Hospitality focuses on ministering to the vulnerable with open hands." I am writing this into my personal journal today.',
        createdAt: '2024-08-22',
      }
    ],
  },

  // --- MUSEUM: SONGS & HYMNS LIST (ALEXA AT THE HOUSE) ---
  {
    id: 'museum-song-1',
    authorId: 'member-2',
    category: 'museum',
    subCategory: 'songs',
    title: 'Be Thou My Vision (Audrey Assad Version)',
    content: 'Whenever Sunday fellowship winds down and 10 of us are in the small kitchen drying plates, pots, and spoons, Alexa is always told to play this acoustic version. The harmonies fill the hallway while we laugh and pack leftovers into tiffin boxes.',
    images: [],
    author: {
      name: 'Priscilla David',
      email: 'priscilla.d@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2023',
    },
    createdAt: '2024-09-05',
    starsCount: 19,
    starredBy: ['member-1'],
    commentsCount: 0,
    metadata: {
      songTitle: 'Be Thou My Vision',
      artist: 'Audrey Assad (Inheritance Album)',
      alexaPrompt: 'Alexa, play Be Thou My Vision by Audrey Assad',
      lyricsSnippet: 'Riches I heed not, nor man\'s empty praise / Thou mine inheritance, now and always / Thou and Thou only, first in my heart / High King of heaven, my treasure Thou art.',
      houseMemory: 'Played during kitchen cleanups, gentle evening conversations, and right before closing prayer over the week ahead.',
    },
    comments: [],
  },

  {
    id: 'museum-song-2',
    authorId: 'member-3',
    category: 'museum',
    subCategory: 'songs',
    title: 'Turn Your Eyes Upon Jesus (Sovereign Grace Music)',
    content: 'During midterms and defense weeks, whoever walked into the living room looking stressed was handed a hot mug of cardamom tea while this song hummed softly from the Alexa speaker in the corner.',
    images: [],
    author: {
      name: 'Samuel Ebenezer',
      email: 'samuel.eb@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-05-12',
    starsCount: 14,
    starredBy: [],
    commentsCount: 0,
    metadata: {
      songTitle: 'Turn Your Eyes Upon Jesus',
      artist: 'Sovereign Grace Music',
      alexaPrompt: 'Alexa, play Turn Your Eyes Upon Jesus by Sovereign Grace',
      lyricsSnippet: 'O soul, are you weary and troubled? / No light in the darkness you see? / There\'s light for a look at the Savior, / And life more abundant and free!',
      houseMemory: 'Played during stressful exam weeks, thesis deadlines, and times when someone felt overwhelmed by the future.',
    },
    comments: [],
  },

  {
    id: 'museum-song-3',
    authorId: 'member-6',
    category: 'museum',
    subCategory: 'songs',
    title: 'Agnus Dei / Worthy is the Lamb',
    content: 'Waking up on the living room sofa bed to the smell of toasted bread and brewing coffee, with Michael W. Smith\'s live worship quietly playing in the kitchen.',
    images: [],
    author: {
      name: 'Kavitha Emmanuel',
      email: 'kavitha.e@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-04-02',
    starsCount: 11,
    starredBy: [],
    commentsCount: 0,
    metadata: {
      songTitle: 'Agnus Dei',
      artist: 'Michael W. Smith',
      alexaPrompt: 'Alexa, play Agnus Dei',
      lyricsSnippet: 'Alleluia, Alleluia / For the Lord God Almighty reigns / Holy, Holy, are You Lord God Almighty / Worthy is the Lamb.',
      houseMemory: 'Morning sunrise prayers on the balcony with birds chirping and tea.',
    },
    comments: [],
  },

  // --- RECIPE BOOK (NO STORY, NO PREP TIME, NO SERVINGS, NO SECRET TOUCH) ---
  {
    id: 'recipe-1',
    authorId: 'member-1',
    category: 'recipes',
    subCategory: 'mains',
    title: 'Hathbodhiya Sabbath Slow-Claypot Stew',
    content: '',
    images: ['/src/assets/images/home_cooked_comfort_stew_1793896595540.jpg'],
    author: {
      name: 'Rajaraja Croos',
      email: 'rajarajacroos2000@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-09-18',
    starsCount: 31,
    starredBy: ['member-4', 'member-3', 'member-2'],
    commentsCount: 1,
    metadata: {
      ingredients: [
        '1.5 kg beef chuck or bone-in lamb, cut into generous bite-sized cubes',
        '4 large russet potatoes, peeled and quartered',
        '4 organic carrots, thickly sliced on the bias',
        '2 cans cooked chickpeas (drained and rinsed)',
        '2 large yellow onions, finely diced',
        '6 cloves fresh garlic, minced',
        '2-inch piece of fresh ginger, grated',
        '2 cinnamon sticks (Ceylon bark), 4 green cardamom pods, 3 whole cloves',
        '2 tbsp coriander powder, 1 tbsp ground cumin, 1 tsp turmeric',
        '1 tsp freshly cracked black pepper & sea salt to taste',
        '4 cups rich homemade bone broth or slow-simmered vegetable stock',
        'Fresh cilantro & lemon wedges for serving'
      ],
      steps: [
        'Brown the meat in small batches inside the hot claypot with a drizzle of oil until a deep golden crust forms. Set aside.',
        'In the remaining rendered fat, sauté the diced onions slowly with a pinch of salt until sweet and caramelized (about 12 minutes).',
        'Add the minced garlic, ginger, and whole cinnamon, cardamom, and cloves. Cook for 2 minutes until the fragrance fills the entire room.',
        'Stir in the coriander, cumin, turmeric, and cracked black pepper, letting the spices bloom in the hot oil for 45 seconds.',
        'Return the meat with its resting juices to the pot. Pour in the rich stock, scrape up the flavorful browned bits from the bottom, and bring to a gentle boil.',
        'Lower heat to the lowest setting, cover tightly, and allow to simmer peacefully for 90 minutes.',
        'Add the quartered potatoes, carrots, and chickpeas. Simmer uncovered for another 35-40 minutes until potatoes are tender and broth has thickened into a velvety gravy.',
        'Rest for 15 minutes before serving so flavors marry. Shower with fresh chopped cilantro and serve alongside warm crusty sourdough.'
      ]
    },
    comments: [
      {
        id: 'c-4',
        authorId: 'member-5',
        authorName: 'Joshua Christopher',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'joshua.c@hathbodhiya.community',
        text: 'I cooked this last week in my tiny studio apartment in London using this exact recipe. It felt like I was back sitting on the rug at Hathbodhiya. Tears in my eyes.',
        createdAt: '2024-10-01',
      }
    ],
  },

  {
    id: 'recipe-2',
    authorId: 'member-6',
    category: 'recipes',
    subCategory: 'warm_beverages',
    title: 'Midnight Cardamom & Jaggery Milk Tea',
    content: '',
    images: [],
    author: {
      name: 'Kavitha Emmanuel',
      email: 'kavitha.e@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-07-15',
    starsCount: 23,
    starredBy: ['member-1'],
    commentsCount: 0,
    metadata: {
      ingredients: [
        '4 cups cold spring water',
        '4 cups fresh whole creamy milk',
        '4 heaping tbsp strong Assam or Ceylon loose black tea leaves',
        '6 green cardamom pods, lightly cracked open with mortar and pestle',
        '1-inch piece fresh ginger, crushed',
        '3 tbsp unrefined organic jaggery or palm sugar (adjust to taste)',
        'Tiny pinch of coarse sea salt (to round out the sweetness)'
      ],
      steps: [
        'Bring the water, crushed cardamom, and crushed ginger to a rolling boil in a deep saucepan. Let simmer for 4 minutes until water turns amber and smells intensely of spices.',
        'Add the loose tea leaves and boil vigorously for 2 minutes.',
        'Pour in the cold milk and jaggery. Bring the mixture up to a gentle boil, watching carefully so it rises without spilling.',
        'Reduce heat to low, let it simmer for 3 minutes, then raise heat to foam up once more.',
        'Strain through a fine mesh strainer into ceramic mugs from a high angle to create a creamy froth on top.'
      ]
    },
    comments: [],
  },

  // --- MEMORY ALBUMS ---
  {
    id: 'memory-1',
    authorId: 'member-3',
    category: 'memories',
    subCategory: 'table_fellowship',
    title: 'The Great Table at Twilight',
    content: 'This was taken on a cool November evening just after the final thesis submissions. 14 of us squeezed around the wooden dining table meant for eight. Nobody wanted to get up, even after three hours. The laughter echoed out into the garden.',
    images: ['/src/assets/images/fellowship_table_warmth_1793896593648.jpg'],
    author: {
      name: 'Samuel Ebenezer',
      email: 'samuel.eb@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-11-01',
    starsCount: 28,
    starredBy: ['member-1', 'member-4'],
    commentsCount: 1,
    comments: [
      {
        id: 'c-5',
        authorId: 'member-2',
        authorName: 'Priscilla David',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'priscilla.d@hathbodhiya.community',
        text: 'Look at how everyone is genuinely listening to each other. In an age of phones and screens, this room was our sanctuary.',
        createdAt: '2024-11-03',
      }
    ],
  },

  {
    id: 'memory-2',
    authorId: 'member-1',
    category: 'memories',
    subCategory: 'quiet_moments',
    title: 'Early Morning Scripture & Warm Mugs by the Hearth',
    content: 'The open well-worn Bible on the low wooden coffee table with handwritten margin notes going back thirty years. Steam rising from ceramic mugs while the sun crept through the curtains. The stillness in this corner has sheltered so many troubled hearts.',
    images: ['/src/assets/images/fellowship_scripture_tea_1793896595044.jpg'],
    author: {
      name: 'Rajaraja Croos',
      email: 'rajarajacroos2000@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-09-24',
    starsCount: 25,
    starredBy: ['member-3'],
    commentsCount: 0,
    comments: [],
  },

  // --- THINGS WE DON'T WANT TO FORGET (WISDOM & PERSPECTIVES) ---
  {
    id: 'wisdom-1',
    authorId: 'member-4',
    category: 'wisdom',
    subCategory: 'faith_perspective',
    title: 'God Does Not Audit Your Productivity Before Loving You',
    content: 'A golden counsel spoken quietly when several grads were feeling like failures after rejected job applications and academic setbacks: "You have been trained by modern universities to believe your dignity equals your measurable output. But the Cross cancelled the balance sheet. God was delighted in Jesus before He performed a single miracle or preached a single sermon. You are loved because you are His child, not because of your productivity."',
    images: [],
    author: {
      name: 'Hannah Grace Matthews',
      email: 'hannah.m@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2023',
    },
    createdAt: '2024-06-18',
    starsCount: 35,
    starredBy: ['member-1', 'member-2', 'member-5'],
    commentsCount: 1,
    metadata: {
      goldenQuote: 'The Cross cancelled the balance sheet. You are loved because you are His child, not because of your productivity.',
      lifePrinciple: 'Rest in Christ’s finished work before you attempt to build your career.',
    },
    comments: [
      {
        id: 'c-6',
        authorId: 'member-1',
        authorName: 'Rajaraja Croos',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorEmail: 'rajarajacroos2000@gmail.com',
        text: 'I kept this written on an index card on my laptop screen all through graduation. It rescued my mental health.',
        createdAt: '2024-06-20',
      }
    ],
  },

  {
    id: 'wisdom-2',
    authorId: 'member-2',
    category: 'wisdom',
    subCategory: 'hospitality',
    title: 'Hospitality is Creating Space to Disarm Defenses',
    content: '"When you welcome someone into your house, don\'t try to impress them with your home; impress them with Christ\'s gentleness. Give them food without demanding their story until they are ready. Give them shelter without calculating the cost. In doing so, you wash their feet without embarrassing them."',
    images: [],
    author: {
      name: 'Priscilla David',
      email: 'priscilla.d@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2023',
    },
    createdAt: '2024-05-19',
    starsCount: 27,
    starredBy: ['member-1'],
    commentsCount: 0,
    metadata: {
      goldenQuote: 'Give them shelter without calculating the cost. In doing so, you wash their feet without embarrassing them.',
      lifePrinciple: 'Love without expectations is the truest reflection of Jesus.',
    },
    comments: [],
  },

  {
    id: 'wisdom-3',
    authorId: 'member-3',
    category: 'wisdom',
    subCategory: 'golden_advice',
    title: 'Cook with Prayer, Never with Resentment',
    content: '"When you are in the kitchen chopping onions and grating garlic for others, make it a prayer for every person who will taste it. If you ever feel tired or tempted to grumble that nobody is helping, pause and turn it into thanksgiving. Bitter cooks make bitter meals, but food made in prayer brings the peace of God into the soul."',
    images: [],
    author: {
      name: 'Samuel Ebenezer',
      email: 'samuel.eb@hathbodhiya.community',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      fellowshipYear: 'Class of 2024',
    },
    createdAt: '2024-04-10',
    starsCount: 30,
    starredBy: ['member-6'],
    commentsCount: 0,
    metadata: {
      goldenQuote: 'Bitter cooks make bitter meals, but food made in prayer brings the peace of God into the soul.',
      lifePrinciple: 'Turn service into prayer so your heart remains tender.',
    },
    comments: [],
  }
];
