import { StackdriverStatsExporter } from '@opencensus/exporter-stackdriver';
import { globalStats } from '@opencensus/core';

export default () => {
  const exporter = new StackdriverStatsExporter({
    projectId: 'atb-mobility-platform'
  });
  globalStats.registerExporter(exporter);
};
