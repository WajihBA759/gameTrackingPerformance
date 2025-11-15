/**
 * Recursively extracts all possible metric paths from a JSON object.
 * Handles nested objects and arrays (without including [0], [1], etc.)
 *
 * @param {Object|Array} obj - The JSON object or array to explore
 * @param {String} currentPath - Internal use; accumulates path as recursion deepens
 * @param {Number} depth - Maximum depth to explore
 * @param {Number} currentDepth - Internal use; current recursion depth
 * @returns {String[]} Array of discovered metric paths
 */
function extractMetricPaths(obj, currentPath = '', depth = 3, currentDepth = 0) {
  const results = [];

  if (currentDepth >= depth || obj == null) {
    return results;
  }

  // If the object is an array explore its first element
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      results.push(...extractMetricPaths(obj[0], currentPath, depth, currentDepth + 1));
    }
    return results;
  }

  // If it’s a plain object explore its keys
  if (typeof obj === 'object') {
    for (const key in obj) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const value = obj[key];
        // If the value is another object/array  recurse into it
      if (typeof value === 'object' && value !== null) {
        results.push(...extractMetricPaths(value, newPath, depth, currentDepth + 1));
      } else {
        results.push(newPath);
      }
    }
  }

  return results;
}

module.exports = extractMetricPaths;
