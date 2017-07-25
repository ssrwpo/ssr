const checkTypes = (element, types, message, fatal = false) => {

  let match = false;

  types.forEach(type => {
    if(!match){
      if(type === 'object') { // typeof is not correct because it doesn't know about the object/array difference
        match = typeof element === 'object' && !Array.isArray(element) ? type : false;
      }else if(type === 'array') { // typeof is not correct because it doesn't know about the object/array difference
        match = typeof element === 'object' && Array.isArray(element) ? type : false;
      }else if(typeof element === type) { // typeof is okay here
        match = type;
      }
    }
  });

  if(!match)
    if(fatal)
      throw new TypeError(message);
    else
      console.error(message);

  return match;
}

export {checkTypes};
