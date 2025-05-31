
"use client";

import type { FC, ReactNode } from 'react';
import { GRID_COLS, GRID_ROWS, CELL_SIZE, PLANTS_DATA, ZOMBIES_DATA, PEPPER_ARC_HEIGHT_CELLS, PEPPER_ARC_DISTANCE_CELLS } from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, ProjectileInstance, PlantName, ZombieName } from '@/types';
import { cn } from '@/lib/utils';

const SPAWN_AREA_WIDTH = CELL_SIZE * 0.75; 

interface BattlefieldGridProps {
  plants: PlantInstance[];
  zombies: ZombieInstance[];
  projectiles: ProjectileInstance[];
  onCellClick: (row: number, col: number) => void;
  selectedPlantName: PlantName | null;
  isShovelModeActive?: boolean;
}

const RenderPlantSvg: FC<{ type: PlantName; width: number; height: number }> = ({ type, width, height }) => {
  switch (type) {
    case '豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#38761D" /> {/* Stem */}
          <circle cx="30" cy="25" r="20" fill="#6AA84F" /> {/* Head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#38761D" /> {/* Mouth/Snout */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="black" /> {/* Eye */}
        </svg>
      );
    case '太阳花':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="45" width="6" height="15" fill="#38761D" /> {/* Stem */}
          <circle cx="30" cy="30" r="18" fill="#F1C232" /> {/* Center */}
          <ellipse transform="rotate(0 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(45 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(90 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(135 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(180 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(225 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(270 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(315 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <circle cx="30" cy="30" r="10" fill="#B45309" /> {/* Inner center */}
        </svg>
      );
    case '坚果墙': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="38" rx="28" ry="32" fill="#8D6E63" /> {/* Main body */}
          <path d="M15 20 Q30 5 45 20 Q60 35 45 50 Q30 65 15 50 Q0 35 15 20 Z" stroke="#5D4037" strokeWidth="2" fill="none" opacity="0.5" />
          <ellipse cx="30" cy="38" rx="20" ry="25" fill="#A1887F" />
          <line x1="30" y1="10" x2="30" y2="25" stroke="#5D4037" strokeWidth="3"/> {/* Top crack */}
          <circle cx="20" cy="30" r="3" fill="#5D4037" /> <circle cx="40" cy="45" r="3" fill="#5D4037" />
        </svg>
      );
    case '电能豌豆射手': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#1E3A8A" /> 
          <circle cx="30" cy="25" r="20" fill="#3B82F6" /> 
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#1E3A8A" /> 
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#FACC15" /> 
          <path d="M50 20 L55 15 L53 22 L58 20 L50 30 L52 23 L48 25 Z" fill="#FDE047" /> 
        </svg>
      );
    case '闪电芦苇': 
      return (
        <svg width={width} height={height} viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="5" width="10" height="60" fill="#60A5FA" rx="3"/>
          <rect x="20" y="10" width="10" height="55" fill="#3B82F6" rx="3"/>
          <rect x="32" y="5" width="10" height="60" fill="#60A5FA" rx="3"/>
          <circle cx="13" cy="5" r="4" fill="#FDE047" />
          <circle cx="25" cy="10" r="4" fill="#FDE047" />
          <circle cx="37" cy="5" r="4" fill="#FDE047" />
        </svg>
      );
    case '芹菜潜行者': 
      return (
        <svg width={width} height={height} viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="35" cy="52" rx="30" ry="8" fill="#556B2F" /> {/* Base */}
          <path d="M20 50 C25 20, 30 15, 35 10 L40 12 C35 20, 30 25, 25 50 Z" fill="#6B8E23" />
          <path d="M35 50 C40 20, 45 15, 50 10 L55 12 C50 20, 45 25, 40 50 Z" fill="#8FBC8F" />
          <path d="M25 45 L15 40 L20 35 Q35 40 40 35 L45 40 L35 48 Z" fill="darkgreen" /> {/* Eyes-like leaves */}
        </svg>
      );
    case '辣椒投手': 
      return (
        <svg width={width} height={height} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="55" width="50" height="10" fill="#A0522D" rx="3"/> {/* Base */}
          <rect x="30" y="15" width="10" height="45" fill="#8B4513" transform="rotate(-25 35 37.5)"/> {/* Arm */}
          <ellipse cx="20" cy="15" rx="10" ry="8" fill="#FF6347" transform="translate(0,0) rotate(-25 35 37.5)"/> {/* Pepper Bucket */}
           <circle cx="20" cy="15" r="7" fill="#DC2626" transform="translate(0,0) rotate(-25 35 37.5)"/>
        </svg>
      );
    case '冰冻射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#5DADE2" /> {/* Stem */}
          <circle cx="30" cy="25" r="20" fill="#A9CCE3" /> {/* Head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#5DADE2" /> {/* Mouth/Snout */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#2E86C1" /> {/* Eye */}
          <path d="M30 8 L28 12 L32 12 Z M26 14 L34 14 L30 18 Z" fill="white" stroke="#A9CCE3" strokeWidth="0.5"/>
          <line x1="30" y1="5" x2="30" y2="10" stroke="white" strokeWidth="1.5"/>
          <line x1="26" y1="7" x2="34" y2="11" stroke="white" strokeWidth="1.5"/>
          <line x1="26" y1="11" x2="34" y2="7" stroke="white" strokeWidth="1.5"/>
        </svg>
      );
    case '火焰菇':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="35" width="16" height="25" fill="#A0522D" rx="4"/> {/* Stem */}
          <path d="M10 40 Q15 15, 30 5 Q45 15, 50 40 Z" fill="#E67E22" /> {/* Cap base */}
          <path d="M15 38 Q20 20, 30 10 Q40 20, 45 38 Z" fill="#F39C12" opacity="0.8"/> {/* Cap highlight 1 */}
          <path d="M20 35 Q25 25, 30 15 Q35 25, 40 35 Z" fill="#F5B041" opacity="0.7"/> {/* Cap highlight 2 */}
          <circle cx="20" cy="28" r="4" fill="#DC2626" /> <circle cx="40" cy="28" r="4" fill="#DC2626" /> {/* Eyes */}
        </svg>
      );
    case '双子向日葵':
      return (
        <svg width={width} height={height} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="32" y="50" width="6" height="20" fill="#38761D"/> {/* Main Stem */}
          <g transform="translate(-12, 0)">
            <rect x="27" y="45" width="6" height="10" fill="#38761D" transform="rotate(-15 30 50)"/> 
            <circle cx="30" cy="30" r="16" fill="#F1C232"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <ellipse key={`l-${angle}`} transform={`rotate(${angle} 30 30)`} cx="30" cy="12" rx="6" ry="9" fill="#FFD966"/>
            ))}
            <circle cx="30" cy="30" r="9" fill="#B45309"/>
          </g>
          <g transform="translate(12, 0)">
             <rect x="27" y="45" width="6" height="10" fill="#38761D" transform="rotate(15 30 50)"/> 
            <circle cx="30" cy="30" r="16" fill="#F1C232"/>
             {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <ellipse key={`r-${angle}`} transform={`rotate(${angle} 30 30)`} cx="30" cy="12" rx="6" ry="9" fill="#FFD966"/>
            ))}
            <circle cx="30" cy="30" r="9" fill="#B45309"/>
          </g>
        </svg>
      );
    case '磁力菇':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="35" width="10" height="25" fill="#8A2BE2" rx="3"/> {/* Stem */}
          <path d="M15 10 C 5 10, 5 35, 15 35 L 15 40 L 10 40 L 10 5 L 15 5 L 15 10 Z" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/> {/* Left magnet arm */}
          <path d="M45 10 C 55 10, 55 35, 45 35 L 45 40 L 50 40 L 50 5 L 45 5 L 45 10 Z" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/> {/* Right magnet arm */}
          <ellipse cx="30" cy="20" rx="18" ry="15" fill="#E6E6FA" /> {/* Head base */}
          <path d="M15 5 Q30 -5 45 5" stroke="#A9A9A9" strokeWidth="2" fill="none"/> {/* Top curve */}
          <circle cx="22" cy="20" r="4" fill="black" /> <circle cx="38" cy="20" r="4" fill="black" /> {/* Eyes */}
        </svg>
      );
    case '分裂豆':
      return (
        <svg width={width} height={height} viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="10" height="20" fill="#38761D" /> {/* Stem */}
          {/* Front Head */}
          <g>
            <circle cx="35" cy="25" r="20" fill="#6AA84F" />
            <ellipse cx="50" cy="25" rx="8" ry="4" fill="#38761D" /> {/* Mouth */}
            <circle cx="27" cy="18" r="5" fill="white" /><circle cx="27" cy="18" r="2.5" fill="black" /> {/* Eye */}
          </g>
          {/* Back Head */}
          <g transform="translate(0, 5)"> {/* Slightly lower back head */}
            <circle cx="15" cy="25" r="15" fill="#5A9A3F" /> {/* Slightly darker green */}
            <ellipse cx="3" cy="25" rx="6" ry="3" fill="#38761D" /> {/* Back Mouth */}
             <circle cx="20" cy="18" r="4" fill="white" /><circle cx="20" cy="18" r="2" fill="black" /> {/* Back Eye */}
          </g>
        </svg>
      );
    case '胆小菇':
      return (
        <svg width={width} height={height} viewBox="0 0 55 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="30" width="11" height="40" fill="#DDA0DD" rx="4"/> {/* Stem (lavender) */}
          <ellipse cx="27.5" cy="20" rx="20" ry="18" fill="#EE82EE" /> {/* Cap Base (violet) */}
           <path d="M10 25 Q27.5 0 45 25" fill="#DA70D6" opacity="0.7" /> {/* Cap Top (orchid) */}
          <circle cx="20" cy="18" r="6" fill="white" stroke="black" strokeWidth="1"><animate attributeName="r" values="6;4;6" dur="1s" repeatCount="indefinite" /></circle> 
          <circle cx="35" cy="18" r="6" fill="white" stroke="black" strokeWidth="1"><animate attributeName="r" values="6;4;6" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="20" cy="18" r="2.5" fill="black" /> <circle cx="35" cy="18" r="2.5" fill="black" /> {/* Pupils */}
        </svg>
      );
    case '仙人掌':
      return (
        <svg width={width} height={height} viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70 C20 70 15 60 15 50 C15 35 25 30 30 10 C35 30 45 35 45 50 C45 60 40 70 30 70 Z" fill="#558B2F"/>
          <path d="M15 50 C5 50 0 40 5 30 C10 25 15 35 15 40 Z" fill="#689F38" transform="translate(-2, -5) rotate(-10 10 35)"/>
          <path d="M45 50 C55 50 60 40 55 30 C50 25 45 35 45 40 Z" fill="#689F38" transform="translate(2, -5) rotate(10 50 35)"/>
          <circle cx="30" cy="12" r="5" fill="#FFEB3B"/> <circle cx="30" cy="12" r="2.5" fill="#F9A825"/>
          {[...Array(5)].map((_, i) => <line key={`s1-${i}`} x1={30 + (i-2)*5} y1="25" x2={30 + (i-2)*5} y2="28" stroke="#33691E" strokeWidth="1"/>)}
          {[...Array(4)].map((_, i) => <line key={`s2-${i}`} x1={15 + (i-1.5)*4} y1="35" x2={15 + (i-1.5)*4} y2="38" stroke="#33691E" strokeWidth="1"/>)}
          {[...Array(4)].map((_, i) => <line key={`s3-${i}`} x1={45 + (i-1.5)*4} y1="35" x2={45 + (i-1.5)*4} y2="38" stroke="#33691E" strokeWidth="1"/>)}
        </svg>
      );
    case '火葫芦':
      return (
        <svg width={width} height={height} viewBox="0 0 65 70" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.5 70 C15 70 10 55 10 40 Q10 20 25 10 C30 5 40 5 45 10 Q60 20 60 40 C60 55 50 70 32.5 70 Z" fill="#E67E22"/>
          <path d="M25 10 Q32.5 0 45 10" fill="#F39C12"/>
          <rect x="30" y="0" width="5" height="10" fill="#8B4513"/>
          <circle cx="25" cy="25" r="5" fill="#FDEBD0"/> <circle cx="25" cy="25" r="2.5" fill="#D35400"/>
          <circle cx="40" cy="25" r="5" fill="#FDEBD0"/> <circle cx="40" cy="25" r="2.5" fill="#D35400"/>
          <path d="M28 35 Q32.5 40 37 35" stroke="#D35400" strokeWidth="2" fill="none"/>
        </svg>
      );
    case '声能柚子':
      return (
        <svg width={width} height={height} viewBox="0 0 60 65" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="35" rx="28" ry="30" fill="#FFEFD5" />
          <ellipse cx="30" cy="35" rx="22" ry="24" fill="#FFF8DC" />
          <rect x="27" y="0" width="6" height="10" fill="#6B8E23"/>
          <path d="M15 5 L20 15 L10 15 Z" fill="#9ACD32"/>
          <path d="M45 5 L40 15 L50 15 Z" fill="#9ACD32"/>
          <circle cx="22" cy="30" r="4" fill="#556B2F" />
          <circle cx="38" cy="30" r="4" fill="#556B2F" />
        </svg>
      );
    case '火焰豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#B9441E" /> {/* Dark red stem */}
          <circle cx="30" cy="25" r="20" fill="#E74C3C" /> {/* Red head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#C0392B" /> {/* Dark red mouth */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#F39C12" /> {/* Orange pupil */}
          <path d="M28 5 Q30 0 32 5 Q35 8 30 15 Q25 8 28 5 Z" fill="#F1C40F" opacity="0.9"/> {/* Flame on head */}
        </svg>
      );
    case '闪电豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#2980B9" /> {/* Blue stem */}
          <circle cx="30" cy="25" r="20" fill="#F1C40F" /> {/* Yellow head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#F39C12" /> {/* Orange mouth */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#2980B9" /> {/* Blue pupil */}
          <path d="M48 15 L53 10 L51 17 L56 15 L48 25 L50 18 L46 20 Z" fill="#3498DB" /> {/* Lightning bolt */}
        </svg>
      );
    case '毒液豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#512E5F" /> {/* Dark purple stem */}
          <circle cx="30" cy="25" r="20" fill="#8E44AD" /> {/* Purple head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#512E5F" /> {/* Dark purple mouth */}
          <circle cx="22" cy="18" r="5" fill="#A2D9CE" /><circle cx="22" cy="18" r="2.5" fill="#1E8449" /> {/* Green pupil */}
          <path d="M45 30 Q43 33 45 36 Q47 33 45 30 M48 32 Q46 35 48 38 Q50 35 48 32" fill="#2ECC71" opacity="0.7"/> {/* Dripping poison */}
        </svg>
      );
    default:
      return <div style={{ width, height, backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }}>{type}</div>;
  }
};

