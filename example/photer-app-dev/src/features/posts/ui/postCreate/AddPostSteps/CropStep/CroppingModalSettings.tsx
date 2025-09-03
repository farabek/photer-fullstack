'use client';

import { Slider } from '@/shared/ui';
import { SettingControl } from './SettingControl';
import React from 'react';

type SettigsProps = {
  zoom: number;
  rotation: number;
  croppedViewSettings: {
    zoom: boolean;
    rotation: boolean;
    ratio: boolean;
  };
  aspectRatios: {
    label: string;
    value: number | null;
    icon: React.ReactNode;
  }[];
  onZoomChangeAction: (value: number) => void;
  onRotationChangeAction: (value: number) => void;
  onToggleSettingAction: (type: 'zoom' | 'rotation' | 'ratio') => void;
  onCropRatioChangeAction: (ratio: string) => void;
  currentCropRatio?: string;
};

export function CroppingModalSettings({
  zoom,
  rotation,
  croppedViewSettings,
  aspectRatios,
  onZoomChangeAction,
  onRotationChangeAction,
  onToggleSettingAction,
  onCropRatioChangeAction,
  currentCropRatio,
}: SettigsProps): React.ReactElement {
  return (
    <div className="flex justify-between gap-4">
      <SettingControl
        iconName="maximize"
        isActive={croppedViewSettings.zoom}
        onToggleAction={() => onToggleSettingAction('zoom')}
      >
        <Slider
          defaultValue={[0]}
          max={3}
          min={1}
          step={0.1}
          value={[zoom]}
          onValueChange={(e) => onZoomChangeAction(e[0])}
          className="w-[100px]"
        />
      </SettingControl>

      <SettingControl
        iconName="pause-circle-outline"
        isActive={croppedViewSettings.rotation}
        onToggleAction={() => onToggleSettingAction('rotation')}
      >
        <Slider
          defaultValue={[0]}
          min={0}
          max={360}
          value={[rotation]}
          onValueChange={(e) => onRotationChangeAction(e[0])}
          className="w-[100px]"
        />
      </SettingControl>

      <SettingControl
        iconName="expand-outline"
        isActive={croppedViewSettings.ratio}
        onToggleAction={() => onToggleSettingAction('ratio')}
        cardClassName="min-h-[152px] min-w-[152px] flex-col gap-2 p-2"
      >
        {aspectRatios.map(({ label, icon }) => (
          <button
            key={label}
            className={`group regular-text-16 inline-flex w-full justify-between border-0 px-3 focus:border-0 active:border-0 ${
              currentCropRatio === label
                ? 'text-accent-500'
                : 'text-light-900 focus:text-light-100 active:text-light-100'
            }`}
            onClick={() => onCropRatioChangeAction(label)}
          >
            <span>{label}</span>
            <span>{icon}</span>
          </button>
        ))}
      </SettingControl>
    </div>
  );
}
