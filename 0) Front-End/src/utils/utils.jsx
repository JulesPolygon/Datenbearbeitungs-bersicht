export const httpPostRequest = async (apiUrl, requestData) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestData }),
    });


    if (response.ok) {
      const responseData = await response.json(); 

      return responseData
    } else {
      return false
    }

  } catch (error) {
    console.error('Error:', error.message);
    return false
  }
};

export const sortKeysAlphabetically = (jsonObj) => {
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

export const shortenString = (str) =>{
if (!str) return
return str.toString().substring(0,5) + "..." + str.toString().substring(str.toString().length - 5, str.toString().length).toUpperCase()
}

export const convertStringToArray = (str)=>{
const arrayFromString = str.split(/\s*,\s*/);
return arrayFromString
}

export const timestampToDate = (timestamp) => {
const date = new Date(timestamp);
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear();

return `${day}.${month}.${year}`;
}

export const isArrayEmpty = (array) => {
return array.every(item => item === '');
}

export const areArraysFull = (array1, array2) => {
if (array1.length !== array2.length) {
  return false;
}

for (let i = 0; i < array1.length; i++) {
  if (array1[i] === '' || array2[i] === '') {
    return false;
  }
}

return true;
}