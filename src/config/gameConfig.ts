
import type { PlantData, PlantName, ZombieData, ZombieName } from '@/types';

export const GRID_ROWS = 5;
export const GRID_COLS = 9;
export const CELL_SIZE = 80; // pixels, adjust as needed for UI
export const GAME_TICK_MS = 100; // Main game loop interval

export const INITIAL_SUNLIGHT = 100; 
export const SUNFLOWER_SUN_AMOUNT = 25;
export const SUNFLOWER_PRODUCTION_INTERVAL = 10000; // 10 seconds

export const PROJECTILE_SPEED = 5; // cells per second

export const PEPPER_ARC_HEIGHT_CELLS = 0.6; 
export const PEPPER_ARC_DISTANCE_CELLS = 3.5; 

export const PLANTS_DATA: Record<PlantName, PlantData> = {
  '豌豆射手': {
    name: '豌豆射手',
    cost: 125, 
    health: 100,
    damage: 20,
    attackSpeed: 1, 
    description: '向僵尸发射豌豆。',
    imageWidth: 60, imageHeight: 60, imageHint: 'cartoon peashooter'
  },
  '太阳花': {
    name: '太阳花',
    cost: 60, 
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
    damage: 20, 
    attackSpeed: 1,
    description: '发射冰冻豌豆，附带减速效果。(减速效果待实现)',
    imageWidth: 60, imageHeight: 60, imageHint: 'ice peashooter'
  },
  '火焰菇': {
    name: '火焰菇',
    cost: 125,
    health: 90,
    damage: 30, 
    attackSpeed: 0.5, 
    description: '向僵尸喷射高伤害火球。',
    imageWidth: 60, imageHeight: 60, imageHint: 'fire mushroom'
  },
  '双子向日葵': {
    name: '双子向日葵',
    cost: 125,
    health: 80,
    sunProduction: 50, 
    sunInterval: SUNFLOWER_PRODUCTION_INTERVAL,
    description: '生产双倍的阳光。',
    imageWidth: 70, imageHeight: 70, imageHint: 'twin sunflower'
  },
  '磁力菇': {
    name: '磁力菇',
    cost: 100,
    health: 75,
    description: '能吸走僵尸身上的金属制品（如铁桶、橄榄球头盔），使其短时间失去额外防护或眩晕。(特殊效果待实现)',
    imageWidth: 60, imageHeight: 60, imageHint: 'magnet mushroom purple'
  },
  '分裂豆': {
    name: '分裂豆',
    cost: 150,
    health: 100,
    damage: 20, // Per pea
    attackSpeed: 1,
    description: '向前和向后同时发射豌豆，应对来自两边的威胁。(后向攻击待实现)',
    imageWidth: 70, imageHeight: 60, imageHint: 'split pea two heads'
  },
  '胆小菇': {
    name: '胆小菇',
    cost: 25,
    health: 70,
    damage: 20,
    attackSpeed: 0.8,
    description: '可以进行远程攻击，但当僵尸靠近时会害怕得躲起来停止攻击。(躲藏机制待实现)',
    imageWidth: 55, imageHeight: 70, imageHint: 'scared mushroom tall'
  },
};

