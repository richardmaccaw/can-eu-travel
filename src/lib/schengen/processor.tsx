import { timelineToVisit, collectSchengenDays, windowStats, type Visit, type TimelineEntry } from './calculator';

export interface ProcessingResult {
  stats: {
    used: number;
    left: number;
    windowStart: number;
  };
  daysSet: Map<number, Record<string, unknown>>;
  visits: Visit[];
}

export class SchengenFileProcessor {
  public async processFile(file: File): Promise<ProcessingResult> {
    try {
      const text = await file.text();
      const jsonArray = JSON.parse(text) as TimelineEntry[];

      // Process visits
      const visits = Array.from(timelineToVisit(jsonArray));

      // Calculate days in Schengen
      const daysSet = await collectSchengenDays(visits);

      // Calculate statistics
      const dayArray = [...daysSet.keys()].sort((a, b) => a - b);
      const stats = windowStats(dayArray);

      return {
        stats,
        daysSet,
        visits
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to process file');
    }
  }

  public async validateFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const jsonArray = JSON.parse(text) as unknown;
      return Array.isArray(jsonArray);
    } catch {
      return false;
    }
  }

  public async getVisitSummary(visits: Visit[]): Promise<{
    totalVisits: number;
    totalDays: number;
    countries: Set<string>;
  }> {
    const daysSet = await collectSchengenDays(visits);
    const countries = new Set<string>();

    for (const country of daysSet.values()) {
      if (typeof country.name === 'string') {
        countries.add(country.name);
      }
    }

    return {
      totalVisits: visits.length,
      totalDays: daysSet.size,
      countries
    };
  }
}