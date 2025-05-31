
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
  | '双子向日葵'
  | '磁力菇'
  | '分裂豆'
  | '胆小菇'
  | '仙人掌'
  | '火葫芦'
  | '声能柚子';

export type ZombieName = 
  | '普通僵尸' 
  | '路障僵尸' 
  | '舞王僵尸' 
  | '僵王博士'
  | '铁桶僵尸'
  | '橄榄球僵尸'
  | '小鬼僵尸'
  | '报纸僵尸'
  | '气球僵尸'
  | '矿工僵尸';

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
  description:string;
  imageWidth: number;
  imageHeight: number;
  imageHint: string; // Keep in English for AI hint
  newspaperHealth?: number; // For Newspaper Zombie
  enragedSpeed?: number; // For Newspaper Zombie after losing newspaper
  // Miner Zombie specific properties
  canDig?: boolean;
  digColumnTrigger?: number; // Column at which miner considers digging
  digDuration?: number; // Time in ms to complete digging/emerging
  undergroundTravelTime?: number; // Time in ms to travel underground
  emergeColumn?: number; // Column where miner emerges
}

export interface PlantInstance {
  id: string;
  type: PlantName;
  x: number; // grid column
  y: number; // grid row
  health: number;
  lastActionTime?: number; // For attack/sun generation timing
  isAttacking?: boolean; 
  isProducingSun?: boolean; 
  isDying?: boolean;
  timeOfDeath?: number; 
}

export type MinerZombieState = 'WALKING' | 'PRE_DIGGING' | 'DIGGING' | 'UNDERGROUND' | 'EMERGING';

export interface ZombieInstance {
  id: string;
  type: ZombieName;
  x: number; // grid column (can be float for smooth movement)
  y: number; // grid row (lane)
  health: number;
  currentNewspaperHealth?: number; // Track newspaper health separately
  isEnraged?: boolean; // For Newspaper Zombie
  lastAttackTime?: number;
  isAttacking?: boolean; 
  isHit?: boolean; 
  isDying?: boolean; 
  timeOfDeath?: number;
  // Miner Zombie state
  minerState?: MinerZombieState;
  timeEnteredMinerState?: number; // Timestamp when current miner state began
  originalY?: number; // To remember original lane when underground if needed
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
  isBackward?: boolean; // For Split Pea's backward shot
}

export type GameState = 'Initializing' | 'Playing' | 'Paused' | 'Won' | 'Lost';

export interface GridCell {
  plant: PlantInstance | null;
  // Zombies are tracked separately with precise x coordinates for smoother movement
}

