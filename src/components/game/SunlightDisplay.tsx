"use client";

import type { FC } from 'react';
import { Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SunlightDisplayProps {
  sunlight: number;
}

const SunlightDisplay: FC<SunlightDisplayProps> = ({ sunlight }) => {
  return (
    <Card className="bg-accent/20 border-accent shadow-lg w-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-accent-foreground/80">Sunlight</CardTitle>
        <Sun className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-accent-foreground">{sunlight}</div>
      </CardContent>
    </Card>
  );
};

export default SunlightDisplay;
