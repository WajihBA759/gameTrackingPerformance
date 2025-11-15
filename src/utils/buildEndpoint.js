function buildEndpoint(endpoint, parameters = [], valuesObject = {}) {
  let url = endpoint;
  console.log('values:', valuesObject);

  parameters.forEach(param => {
    let name = param.name;
    console.log('Building endpoint, parameter:', name);
    let value = valuesObject[name];
    console.log('Value for parameter:', value);

    if (!value) {
      throw new Error(`Missing value for parameter: ${name}`);
    }

    url = url.replace(`{${name}}`, value);
  });
  console.log('Final built endpoint:', url);

  return url;
}

module.exports = { buildEndpoint };
