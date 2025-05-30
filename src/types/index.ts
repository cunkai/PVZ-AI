
export type PlantName = 
  | '豌豆射手' 
  | '太阳花' 
  | '坚果墙' 
  | '电能豌豆射手' 
  | '闪电芦苇' 
  | '芹菜潜行者' 
  | '辣椒投手'
  | '冰冻射手'
  | '火焰菇'
  | '双子向日葵';

export type ZombieName = 
  | '普通僵尸' 
  | '路障僵尸' 
  | '舞王僵尸' 
  | '僵王博士'
  | '铁桶僵尸'
  | '橄榄球僵尸'
  | '小鬼僵尸';

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
  imageHint: string; // Keep in English for AI hint
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
  imageHint: string; // Keep in English for AI hint
}

export interface PlantInstance {
  id: string;
  type: PlantName;
  x: number; // grid column
  y: number; // grid row
  health: number;
  lastActionTime?: number; // For attack/sun generation timing
  isAttacking?: boolean; // For attack animation
  isProducingSun?: boolean; // For sunflower animation
}

export interface ZombieInstance {
  id: string;
  type: ZombieName;
  x: number; // grid column (can be float for smooth movement)
  y: number; // grid row (lane)
  health: number;
  lastAttackTime?: number;
  isHit?: boolean; // For damage taken animation
  isDying?: boolean; // For death animation
}

export interface ProjectileInstance {
  id: string;
  x: number;
  y: number; // This is the logical grid row (lane)
  plantType: PlantName; // To determine projectile appearance/effect
  damage: number;
  targetZombieId?: string; // Optional, for homing projectiles
  lane: number; // For straight-shooting projectiles - redundant with y but good for clarity
  startX?: number; // For arc calculation if needed
}

export type GameState = 'Initializing' | 'Playing' | 'Paused' | 'Won' | 'Lost';

export interface GridCell {
  plant: PlantInstance | null;
  // Zombies are tracked separately with precise x coordinates for smoother movement
}
