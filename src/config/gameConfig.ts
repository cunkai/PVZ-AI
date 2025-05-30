
import type { PlantData, PlantName, ZombieData, ZombieName } from '@/types';

export const GRID_ROWS = 5;
export const GRID_COLS = 9;
export const CELL_SIZE = 80; // pixels, adjust as needed for UI
export const GAME_TICK_MS = 100; // Main game loop interval

export const INITIAL_SUNLIGHT = 150;
export const SUNFLOWER_SUN_AMOUNT = 25;
export const SUNFLOWER_PRODUCTION_INTERVAL = 10000; // 10 seconds

export const PROJECTILE_SPEED = 5; // cells per second

export const PEPPER_ARC_HEIGHT_CELLS = 0.6; // How high the arc goes, in terms of cell heights
export const PEPPER_ARC_DISTANCE_CELLS = 3.5; // Over how many cells the arc completes visually

export const PLANTS_DATA: Record<PlantName, PlantData> = {
  '豌豆射手': {
    name: '豌豆射手',
    cost: 100,
    health: 100,
    damage: 20,
    attackSpeed: 1, // 1 attack per second
    description: '向僵尸发射豌豆。',
    imageWidth: 60, imageHeight: 60, imageHint: 'cartoon peashooter'
  },
  '太阳花': {
    name: '太阳花',
    cost: 50,
    health: 80,
    sunProduction: SUNFLOWER_SUN_AMOUNT,
    sunInterval: SUNFLOWER_PRODUCTION_INTERVAL,
    description: '生产额外阳光。',
    imageWidth: 60, imageHeight: 60, imageHint: 'cartoon sunflower'
  },
  '坚果墙': {
    name: '坚果墙',
    cost: 50,
    health: 1000,
    description: '坚固的防御植物。',
    imageWidth: 60, imageHeight: 70, imageHint: 'cartoon walnut'
  },
  '电能豌豆射手': {
    name: '电能豌豆射手',
    cost: 175,
    health: 100,
    damage: 25, 
    attackSpeed: 1,
    description: '发射带电的豌豆。',
    imageWidth: 60, imageHeight: 60, imageHint: 'electric peashooter'
  },
  '闪电芦苇': {
    name: '闪电芦苇',
    cost: 125,
    health: 90,
    damage: 15, 
    attackSpeed: 0.8,
    description: '电击附近的僵尸。',
    imageWidth: 50, imageHeight: 70, imageHint: 'electric reed plant'
  },
  '芹菜潜行者': {
    name: '芹菜潜行者',
    cost: 75,
    health: 120,
    damage: 100, 
    attackSpeed: 0.5, 
    description: '近距离攻击僵尸。',
    imageWidth: 70, imageHeight: 60, imageHint: 'celery stalker plant'
  },
  '辣椒投手': {
    name: '辣椒投手',
    cost: 200,
    health: 100,
    damage: 40, 
    attackSpeed: 0.7,
    description: '投掷燃烧的辣椒。',
    imageWidth: 70, imageHeight: 70, imageHint: 'pepper catapult plant'
  },
  '冰冻射手': {
    name: '冰冻射手',
    cost: 175,
    health: 100,
    damage: 20, // Slow effect to be implemented later
    attackSpeed: 1,
    description: '发射冰冻豌豆，附带减速效果。',
    imageWidth: 60, imageHeight: 60, imageHint: 'ice peashooter'
  },
  '火焰菇': {
    name: '火焰菇',
    cost: 125,
    health: 90,
    damage: 30, // Single target, higher damage
    attackSpeed: 0.5, // Shoots faster
    description: '向僵尸喷射高伤害火球。',
    imageWidth: 60, imageHeight: 60, imageHint: 'fire mushroom'
  },
  '双子向日葵': {
    name: '双子向日葵',
    cost: 125,
    health: 80,
    sunProduction: 50, // Double sun
    sunInterval: SUNFLOWER_PRODUCTION_INTERVAL,
    description: '生产双倍的阳光。',
    imageWidth: 70, imageHeight: 70, imageHint: 'twin sunflower'
  },
};