const RenderZombieSvg: FC<{ type: ZombieName; width: number; height: number; isEnraged?: boolean; minerState?: string }> = ({ type, width, height, isEnraged, minerState }) => {
  let specificWrapperStyle: React.CSSProperties = {};
  if (type === '矿工僵尸') {
    if (minerState === 'DIGGING') {
      specificWrapperStyle.transform = 'translateY(30%)';
      specificWrapperStyle.opacity = 0.7;
      specificWrapperStyle.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    } else if (minerState === 'EMERGING') {
      specificWrapperStyle.transform = 'translateY(0%)';
      specificWrapperStyle.opacity = 1;
      specificWrapperStyle.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    } else if (minerState === 'PRE_DIGGING') {
        // No visual change for pre_digging, it's a pause state
    }
  }

  const SvgComponent = () => {
    switch (type) {
        case '普通僵尸': 
        return (
            <svg width={width} height={height} viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="28" width="36" height="47" fill="#787A77" rx="5"/> {/* Body */}
            <circle cx="30" cy="18" r="13" fill="#A8A9A5"/> {/* Head */}
            <rect x="5" y="35" width="10" height="25" fill="#696B68" transform="rotate(-10 7 35)"/> {/* Left Arm */}
            <rect x="45" y="35" width="10" height="25" fill="#696B68" transform="rotate(10 48 35)"/> {/* Right Arm */}
            <rect x="15" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Left Leg */}
            <rect x="33" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Right Leg */}
            <circle cx="24" cy="16" r="3" fill="#E74C3C" /> <circle cx="36" cy="16" r="3" fill="#E74C3C" /> {/* Eyes */}
            <line x1="25" y1="23" x2="35" y2="23" stroke="black" strokeWidth="1.5" /> {/* Mouth */}
            </svg>
        );
        case '路障僵尸': 
        return (
            <svg width={width} height={height} viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="30" width="36" height="45" fill="#787A77" rx="5"/> {/* Body */}
            <circle cx="30" cy="20" r="13" fill="#A8A9A5"/> {/* Head */}
            <rect x="5" y="37" width="10" height="25" fill="#696B68" transform="rotate(-10 7 37)"/> {/* Left Arm */}
            <rect x="45" y="37" width="10" height="25" fill="#696B68" transform="rotate(10 48 37)"/> {/* Right Arm */}
            <rect x="15" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Left Leg */}
            <rect x="33" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Right Leg */}
            <circle cx="24" cy="18" r="3" fill="#E74C3C" /> <circle cx="36" cy="18" r="3" fill="#E74C3C" /> {/* Eyes */}
            <line x1="25" y1="25" x2="35" y2="25" stroke="black" strokeWidth="1.5" /> {/* Mouth */}
            {/* Cone */}
            <polygon points="30,0 18,22 42,22" fill="#E67E22"/>
            <path d="M18,22 Q30,26 42,22 L30,0 Z" fill="#D35400" opacity="0.7"/>
            </svg>
        );
        case '舞王僵尸': 
            return (
                <svg width={width} height={height} viewBox="0 0 70 80" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="28" width="40" height="47" fill="#8E44AD" rx="5"/> {/* Body - purple suit */}
                <circle cx="35" cy="18" r="13" fill="#BDC3C7"/> {/* Head */}
                <path d="M25 6 Q35 -2 45 6 L42 15 L28 15 Z" fill="#2C3E50"/> {/* Hair */}
                <rect x="2" y="32" width="12" height="28" fill="#8E44AD" transform="rotate(-35 8 32)"/> {/* Left Arm up */}
                <rect x="56" y="32" width="12" height="28" fill="#8E44AD" transform="rotate(35 62 32)"/> {/* Right Arm up */}
                <rect x="20" y="72" width="13" height="8" fill="#7D3C98"/> {/* Left Leg */}
                <rect x="37" y="72" width="13" height="8" fill="#7D3C98"/> {/* Right Leg */}
                <circle cx="30" cy="16" r="3" fill="#F1C40F" /> <circle cx="40" cy="16" r="3" fill="#F1C40F" /> {/* Eyes - yellow */}
                <path d="M30 23 Q35 26 40 23" stroke="black" strokeWidth="1.5" fill="none"/> {/* Smile */}
                </svg>
            );
        case '僵王博士': 
            return (
                <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="35" width="70" height="60" fill="#4A4A4A" rx="10"/> {/* Main Body - Darker */}
                <rect x="10" y="25" width="80" height="20" fill="#5A5A5A" rx="5"/> {/* Shoulder part */}
                <circle cx="50" cy="20" r="18" fill="#6A6A6A"/> {/* Head */}
                <rect x="30" y="0" width="40" height="8" fill="#F39C12"/> {/* Helmet top */}
                <polygon points="30,8 70,8 75,2 25,2" fill="#F1C40F"/> {/* Helmet front */}
                <rect x="5" y="50" width="20" height="40" fill="#3A3A3A" rx="5"/> {/* Left Arm thick */}
                <rect x="75" y="50" width="20" height="40" fill="#3A3A3A" rx="5"/> {/* Right Arm thick */}
                <circle cx="40" cy="18" r="5" fill="red" /> <circle cx="60" cy="18" r="5" fill="red" /> {/* Big Red Eyes */}
                <line x1="42" y1="28" x2="58" y2="28" stroke="#2C3E50" strokeWidth="3" /> {/* Mouth */}
                </svg>
            );
        case '铁桶僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            {/* Basic Zombie Parts */}
            <rect x="12" y="30" width="36" height="45" fill="#787A77" rx="5"/>
            <circle cx="30" cy="20" r="13" fill="#A8A9A5"/>
            <rect x="5" y="37" width="10" height="25" fill="#696B68" transform="rotate(-10 7 37)"/>
            <rect x="45" y="37" width="10" height="25" fill="#696B68" transform="rotate(10 48 37)"/>
            <rect x="15" y="72" width="12" height="8" fill="#5A5C5A"/>
            <rect x="33" y="72" width="12" height="8" fill="#5A5C5A"/>
            <circle cx="24" cy="18" r="3" fill="#E74C3C" /> <circle cx="36" cy="18" r="3" fill="#E74C3C" />
            <line x1="25" y1="25" x2="35" y2="25" stroke="black" strokeWidth="1.5" />
            {/* Bucket */}
            <rect x="12" y="-2" width="36" height="22" fill="#B0BEC5" rx="3" ry="3"/>
            <rect x="10" y="18" width="40" height="5" fill="#90A4AE" rx="2"/>
            <line x1="18" y1="5" x2="18" y2="15" stroke="#78909C" strokeWidth="2"/>
            <line x1="42" y1="5" x2="42" y2="15" stroke="#78909C" strokeWidth="2"/>
            </svg>
        );
        case '橄榄球僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 70 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="28" width="50" height="47" fill="#2980B9" rx="8"/> {/* Blue Suit */}
            <circle cx="35" cy="18" r="13" fill="#A8A9A5"/> {/* Head */}
            <rect x="20" y="-2" width="30" height="18" fill="#3498DB" rx="5"/> {/* Helmet Main */}
            <rect x="18" y="10" width="34" height="5" fill="#2C3E50" /> {/* Helmet Grill */}
            <rect x="15" y="25" width="10" height="15" fill="#2980B9" /> {/* Shoulder Pad L */}
            <rect x="45" y="25" width="10" height="15" fill="#2980B9" /> {/* Shoulder Pad R */}
            <rect x="2" y="35" width="12" height="28" fill="#21618C" transform="rotate(-15 7 35)"/> {/* Left Arm */}
            <rect x="56" y="35" width="12" height="28" fill="#21618C" transform="rotate(15 62 35)"/> {/* Right Arm */}
            <rect x="18" y="72" width="15" height="8" fill="#1A5276"/> {/* Left Leg */}
            <rect x="37" y="72" width="15" height="8" fill="#1A5276"/> {/* Right Leg */}
            <circle cx="29" cy="16" r="3" fill="red" /> <circle cx="41" cy="16" r="3" fill="red" />
            <line x1="30" y1="23" x2="40" y2="23" stroke="black" strokeWidth="1.5" />
            </svg>
        );
        case '小鬼僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 45 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="22" width="15" height="33" fill="#787A77" rx="3"/> {/* Body */}
            <circle cx="22.5" cy="12" r="10" fill="#A8A9A5"/> {/* Head */}
            <rect x="8" y="25" width="7" height="18" fill="#696B68" transform="rotate(-10 10 25)"/> {/* Left Arm */}
            <rect x="30" y="25" width="7" height="18" fill="#696B68" transform="rotate(10 32 25)"/> {/* Right Arm */}
            <rect x="16" y="53" width="6" height="7" fill="#5A5C5A"/> {/* Left Leg */}
            <rect x="23" y="53" width="6" height="7" fill="#5A5C5A"/> {/* Right Leg */}
            <circle cx="18" cy="11" r="2.5" fill="#E74C3C" /> <circle cx="27" cy="11" r="2.5" fill="#E74C3C" /> {/* Eyes */}
            <path d="M19 16 Q22.5 18 26 16" stroke="black" strokeWidth="1" fill="none"/> {/* Mouth */}
            </svg>
        );
        case '报纸僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 65 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="28" width="37" height="47" fill={isEnraged ? "#CB4335" : "#787A77"} rx="5"/> {/* Body, enraged color red */}
            <circle cx="32.5" cy="18" r="13" fill={isEnraged ? "#F5B7B1" : "#A8A9A5"}/> {/* Head */}
            <rect x="7" y="35" width="10" height="25" fill={isEnraged ? "#B03A2E" : "#696B68"} transform="rotate(-10 9 35)"/> {/* Left Arm */}
            <rect x="48" y="35" width="10" height="25" fill={isEnraged ? "#B03A2E" : "#696B68"} transform="rotate(10 50 35)"/> {/* Right Arm */}
            <rect x="17" y="72" width="12" height="8" fill={isEnraged ? "#922B21" : "#5A5C5A"}/> {/* Left Leg */}
            <rect x="35" y="72" width="12" height="8" fill={isEnraged ? "#922B21" : "#5A5C5A"}/> {/* Right Leg */}
            <circle cx="26.5" cy="16" r="3.5" fill="red" /> <circle cx="38.5" cy="16" r="3.5" fill="red" /> {/* Eyes, bigger if enraged */}
            <line x1="27.5" y1="23" x2="37.5" y2="23" stroke="black" strokeWidth="2" /> {/* Mouth */}
            {!isEnraged && (
                <>
                <rect x="5" y="10" width="55" height="35" fill="#FDFEFE" rx="3" stroke="#BDBDBD" strokeWidth="1" />
                <line x1="10" y1="18" x2="50" y2="18" stroke="#707070" strokeWidth="1.5" />
                <line x1="10" y1="25" x2="55" y2="25" stroke="#707070" strokeWidth="1.5" />
                <line x1="10" y1="32" x2="45" y2="32" stroke="#707070" strokeWidth="1.5" />
                <rect x="10" y="15" width="15" height="10" fill="#E5E7E9" />
                </>
            )}
            </svg>
        );
        case '气球僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
            {/* Balloon */}
            <ellipse cx="30" cy="20" rx="20" ry="25" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5"/>
            <path d="M30 45 Q25 50 20 48 L30 55 L40 48 Q35 50 30 45 Z" fill="#C0392B" /> {/* Knot */}
            <line x1="30" y1="45" x2="30" y2="55" stroke="#787A77" strokeWidth="1"/> {/* String */}
            {/* Zombie (smaller, hanging) */}
            <g transform="translate(0, 30)">
                <rect x="18" y="28" width="24" height="30" fill="#787A77" rx="3"/> {/* Body */}
                <circle cx="30" cy="20" r="10" fill="#A8A9A5"/> {/* Head */}
                <rect x="12" y="32" width="6" height="15" fill="#696B68" transform="rotate(-20 14 32)"/> {/* Left Arm */}
                <rect x="42" y="32" width="6" height="15" fill="#696B68" transform="rotate(20 40 32)"/> {/* Right Arm */}
                <circle cx="26" cy="19" r="2" fill="white" /> <circle cx="34" cy="19" r="2" fill="white" /> {/* Eyes */}
            </g>
            </svg>
        );
        case '矿工僵尸':
        return (
            <svg width={width} height={height} viewBox="0 0 70 75" xmlns="http://www.w3.org/2000/svg" style={specificWrapperStyle}>
            <rect x="10" y="25" width="50" height="45" fill="#616A6B" rx="5"/> {/* Body - dark grey */}
            <circle cx="35" cy="18" r="15" fill="#7F8C8D"/> {/* Head */}
            {/* Helmet */}
            <path d="M15 18 Q35 0 55 18 A15 15 0 0 1 15 18 Z" fill="#F1C40F" stroke="#B7950B" strokeWidth="1.5"/>
            <rect x="32" y="2" width="6" height="6" fill="#F5B041" rx="1"/> {/* Helmet Lamp */}
            {/* Pickaxe (simplified) */}
            <rect x="45" y="30" width="10" height="30" fill="#795548" transform="rotate(20 50 45)" rx="2"/> {/* Handle */}
            <rect x="50" y="20" width="15" height="8" fill="#A1887F" transform="rotate(20 50 45)" rx="1"/> {/* Head of pickaxe */}
            <rect x="7" y="35" width="10" height="25" fill="#515A5A" transform="rotate(-10 9 35)"/> {/* Left Arm */}
            <rect x="15" y="67" width="15" height="8" fill="#424949"/> {/* Left Leg */}
            <rect x="40" y="67" width="15" height="8" fill="#424949"/> {/* Right Leg */}
            <circle cx="28" cy="17" r="3" fill="red" /> <circle cx="42" cy="17" r="3" fill="red" /> {/* Eyes */}
            </svg>
        );
        default:
        return <div style={{ width, height, backgroundColor: 'lightpink', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }}>{type}</div>;
    }
  }
  return <SvgComponent />;
};


