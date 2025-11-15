const getValueAtPath = require('./getValueAtPath');

// Define different ways to evaluate a metric
const metricLogic = {
  //count how many items are in an array
  count: (data, path) => {
    const value = getValueAtPath(data, path);
    if (Array.isArray(value)) {
      return value.length;
    }
    return 0;
  },

  //sum numeric values in an array of objects
  sum: (data, path) => {
    const value = getValueAtPath(data, path);
    if (!Array.isArray(value)) return 0;

    let total = 0;
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      // add item.value if it exists, else add 0
      total += item && typeof item.value === 'number' ? item.value : 0;
    }
    return total;
  },

  //calculate the average of numeric values
  avg: (data, path) => {
    const value = getValueAtPath(data, path);
    if (!Array.isArray(value) || value.length === 0) return 0;

    let total = 0;
    let count = 0;
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (item && typeof item.value === 'number') {
        total += item.value;
        count++;
      }
    }
    return count === 0 ? 0 : total / count;
  },

  //just return the raw value at the path (no calculation)
  none: (data, path) => {
    return getValueAtPath(data, path);
  }
};

module.exports = metricLogic;