export const ZOMBIES_DATA: Record<ZombieName, ZombieData> = {
  '普通僵尸': {
    name: '普通僵尸',
    health: 100,
    speed: 0.2, // cells per second (1 cell every 5s)
    damage: 20, // damage per attack to plant
    attackSpeed: 0.5, // 1 attack every 2s
    description: '普通的、行动缓慢的僵尸。',
    imageWidth: 60, imageHeight: 80, imageHint: 'cartoon zombie'
  },
  '路障僵尸': {
    name: '路障僵尸',
    health: 250, // More health due to cone
    speed: 0.2,
    damage: 20,
    attackSpeed: 0.5,
    description: '比普通僵尸更强壮。',
    imageWidth: 60, imageHeight: 80, imageHint: 'conehead zombie'
  },
  '舞王僵尸': {
    name: '舞王僵尸', 
    health: 300,
    speed: 0.25,
    damage: 25,
    attackSpeed: 0.6,
    description: '摇摆又危险。',
    imageWidth: 70, imageHeight: 80, imageHint: 'dancing zombie'
  },
  '僵王博士': {
    name: '僵王博士', 
    health: 2000,
    speed: 0.1,
    damage: 100,
    attackSpeed: 0.3,
    description: '大BOSS！非常强悍。',
    imageWidth: 100, imageHeight: 100, imageHint: 'zombie boss robot' // Adjusted from 120x120 for better fit
  },
  '铁桶僵尸': {
    name: '铁桶僵尸',
    health: 500,
    speed: 0.2,
    damage: 20,
    attackSpeed: 0.5,
    description: '头戴铁桶，防御力极高。',
    imageWidth: 60, imageHeight: 80, imageHint: 'buckethead zombie'
  },
  '橄榄球僵尸': {
    name: '橄榄球僵尸',
    health: 400,
    speed: 0.35, // Faster
    damage: 30,
    attackSpeed: 0.5,
    description: '移动迅速且非常耐打的橄榄球僵尸。',
    imageWidth: 70, imageHeight: 80, imageHint: 'football zombie'
  },
  '小鬼僵尸': {
    name: '小鬼僵尸',
    health: 60, // Frail
    speed: 0.5, // Very fast
    damage: 15,
    attackSpeed: 0.8, // Attacks quickly
    description: '小巧玲珑，速度飞快，但很脆弱。',
    imageWidth: 45, imageHeight: 60, imageHint: 'imp zombie'
  },
};

export const ZOMBIE_SPAWN_INTERVAL_START = 15000; // 15 seconds for first zombie
export const ZOMBIE_SPAWN_INTERVAL_MIN = 4000; // Minimum 4 seconds between spawns later
export const ZOMBIE_WAVES = [
  { count: 3, types: [ZOMBIES_DATA.普通僵尸] }, // Wave 1
  { count: 5, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.路障僵尸] }, // Wave 2
  { count: 4, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.小鬼僵尸] }, // Wave 3 - Introduce Imps
  { count: 1, types: [ZOMBIES_DATA.舞王僵尸], delay: 8000 },  // Wave 4 - Dance
  { count: 6, types: [ZOMBIES_DATA.路障僵尸, ZOMBIES_DATA.铁桶僵尸] }, // Wave 5 - Introduce Bucketheads
  { count: 3, types: [ZOMBIES_DATA.橄榄球僵尸] , delay: 5000 }, // Wave 6 - Introduce Footballers
  { count: 8, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.小鬼僵尸, ZOMBIES_DATA.路障僵尸] }, // Wave 7 - Mixed
  { count: 5, types: [ZOMBIES_DATA.铁桶僵尸, ZOMBIES_DATA.橄榄球僵尸] }, // Wave 8 - Heavy Hitters
  { count: 2, types: [ZOMBIES_DATA.舞王僵尸], delay: 10000 }, // Wave 9 - Dance Party
  { count: 1, types: [ZOMBIES_DATA.僵王博士], delay: 5000 }  // Wave 10 - Final Boss
];

// Distance from plant a zombie stops to attack
export const ZOMBIE_ATTACK_RANGE = 0.2; // fraction of a cell
