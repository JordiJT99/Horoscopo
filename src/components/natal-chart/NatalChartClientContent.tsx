
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import type { Dictionary } from '@/lib/dictionaries';
import React, { useState } from 'react';
 
interface NatalChartClientContentProps {
  dictionary: Dictionary;
}

export default function NatalChartClientContent({ dictionary }: NatalChartClientContentProps) {
  // Check if dictionary and NatalChartPage properties exist
  if (!dictionary || !dictionary.NatalChartPage) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading or error...</div>;
  }

  const { title, underDevelopmentMessage, detailLevel: detailLevelDict, explanations } = dictionary.NatalChartPage;

  const [detailLevel, setDetailLevel] = useState<'basic' | 'advanced' | 'spiritual'>('basic');

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title={title} />

      <div className="flex justify-center mt-4">
        <label htmlFor="detailLevel" className="mr-2 self-center">{detailLevelDict.label}:</label>
        <select
          id="detailLevel"
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as 'basic' | 'advanced' | 'spiritual')}
          className="bg-card text-card-foreground border border-input rounded-md px-2 py-1 focus:ring-2 focus:ring-ring"
        >
          <option value="basic">{detailLevelDict.basic}</option>
          <option value="advanced">{detailLevelDict.advanced}</option>
          <option value="spiritual">{detailLevelDict.spiritual}</option>
        </select>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.sunTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.sun?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.moonTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.moon?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.ascendantTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.ascendant?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.personalPlanetsTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.personalPlanets?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.transpersonalPlanetsTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.transpersonalPlanets?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.housesTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.houses?.[detailLevel] || ''}
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle title={dictionary.NatalChartPage.aspectsTitle} />
        <p className="mt-2 text-foreground/80">
          {dictionary.NatalChartPage.explanations?.aspects?.[detailLevel] || ''}
        </p>
      </div>
      <p className="text-center mt-4">{underDevelopmentMessage}</p>
    </div>
  );
}
