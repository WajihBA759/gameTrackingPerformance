function getValueAtPath(obj, path) {
  console.log('------------obj:  ',obj);
  console.log('------------path:  ',path);
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null) return undefined; // stop if value doesn’t exist

    // If current value is an array, extract that key from all items
    if (Array.isArray(current)) {
      current = current.map(item => item[key]);
    } else {
      current = current[key];
    }
  }

  return current;
}

module.exports = getValueAtPath;
