const differencesArray = (oldArray, newArray) =>{
    const addedElements = [];
    const removedElements = [];
    const allAffectedElementsSet = new Set();

    const set1 = oldArray.map(str => new Set(str.split(', ')));
    const set2 = newArray.map(str => new Set(str.split(', ')));
    
    set2.forEach((set, index) => {
      const added = [...set].filter(item => !set1[index].has(item));
      addedElements.push(added.join(', '));

      added.forEach(element => element !== "" && allAffectedElementsSet.add(element));
    });
  
    set1.forEach((set, index) => {
      const removed = [...set].filter(item => !set2[index].has(item));
      removedElements.push(removed.join(', '));
      removed.forEach(element => element !== "" && allAffectedElementsSet.add(element));
    });

    const allAffectedElements = [...allAffectedElementsSet];
  
    return {
      added: addedElements,
      removed: removedElements,
      allAffected: allAffectedElements,
    };
  }

  const mergeArrays = (array1, array2) => {
    const mergedArray = [...array1, ...array2];
    
    const uniqueArray = Array.from(new Set(mergedArray));
    
    return uniqueArray;
  }

  const getAddressFromArray = (addedArray, removedArray, address, timestamp) =>{
    const addedResult = addedArray.map(item => item.includes(address) ? timestamp.toString() : '');
    const removedResult = removedArray.map(item => item.includes(address) ? timestamp.toString() : '');
  
    return {
      started: addedResult,
      ended: removedResult,
    };
  }

  const timestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }

  const createEmptyArray = (length) =>{
    let empty=[]
    for (i=0;i<length;i++)
      empty.push("")
    return empty
  }

  const sortKeysAlphabetically = (jsonObj) => {
    if (typeof jsonObj !== 'object' || Array.isArray(jsonObj)) {
      throw new Error('Die Eingabe muss ein gültiges JSON-Objekt sein');
    }
  
    const sortedKeys = Object.keys(jsonObj).sort();
    const sortedJson = {};
  
    sortedKeys.forEach(key => {
      sortedJson[key] = jsonObj[key];
    });
    
    return sortedJson;
  }

  module.exports = {differencesArray, getAddressFromArray, timestampToDate, createEmptyArray, sortKeysAlphabetically, mergeArrays}