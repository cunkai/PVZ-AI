
"use client";

import type { FC } from 'react';
import { GameState } from '@/types';
import { Button } from '@/components/ui/button';
import { Award, Frown, Play, Pause, RotateCcw, Info } from 'lucide-react';
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
        <p className="text-2xl font-bold text-white">游戏初始化中...</p>
      </div>
    );
  }
  
  const showDialog = gameState === 'Won' || gameState === 'Lost';
  const title = gameState === 'Won' ? "你赢了！" : (gameState === 'Lost' ? "游戏结束" : "");
  const description = gameState === 'Won' 
    ? `恭喜你！你成功抵御了全部 ${totalWaves} 波僵尸的进攻！`
    : (gameState === 'Lost' ? "僵尸吃掉了你的脑子！下次好运。" : "");
  const Icon = gameState === 'Won' ? Award : (gameState === 'Lost' ? Frown : null);

  return (
    <>
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {gameState === 'Playing' && !isPaused && (
          <div className="bg-card/80 text-card-foreground p-2 px-3 rounded-md shadow-md text-sm">
            波数：{currentWave + 1} / {totalWaves}
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
            {Icon && <Icon className={`w-16 h-16 mb-4 ${gameState === 'Won' ? 'text-yellow-500' : 'text-destructive'}`} />}
            <AlertDialogTitle className="text-3xl">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onRestart} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3">
              再玩一次
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       {isPaused && gameState !== 'Won' && gameState !== 'Lost' && ( // Only show pause overlay if game is not over
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-40 backdrop-blur-sm">
          <Pause className="w-24 h-24 text-gray-300 mb-4" />
          <p className="text-4xl font-bold text-white">已暂停</p>
          <Button onClick={onTogglePause} variant="secondary" size="lg" className="mt-6 text-xl">
            <Play className="w-6 h-6 mr-2" /> 继续
          </Button>
        </div>
      )}
    </>
  );
};

export default GameStatusDisplay;
