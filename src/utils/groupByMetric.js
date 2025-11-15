const getValueAtPath = require('./getValueAtPath');

function groupByMetric(data, valuePath, groupPath, logicType) {
  const valueArray = getValueAtPath(data, valuePath);
  const groupArray = getValueAtPath(data, groupPath);

  if (!Array.isArray(valueArray) || !Array.isArray(groupArray)) return {};

  const results = {};

  // Build groups: each unique key in groupArray will hold its corresponding values
  for (let i = 0; i < groupArray.length; i++) {
    const key = groupArray[i];
    const item = valueArray[i];
    const val = item?.value ?? item ?? 0;

    if (!results[key]) results[key] = [];
    results[key].push(val);
  }

  // Apply logic type to each group
  for (const key in results) {
    const arr = results[key];

    if (logicType === 'sum') {
      let sum = 0;
      for (const v of arr) sum += v;
      results[key] = sum;
    } 
    else if (logicType === 'avg') {
      let sum = 0;
      for (const v of arr) sum += v;
      results[key] = sum / arr.length;
    } 
    else if (logicType === 'count') {
      results[key] = arr.length;
    }
  }

  return results;
}

module.exports = { groupByMetric };
