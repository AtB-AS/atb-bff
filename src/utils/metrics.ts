import { StackdriverStatsExporter } from '@opencensus/exporter-stackdriver';
import { globalStats } from '@opencensus/core';

export default (projectId: string) => {
  const exporter = new StackdriverStatsExporter({
    projectId,
    period: 120 * 1000
  });
  globalStats.registerExporter(exporter);
};