export const ZOMBIES_DATA: Record<ZombieName, ZombieData> = {
  '普通僵尸': {
    name: '普通僵尸',
    health: 1000, // 100 * 10
    speed: 0.2, 
    damage: 20, 
    attackSpeed: 0.5, 
    description: '普通的、行动缓慢的僵尸。',
    imageWidth: 60, imageHeight: 80, imageHint: 'cartoon zombie'
  },
  '路障僵尸': {
    name: '路障僵尸',
    health: 2800, // 280 * 10
    speed: 0.2,
    damage: 20,
    attackSpeed: 0.5,
    description: '比普通僵尸更强壮。',
    imageWidth: 60, imageHeight: 80, imageHint: 'conehead zombie'
  },
  '舞王僵尸': {
    name: '舞王僵尸', 
    health: 3000, // 300 * 10
    speed: 0.25,
    damage: 25,
    attackSpeed: 0.6,
    description: '摇摆又危险。',
    imageWidth: 70, imageHeight: 80, imageHint: 'dancing zombie'
  },
  '僵王博士': {
    name: '僵王博士', 
    health: 20000, // 2000 * 10
    speed: 0.1,
    damage: 100,
    attackSpeed: 0.3,
    description: '大BOSS！非常强悍。',
    imageWidth: 100, imageHeight: 100, imageHint: 'zombie boss robot'
  },
  '铁桶僵尸': {
    name: '铁桶僵尸',
    health: 5800, // 580 * 10
    speed: 0.2,
    damage: 20,
    attackSpeed: 0.5,
    description: '头戴铁桶，防御力极高。',
    imageWidth: 60, imageHeight: 80, imageHint: 'buckethead zombie'
  },
  '橄榄球僵尸': {
    name: '橄榄球僵尸',
    health: 4000, // 400 * 10
    speed: 0.35, 
    damage: 30,
    attackSpeed: 0.5,
    description: '移动迅速且非常耐打的橄榄球僵尸。',
    imageWidth: 70, imageHeight: 80, imageHint: 'football zombie'
  },
  '小鬼僵尸': {
    name: '小鬼僵尸',
    health: 600, // 60 * 10
    speed: 0.5, 
    damage: 15,
    attackSpeed: 0.8, 
    description: '小巧玲珑，速度飞快，但很脆弱。',
    imageWidth: 45, imageHeight: 60, imageHint: 'imp zombie small'
  },
  '报纸僵尸': {
    name: '报纸僵尸',
    health: 700, // 70 * 10
    newspaperHealth: 500, // 50 * 10
    speed: 0.2,
    enragedSpeed: 0.5, 
    damage: 25,
    attackSpeed: 0.5,
    description: '手拿报纸提供额外防护。报纸被打掉后会暴怒加速。(暴怒机制待实现)',
    imageWidth: 65, imageHeight: 80, imageHint: 'newspaper zombie reading'
  },
  '气球僵尸': {
    name: '气球僵尸',
    health: 1500, // 150 * 10
    speed: 0.25,
    damage: 20,
    attackSpeed: 0.5,
    description: '通过气球漂浮在空中，可以飞过大部分地面植物。(飞行特性待实现，目前可被所有攻击击中)',
    imageWidth: 60, imageHeight: 90, imageHint: 'zombie balloon fly' 
  },
  '矿工僵尸': {
    name: '矿工僵尸',
    health: 4000, // 400 * 10
    speed: 0.1,
    damage: 30,
    attackSpeed: 0.4,
    description: '能挖掘地道，从战场后方突然出现袭击你的植物。(挖掘特性待实现，目前生命值极高)',
    imageWidth: 70, imageHeight: 75, imageHint: 'miner zombie pickaxe'
  },
};

export const ZOMBIE_SPAWN_INTERVAL_START = 15000; 
export const ZOMBIE_SPAWN_INTERVAL_MIN = 3500; 
export const ZOMBIE_WAVES = [
  { count: 3, types: [ZOMBIES_DATA.普通僵尸] }, 
  { count: 6, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.路障僵尸] }, 
  { count: 4, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.小鬼僵尸] }, 
  { count: 2, types: [ZOMBIES_DATA.报纸僵尸], delay: 7000}, 
  { count: 1, types: [ZOMBIES_DATA.舞王僵尸], delay: 8000 },  
  { count: 7, types: [ZOMBIES_DATA.路障僵尸, ZOMBIES_DATA.铁桶僵尸] }, 
  { count: 3, types: [ZOMBIES_DATA.橄榄球僵尸] , delay: 5000 }, 
  { count: 8, types: [ZOMBIES_DATA.普通僵尸, ZOMBIES_DATA.小鬼僵尸, ZOMBIES_DATA.报纸僵尸] }, 
  { count: 2, types: [ZOMBIES_DATA.气球僵尸, ZOMBIES_DATA.路障僵尸], delay: 9000}, 
  { count: 6, types: [ZOMBIES_DATA.铁桶僵尸, ZOMBIES_DATA.橄榄球僵尸, ZOMBIES_DATA.小鬼僵尸] }, 
  { count: 2, types: [ZOMBIES_DATA.舞王僵尸, ZOMBIES_DATA.小鬼僵尸], delay: 10000 }, 
  { count: 3, types: [ZOMBIES_DATA.矿工僵尸], delay: 12000}, 
  { count: 1, types: [ZOMBIES_DATA.僵王博士, ZOMBIES_DATA.小鬼僵尸, ZOMBIES_DATA.小鬼僵尸, ZOMBIES_DATA.报纸僵尸], delay: 5000 }
];

export const ZOMBIE_ATTACK_RANGE = 0.2; 
export const PLANTS_AVAILABLE_PER_GAME = 6; 

