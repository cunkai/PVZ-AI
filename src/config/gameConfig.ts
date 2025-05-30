import type { PlantData, PlantName, ZombieData, ZombieName } from '@/types';

export const GRID_ROWS = 5;
export const GRID_COLS = 9;
export const CELL_SIZE = 80; // pixels, adjust as needed for UI
export const GAME_TICK_MS = 100; // Main game loop interval

export const INITIAL_SUNLIGHT = 150;
export const SUNFLOWER_SUN_AMOUNT = 25;
export const SUNFLOWER_PRODUCTION_INTERVAL = 10000; // 10 seconds

export const PROJECTILE_SPEED = 5; // cells per second

export const PLANTS_DATA: Record<PlantName, PlantData> = {
  Peashooter: {
    name: 'Peashooter',
    cost: 100,
    health: 100,
    damage: 20,
    attackSpeed: 1, // 1 attack per second
    description: 'Shoots peas at zombies.',
    imageWidth: 60, imageHeight: 60, imageHint: 'cartoon peashooter'
  },
  Sunflower: {
    name: 'Sunflower',
    cost: 50,
    health: 80,
    sunProduction: SUNFLOWER_SUN_AMOUNT,
    sunInterval: SUNFLOWER_PRODUCTION_INTERVAL,
    description: 'Produces extra sun.',
    imageWidth: 60, imageHeight: 60, imageHint: 'cartoon sunflower'
  },
  WallNut: {
    name: 'WallNut',
    cost: 50,
    health: 1000,
    description: 'Tough defensive plant.',
    imageWidth: 60, imageHeight: 70, imageHint: 'cartoon walnut'
  },
  ElectricPeashooter: {
    name: 'ElectricPeashooter',
    cost: 175,
    health: 100,
    damage: 25, // Slightly more damage
    attackSpeed: 1,
    description: 'Shoots electrifying peas.',
    imageWidth: 60, imageHeight: 60, imageHint: 'electric peashooter'
  },
  ElectricReed: {
    name: 'ElectricReed',
    cost: 125,
    health: 90,
    damage: 15, // Lower damage, could be AOE or multi-target in full version
    attackSpeed: 0.8,
    description: 'Zaps nearby zombies.',
    imageWidth: 50, imageHeight: 70, imageHint: 'electric reed plant'
  },
  CeleryStalker: {
    name: 'CeleryStalker',
    cost: 75,
    health: 120,
    damage: 100, // High damage, short range (simplified)
    attackSpeed: 0.5, // Slower attack
    description: 'Attacks zombies up close.',
    imageWidth: 70, imageHeight: 60, imageHint: 'celery stalker plant'
  },
  PepperPult: {
    name: 'PepperPult',
    cost: 200,
    health: 100,
    damage: 40, // Good damage, could be splash in full version
    attackSpeed: 0.7,
    description: 'Lobs fiery peppers.',
    imageWidth: 70, imageHeight: 70, imageHint: 'pepper catapult plant'
  },
};

export const ZOMBIES_DATA: Record<ZombieName, ZombieData> = {
  BasicZombie: {
    name: 'BasicZombie',
    health: 100,
    speed: 0.2, // cells per second (1 cell every 5s)
    damage: 20, // damage per attack to plant
    attackSpeed: 0.5, // 1 attack every 2s
    description: 'A regular, slow zombie.',
    imageWidth: 60, imageHeight: 80, imageHint: 'cartoon zombie'
  },
  ConeheadZombie: {
    name: 'ConeheadZombie',
    health: 250, // More health due to cone
    speed: 0.2,
    damage: 20,
    attackSpeed: 0.5,
    description: 'Tougher than a basic zombie.',
    imageWidth: 60, imageHeight: 80, imageHint: 'conehead zombie'
  },
  DancingZombie: {
    name: 'DancingZombie', // Simplified: just a tougher zombie for demo
    health: 300,
    speed: 0.25,
    damage: 25,
    attackSpeed: 0.6,
    description: 'Groovy and dangerous.',
    imageWidth: 70, imageHeight: 80, imageHint: 'dancing zombie'
  },
  Zomboss: {
    name: 'Zomboss', // Simplified: very high health, strong attack
    health: 2000,
    speed: 0.1,
    damage: 100,
    attackSpeed: 0.3,
    description: 'The big boss! Very tough.',
    imageWidth: 120, imageHeight: 120, imageHint: 'zombie boss robot'
  },
};

export const ZOMBIE_SPAWN_INTERVAL_START = 15000; // 15 seconds for first zombie
export const ZOMBIE_SPAWN_INTERVAL_MIN = 5000; // Minimum 5 seconds between spawns later
export const ZOMBIE_WAVES = [
  { count: 3, types: [ZOMBIES_DATA.BasicZombie] },
  { count: 5, types: [ZOMBIES_DATA.BasicZombie, ZOMBIES_DATA.ConeheadZombie] },
  { count: 1, types: [ZOMBIES_DATA.DancingZombie], delay: 10000 }, // Dancing zombie appears after a delay
  { count: 7, types: [ZOMBIES_DATA.BasicZombie, ZOMBIES_DATA.ConeheadZombie] },
  { count: 1, types: [ZOMBIES_DATA.Zomboss] } // Final boss
];

// Distance from plant a zombie stops to attack
export const ZOMBIE_ATTACK_RANGE = 0.2; // fraction of a cell
