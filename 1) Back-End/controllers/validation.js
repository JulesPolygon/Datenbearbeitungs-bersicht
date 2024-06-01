const { sortKeysAlphabetically } = require("../utils");
const { ethers } = require("ethers");

const fetchEntries = async (address, admin) => {
    try {
      const accountsCollection = admin.firestore().collection('accounts');

      const querySnapshot = await accountsCollection.where('entities', 'array-contains', address).get();
  
      if (!querySnapshot.empty) {
        return 2
      } 
      else {
        return 1
      }
    } catch (error) {
      console.error('Error:', error);
      return 0
    }
  };

  const validateHash = async(requestData, hash) =>{
    try{    
      const data = requestData.json

      const sortedData = sortKeysAlphabetically(data)

      const jsonString = JSON.stringify(sortedData);

      const calculatedHash = ethers.keccak256(ethers.toUtf8Bytes(jsonString))

      if (calculatedHash !== hash )
        throw new Error("Error")
      }
    catch(err){
      return false
    }

    return true
  }


  module.exports = {fetchEntries, validateHash}