const BattlefieldGrid: FC<BattlefieldGridProps> = ({ plants, zombies, projectiles, onCellClick, selectedPlantName, isShovelModeActive }) => {
  const gridCells: ReactNode[] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isEvenRow = row % 2 === 0;
      const isEvenCol = col % 2 === 0;
      const cellBgClass = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
        ? 'bg-green-300/60 dark:bg-green-800/60' 
        : 'bg-green-400/60 dark:bg-green-700/60'; 
      
      const hasPlant = plants.some(p => p.x === col && p.y === row && !p.isDying);
      
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className={cn(
            "border border-green-500/50 dark:border-green-600/50 flex items-center justify-center relative",
            cellBgClass,
            (selectedPlantName || (isShovelModeActive && hasPlant)) && "cursor-pointer",
            isShovelModeActive && hasPlant && "hover:bg-red-500/30 dark:hover:bg-red-700/30",
            !isShovelModeActive && selectedPlantName && "hover:bg-yellow-400/30 dark:hover:bg-yellow-700/30 transition-colors duration-150"
          )}
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
          onClick={() => onCellClick(row, col)}
          role="button"
          aria-label={`在行 ${row + 1}, 列 ${col + 1} ${isShovelModeActive && hasPlant ? '移除植物' : (selectedPlantName ? '放置植物' : '单元格')}`}
          tabIndex={0}
        >
          {selectedPlantName && !isShovelModeActive && (
            <div className="absolute inset-0 bg-yellow-400/20 pointer-events-none"></div>
          )}
           {isShovelModeActive && hasPlant && (
            <div className="absolute inset-0 bg-red-400/20 pointer-events-none"></div>
          )}
        </div>
      );
    }
  }

  return (
    <div 
      className={cn(
        "relative bg-transparent",
        isShovelModeActive && "cursor-[url(/shovel-cursor.svg),_auto]" 
      )}
      style={{ 
        width: (GRID_COLS * CELL_SIZE) + SPAWN_AREA_WIDTH, 
        height: GRID_ROWS * CELL_SIZE 
      }}
    >
      <div
        className="absolute top-0 left-0 bg-background/50 shadow-xl border-y-4 border-l-4 border-green-700 dark:border-green-500 rounded-l-lg"
        style={{
          width: GRID_COLS * CELL_SIZE,
          height: GRID_ROWS * CELL_SIZE,
        }}
      >
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          }}
        >
          {gridCells}
        </div>
      </div>

      <div
        className="absolute top-0 bg-gray-300/70 dark:bg-gray-600/70 border-y-4 border-r-4 border-green-700 dark:border-green-500 rounded-r-lg shadow-xl"
        style={{
          left: GRID_COLS * CELL_SIZE,
          width: SPAWN_AREA_WIDTH,
          height: GRID_ROWS * CELL_SIZE,
          zIndex: 0, 
        }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-center h-full">
            <p 
              className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transform -rotate-90 whitespace-nowrap origin-center opacity-70"
              style={{ letterSpacing: '0.05em' }}
            >
                僵尸出现区
            </p>
        </div>
      </div>
      
      {plants.map(plant => {
        const plantData = PLANTS_DATA[plant.type];
        return (
          <div
            key={plant.id}
            className={cn(
              "absolute transition-all duration-100 ease-linear flex flex-col items-center justify-center",
              {
                'animate-plant-attack': plant.isAttacking,
                'animate-sunflower-produce': (plantData.sunProduction && plantData.sunProduction > 0) && plant.isProducingSun,
                'animate-unit-die': plant.isDying,
              }
            )}
            style={{
              left: plant.x * CELL_SIZE + (CELL_SIZE - plantData.imageWidth) / 2,
              top: plant.y * CELL_SIZE + (CELL_SIZE - plantData.imageHeight) / 2,
              width: plantData.imageWidth,
              height: plantData.imageHeight,
              zIndex: plant.isDying ? 5 : 10,
            }}
            title={`${plantData.name} (生命值: ${plant.health})`}
          >
            <RenderPlantSvg type={plant.type} width={plantData.imageWidth} height={plantData.imageHeight} />
            {!plant.isDying && (
             <div className="w-full h-1 bg-red-500 rounded-full mt-1 opacity-80">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(plant.health / plantData.health) * 100}%` }}
                />
              </div>
            )}
          </div>
        );
      })}

      {zombies.map(zombie => {
        const zombieData = ZOMBIES_DATA[zombie.type];
        const visualXOffset = (CELL_SIZE - zombieData.imageWidth) / 2;
        const visualYOffset = (CELL_SIZE - zombieData.imageHeight) / 2;
        
        if (zombie.type === '矿工僵尸' && zombie.minerState === 'UNDERGROUND') {
            return null; 
        }

        let currentHealth = zombie.health;
        let maxHealth = zombieData.health;
        if(zombie.type === '报纸僵尸' && zombieData.newspaperHealth && zombie.currentNewspaperHealth !== undefined){
            // For display purposes, add newspaper health to total, actual damage logic is separate
            currentHealth += zombie.currentNewspaperHealth; 
            maxHealth += zombieData.newspaperHealth;
        }

        return (
          <div
            key={zombie.id}
            className={cn(
              "absolute transition-transform duration-100 ease-linear flex flex-col items-center justify-center",
              {
                'animate-zombie-attack': zombie.isAttacking,
                'animate-zombie-hit': zombie.isHit,
                'animate-unit-die': zombie.isDying,
                'animate-zombie-walk': !zombie.isAttacking && !zombie.isDying && zombie.x < GRID_COLS - 0.1 && zombie.type !== '矿工僵尸', 
                'animate-miner-dig': zombie.type === '矿工僵尸' && zombie.minerState === 'DIGGING',
                'animate-miner-emerge': zombie.type === '矿工僵尸' && zombie.minerState === 'EMERGING',
              }
            )}
            style={{
              left: zombie.x * CELL_SIZE + visualXOffset,
              top: zombie.y * CELL_SIZE + visualYOffset,
              width: zombieData.imageWidth,
              height: zombieData.imageHeight,
              zIndex: zombie.isDying ? 15 : (zombie.type === '矿工僵尸' && (zombie.minerState === 'DIGGING' || zombie.minerState === 'EMERGING') ? 18 : 20), 
            }}
            title={`${zombieData.name} (生命值: ${zombie.health}${zombie.type === '报纸僵尸' && zombie.currentNewspaperHealth && zombie.currentNewspaperHealth > 0 ? ` / 报纸: ${zombie.currentNewspaperHealth}` : ''})`}
          >
            <RenderZombieSvg type={zombie.type} width={zombieData.imageWidth} height={zombieData.imageHeight} isEnraged={zombie.isEnraged} minerState={zombie.minerState}/>
            {!zombie.isDying && zombie.minerState !== 'DIGGING' && zombie.minerState !== 'PRE_DIGGING' && (
              <div className="w-full h-1 bg-gray-500 rounded-full mt-1 opacity-80 relative">
                {zombie.type === '报纸僵尸' && zombieData.newspaperHealth && zombie.currentNewspaperHealth !== undefined && zombie.currentNewspaperHealth > 0 && (
                    <div
                        className="absolute h-full bg-yellow-300 rounded-full"
                        style={{ width: `${(zombie.currentNewspaperHealth / zombieData.newspaperHealth) * 100}%`, zIndex:1 }}
                    />
                )}
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${(zombie.health / zombieData.health) * 100}%` }} 
                />
              </div>
            )}
          </div>
        );
      })}

      {projectiles.map(proj => {
        let projectileBaseClass = "absolute rounded-full";
        let projectileStyle: React.CSSProperties = {};
        let projectileSize = { width: 12, height: 12 }; 

        switch (proj.plantType) {
          case '豌豆射手':
          case '分裂豆': 
          case '胆小菇': 
            projectileBaseClass = cn(projectileBaseClass, "bg-green-500");
            projectileSize = { width: 14, height: 14 }; 
            break;
          case '电能豌豆射手':
            projectileBaseClass = cn(projectileBaseClass, "bg-blue-400");
            projectileSize = { width: 16, height: 16 };
            projectileStyle.boxShadow = "0 0 8px 3px rgba(59, 130, 246, 0.7)"; 
            break;
          case '闪电芦苇':
            projectileBaseClass = cn(projectileBaseClass, "bg-yellow-400 transform rotate-[30deg]");
            projectileSize = { width: 6, height: 18 }; 
            projectileStyle.boxShadow = "0 0 6px 2px rgba(250, 204, 21, 0.6)"; 
            break;
          case '辣椒投手':
            projectileBaseClass = cn(projectileBaseClass, "bg-orange-600");
            projectileSize = { width: 20, height: 20 }; 
            projectileStyle.boxShadow = "0 0 10px 4px rgba(239, 68, 68, 0.7)"; 
            
            const plantSource = plants.find(p => p.y === proj.lane && p.type === '辣椒投手');
            const startXPixel = proj.startX ? proj.startX * CELL_SIZE : (plantSource ? (plantSource.x + 0.7) * CELL_SIZE : proj.x * CELL_SIZE);
            const currentXPixel = proj.x * CELL_SIZE + CELL_SIZE / 2 - projectileSize.width / 2;
            const arcTotalDistancePixels = PEPPER_ARC_DISTANCE_CELLS * CELL_SIZE;
            
            let arcProgress = (currentXPixel - startXPixel) / arcTotalDistancePixels;
            arcProgress = Math.max(0, Math.min(1, arcProgress)); 

            const yOffset = Math.sin(arcProgress * Math.PI) * -(PEPPER_ARC_HEIGHT_CELLS * CELL_SIZE);
            projectileStyle.transform = `translateY(${yOffset}px)`;
            break;
          case '冰冻射手':
            projectileBaseClass = cn(projectileBaseClass, "bg-cyan-400");
            projectileSize = { width: 14, height: 14 };
            projectileStyle.boxShadow = "0 0 7px 2px rgba(103, 232, 249, 0.5)"; 
            break;
          case '火焰菇':
            projectileBaseClass = cn(projectileBaseClass, "bg-red-500"); 
            projectileSize = { width: 18, height: 18 }; 
            projectileStyle.boxShadow = "0 0 9px 4px rgba(249, 115, 22, 0.7)"; 
            break;
          case '仙人掌':
            projectileBaseClass = cn(projectileBaseClass, "bg-green-700");
            projectileSize = { width: 20, height: 8 }; 
            break;
          case '火葫芦':
            projectileBaseClass = cn(projectileBaseClass, "bg-orange-500");
            projectileSize = { width: 18, height: 18 };
            projectileStyle.borderRadius = "40% 60% 70% 30% / 30% 50% 50% 70%"; // Flame-like shape
            projectileStyle.boxShadow = "0 0 10px 3px rgba(255, 165, 0, 0.7)";
            break;
          case '声能柚子':
            projectileBaseClass = cn(projectileBaseClass, "border-2 border-sky-400 bg-sky-200/30");
            projectileSize = { width: 20, height: 20 };
            projectileStyle.borderRadius = "50%";
            projectileStyle.animation = "pulse-ring 1s infinite"; 
            break;
          case '火焰豌豆射手':
            projectileBaseClass = cn(projectileBaseClass, "bg-orange-500");
            projectileSize = { width: 15, height: 15 };
            projectileStyle.boxShadow = "0 0 8px 3px rgba(255, 120, 0, 0.7)";
            break;
          case '闪电豌豆射手':
            projectileBaseClass = cn(projectileBaseClass, "bg-yellow-300");
            projectileSize = { width: 16, height: 16 };
            projectileStyle.boxShadow = "0 0 9px 4px rgba(253, 224, 71, 0.8)";
            break;
          case '毒液豌豆射手':
            projectileBaseClass = cn(projectileBaseClass, "bg-purple-600");
            projectileSize = { width: 14, height: 14 };
            projectileStyle.boxShadow = "0 0 7px 2px rgba(147, 51, 234, 0.6)";
            break;
          default:
            projectileBaseClass = cn(projectileBaseClass, "bg-gray-400");
            break;
        }
        
        projectileStyle.width = projectileSize.width;
        projectileStyle.height = projectileSize.height;
        projectileStyle.left = proj.x * CELL_SIZE + CELL_SIZE / 2 - projectileSize.width / 2;
        projectileStyle.top = proj.y * CELL_SIZE + CELL_SIZE / 2 - projectileSize.height / 2;
        projectileStyle.zIndex = 25; 

        return (
          <div
            key={proj.id}
            className={projectileBaseClass}
            style={projectileStyle}
            title={`发射物 (${proj.plantType})`}
          />
        );
      })}
    </div>
  );
};

export default BattlefieldGrid;

