
"use client";

import type { FC } from 'react';
import { GameState } from '@/types';
import { Button } from '@/components/ui/button';
import { Award, Brain, Play, Pause, RotateCcw, Info, ShieldAlert, Trophy } from 'lucide-react'; // Added Brain
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface GameStatusDisplayProps {
  gameState: GameState;
  currentWave: number;
  totalWaves: number;
  onRestart: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
}

const GameStatusDisplay: FC<GameStatusDisplayProps> = ({ gameState, currentWave, totalWaves, onRestart, onTogglePause, isPaused }) => {
  if (gameState === 'Initializing') {
    return (
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
        <Info className="w-16 h-16 text-blue-400 mb-4 animate-pulse" />
        <p className="text-2xl font-bold text-white">家园保卫战即将开始...</p>
      </div>
    );
  }
  
  const showDialog = gameState === 'Won' || gameState === 'Lost';
  let title = "";
  let description = "";
  let Icon = null;

  if (gameState === 'Won') {
    title = "胜利！家园已保卫！";
    description = `太棒了！你成功抵御了全部 ${totalWaves} 波僵尸的疯狂进攻，守护了这片宁静的花园！你的智慧和勇气值得称赞！`;
    Icon = Trophy;
  } else if (gameState === 'Lost') {
    title = "防线失守...";
    description = `很遗憾，僵尸突破了你的防线...但不要灰心！总结经验，调整策略，下次一定能夺回我们的花园！`;
    Icon = Brain; // Changed from ShieldAlert to Brain
  }


  return (
    <>
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {gameState === 'Playing' && !isPaused && (
          <div className="bg-card/80 text-card-foreground p-2 px-3 rounded-md shadow-md text-sm">
            当前波数：{currentWave + 1} / {totalWaves}
          </div>
        )}
        <div className="flex gap-2">
            <Button onClick={onTogglePause} variant="secondary" size="icon" aria-label={isPaused ? "继续游戏" : "暂停游戏"}>
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
            <Button onClick={onRestart} variant="destructive" size="icon" aria-label="重新开始">
                <RotateCcw className="w-5 h-5" />
            </Button>
        </div>
      </div>

      <AlertDialog open={showDialog}>
        <AlertDialogContent className="bg-background border-primary shadow-xl">
          <AlertDialogHeader className="items-center">
            {Icon && <Icon className={`w-20 h-20 mb-4 ${gameState === 'Won' ? 'text-yellow-500' : 'text-destructive'}`} />}
            <AlertDialogTitle className="text-3xl font-bold">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-md text-center mt-2 text-foreground/90">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onRestart} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 w-full sm:w-auto">
              {gameState === 'Won' ? '再战一场！' : '重整旗鼓！'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       {isPaused && gameState !== 'Won' && gameState !== 'Lost' && ( 
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-40 backdrop-blur-sm">
          <Pause className="w-24 h-24 text-gray-300 mb-4" />
          <p className="text-4xl font-bold text-white">游戏已暂停</p>
          <p className="text-lg text-gray-200 mt-2">休息一下，思考你的下一步策略！</p>
          <Button onClick={onTogglePause} variant="secondary" size="lg" className="mt-8 text-xl px-8 py-3">
            <Play className="w-6 h-6 mr-2" /> 继续战斗
          </Button>
        </div>
      )}
    </>
  );
};

export default GameStatusDisplay;
