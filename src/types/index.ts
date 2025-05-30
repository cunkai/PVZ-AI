
export type PlantName = 
  | 'Peashooter' 
  | 'Sunflower' 
  | 'WallNut' 
  | 'ElectricPeashooter' 
  | 'ElectricReed' 
  | 'CeleryStalker' 
  | 'PepperPult';

export type ZombieName = 
  | 'BasicZombie' 
  | 'ConeheadZombie' 
  | 'DancingZombie' 
  | 'Zomboss';

export interface PlantData {
  name: PlantName;
  cost: number;
  health: number;
  damage?: number; // For attackers
  attackSpeed?: number; // Attacks per second, for attackers
  sunProduction?: number; // Sun per interval, for sunflowers
  sunInterval?: number; // Interval in ms, for sunflowers
  description: string;
  imageWidth: number;
  imageHeight: number;
  imageHint: string;
}

export interface ZombieData {
  name: ZombieName;
  health: number;
  speed: number; // Cells per second
  damage: number; // Damage to plants per attack
  attackSpeed: number; // Attacks per second
  description: string;
  imageWidth: number;
  imageHeight: number;
  imageHint: string;
}

export interface PlantInstance {
  id: string;
  type: PlantName;
  x: number; // grid column
  y: number; // grid row
  health: number;
  lastActionTime?: number; // For attack/sun generation timing
}

export interface ZombieInstance {
  id: string;
  type: ZombieName;
  x: number; // grid column (can be float for smooth movement)
  y: number; // grid row (lane)
  health: number;
  lastAttackTime?: number;
}

export interface ProjectileInstance {
  id: string;
  x: number;
  y: number;
  plantType: PlantName; // To determine projectile appearance/effect
  damage: number;
  targetZombieId?: string; // Optional, for homing projectiles
  lane: number; // For straight-shooting projectiles
}

export type GameState = 'Initializing' | 'Playing' | 'Paused' | 'Won' | 'Lost';

export interface GridCell {
  plant: PlantInstance | null;
  // Zombies are tracked separately with precise x coordinates for smoother movement
}
