import { config } from 'dotenv';
import { db } from '../src/db/index.js';
import { marketplaceAlgorithms } from '../src/db/schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Seed marketplace with example algorithms
 */
async function seed() {
  console.log('Seeding marketplace algorithms...');

  const algorithms = [
    {
      name: 'Tech News Curator',
      description: 'Curated feed of technology news with recency boost and engagement scoring',
      author: 'Platform Team',
      tags: ['tech', 'news', 'curated'],
      downloads: 127,
      rating: 5,
      config: {
        version: '0.1.0',
        name: 'Tech News Curator',
        description: 'Curated feed of technology news with recency boost and engagement scoring',
        filters: [
          {
            type: 'keyword',
            mode: 'include',
            values: ['tech', 'programming', 'software', 'AI', 'startup', 'developer']
          },
          {
            type: 'contentType',
            mode: 'include',
            values: ['article']
          },
          {
            type: 'age',
            mode: 'include',
            values: [],
            maxAge: 86400 // 24 hours
          }
        ],
        boosters: [
          {
            type: 'recency',
            weight: 2.0
          },
          {
            type: 'engagement',
            weight: 1.5
          }
        ],
        diversity: {
          maxPerSource: 3,
          mixContentTypes: false
        },
        sort: {
          type: 'score',
          direction: 'desc'
        },
        limit: {
          maxItems: 50,
          offset: 0
        }
      }
    },
    {
      name: 'Chronological Everything',
      description: 'Simple chronological feed of all content - no filtering, no scoring',
      author: 'Community',
      tags: ['chronological', 'simple', 'unfiltered'],
      downloads: 89,
      rating: 4,
      config: {
        version: '0.1.0',
        name: 'Chronological Everything',
        description: 'Simple chronological feed of all content',
        sort: {
          type: 'chronological',
          direction: 'desc'
        },
        limit: {
          maxItems: 100,
          offset: 0
        }
      }
    },
    {
      name: 'Diverse Media Mix',
      description: 'Balanced feed with diverse content types and sources for maximum variety',
      author: 'Community',
      tags: ['diverse', 'balanced', 'variety'],
      downloads: 203,
      rating: 5,
      config: {
        version: '0.1.0',
        name: 'Diverse Media Mix',
        description: 'Balanced feed with diverse content types and sources',
        diversity: {
          maxPerSource: 2,
          mixContentTypes: true,
          minDifferentSources: 5
        },
        boosters: [
          {
            type: 'recency',
            weight: 1.0
          }
        ],
        sort: {
          type: 'score',
          direction: 'desc'
        },
        limit: {
          maxItems: 30,
          offset: 0
        }
      }
    },
    {
      name: 'Breaking News Priority',
      description: 'Extreme recency bias for breaking news and rapid updates',
      author: 'News Junkie',
      tags: ['news', 'breaking', 'urgent'],
      downloads: 56,
      rating: 4,
      config: {
        version: '0.1.0',
        name: 'Breaking News Priority',
        description: 'Extreme recency bias for breaking news',
        filters: [
          {
            type: 'age',
            mode: 'include',
            values: [],
            maxAge: 3600 // 1 hour
          }
        ],
        boosters: [
          {
            type: 'recency',
            weight: 5.0
          }
        ],
        sort: {
          type: 'chronological',
          direction: 'desc'
        },
        limit: {
          maxItems: 20,
          offset: 0
        }
      }
    },
    {
      name: 'Engagement Champion',
      description: 'Surface only the most discussed and popular content',
      author: 'Social Butterfly',
      tags: ['popular', 'viral', 'trending'],
      downloads: 178,
      rating: 5,
      config: {
        version: '0.1.0',
        name: 'Engagement Champion',
        description: 'Surface only the most discussed content',
        boosters: [
          {
            type: 'engagement',
            weight: 3.0
          }
        ],
        sort: {
          type: 'score',
          direction: 'desc'
        },
        limit: {
          maxItems: 25,
          offset: 0
        }
      }
    },
    {
      name: 'Images & Videos Only',
      description: 'Visual content feed - filter out text articles',
      author: 'Visual Learner',
      tags: ['visual', 'media', 'images', 'videos'],
      downloads: 92,
      rating: 4,
      config: {
        version: '0.1.0',
        name: 'Images & Videos Only',
        description: 'Visual content feed',
        filters: [
          {
            type: 'contentType',
            mode: 'include',
            values: ['image', 'video']
          }
        ],
        boosters: [
          {
            type: 'recency',
            weight: 1.5
          }
        ],
        diversity: {
          maxPerSource: 4
        },
        sort: {
          type: 'score',
          direction: 'desc'
        },
        limit: {
          maxItems: 40,
          offset: 0
        }
      }
    }
  ];

  try {
    // Insert all algorithms
    for (const algo of algorithms) {
      await db.insert(marketplaceAlgorithms).values({
        name: algo.name,
        description: algo.description,
        author: algo.author,
        tags: algo.tags,
        downloads: algo.downloads,
        rating: algo.rating,
        config: algo.config,
      });
      console.log(`  ✓ Added: ${algo.name}`);
    }

    console.log(`\n✅ Successfully seeded ${algorithms.length} marketplace algorithms`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
