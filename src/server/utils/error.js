const checkTypes = (element, types, message) => {
  let match = false;
  Object.keys(types).forEach(type => {
    if(type === 'object') { // typeof is not correct because it doesn't know about the object/array difference
      match = typeof element === 'object' && !Array.isArray(element);
    }else if(type === 'array') { // typeof is not correct because it doesn't know about the object/array difference
      match = typeof element === 'object' && Array.isArray(element);
    }else if(typeof element === type) { // typeof is okay here
      match = true;
    }

    if(match)
      types[type](element);
  });

  if(!match)
    console.error(message);

  return match;
}

export {checkTypes};
