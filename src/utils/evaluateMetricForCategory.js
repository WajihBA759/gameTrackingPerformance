const axios = require('axios');
const buildEndpoint = require('./buildEndpoint').buildEndpoint;
const extractMetricPaths = require('./extractMetricPaths');
const metricLogic = require('./metricLogic');
const { groupByMetric } = require('./groupByMetric');
const getValueAtPath = require('./getValueAtPath');

/**
 * Evaluate one metric for one category (category has endpoint, headers, parameters)
 * - category: Category model
 * - metric: CategoryMetric model (has metricPath, logicType, groupBy, playerUnique)
 * - paramValues: object { paramName: value } used to build endpoint
 * - identifierForPlayer: the actual identifier value for the player (e.g. puuid value)
 *
 * Returns: single numeric/string value OR grouped object (if not playerUnique)
 */
async function evaluateMetricForCategory({ category, metric, paramValues = {}, identifierForPlayer = null }) {
  const finalUrl = buildEndpoint(category.endpoint, category.parameters || [], paramValues || {});
  const { data } = await axios.get(finalUrl, { headers: category.headers || {} });

  let value;

  if (metric.groupBy) {
    const matches = Array.isArray(data.data) ? data.data : [];

    // Aggregate across ALL matches, not just the first one
    const aggregated = {};

    for (const match of matches) {
      const grouped = groupByMetric(
        match,
        metric.metricPath,
        metric.groupBy,
        'none' // don't apply logic yet, just collect values
      );

      // Merge into aggregated
      for (const key in grouped) {
        if (!aggregated[key]) aggregated[key] = [];
        const val = grouped[key];
        if (Array.isArray(val)) {
          aggregated[key].push(...val);
        } else {
          aggregated[key].push(val);
        }
      }
    }

    // Now apply logicType to the aggregated results
    for (const key in aggregated) {
      const arr = aggregated[key];
      if (metric.logicType === 'sum') {
        aggregated[key] = arr.reduce((sum, v) => sum + v, 0);
      } else if (metric.logicType === 'avg') {
        aggregated[key] = arr.reduce((sum, v) => sum + v, 0) / arr.length;
      } else if (metric.logicType === 'count') {
        aggregated[key] = arr.length;
      } else {
        // 'none' - keep as array or first value
        aggregated[key] = arr.length === 1 ? arr[0] : arr;
      }
    }

    // Pick player's value if playerUnique
    if (metric.playerUnique) {
      if (!identifierForPlayer) return null;
      value = aggregated[identifierForPlayer] ?? 0;
    } else {
      value = aggregated;
    }
  } else {
    const func = metricLogic[metric.logicType] || metricLogic.none;
    value = func(data, metric.metricPath);
  }

  return { value, calledUrl: finalUrl, rawDataSample: undefined };
}



module.exports = evaluateMetricForCategory;
