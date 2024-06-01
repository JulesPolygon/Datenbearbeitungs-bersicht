const { differencesArray, getAddressFromArray, timestampToDate, createEmptyArray, mergeArrays } = require("../utils");
const { sendToUsers } = require("./emailService");

const createDocument = async (admin, jsonData, index, owner, timestamp) => {
    try {
      const projectsCollection = admin.firestore().collection('projects');
  
      const documentRef = projectsCollection.doc(index.toString());

      const addressJson = {
        address: owner,
        timestamp: timestamp
      }

      const emptyArray= createEmptyArray(jsonData.idProProzess.length)
      const result = differencesArray(emptyArray, jsonData.idProProzess)

      await documentRef.set(addressJson);
      await documentRef.collection('json').doc(`${index.toString()}-${timestamp.toString()}`).set(jsonData)

      let emails = []


      for (i = 0; i< result.allAffected.length ; i++){
        const getUsers = getAddressFromArray(result.added, result.removed, result.allAffected[i], timestamp)
        const email = await createUserProjects(admin, result.allAffected[i], getUsers, index)
        email && emails.push(email)
      }

      const timestampString = timestampToDate(parseInt(timestamp)*1000)
      const jsonString = JSON.stringify(jsonData, null, 2);

      sendToUsers(jsonString, emails, jsonData.nameProjekt, timestampString, true)

    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const modifyDocument = async (admin, jsonData, index, timestamp, refresh) => {
    try {
      const projectsCollection = admin.firestore().collection('projects');
  
      const documentRef = projectsCollection.doc(index.toString());

      const jsonCollectionRef = documentRef.collection('json');
      const existingDocs = await jsonCollectionRef.get()

      let documentData

      let idToDelete 

      existingDocs.forEach(async (documentSnapshot) => {
        documentData = documentSnapshot.data()
        idToDelete = documentSnapshot.id
      })

      let result = differencesArray(documentData.idProProzess, jsonData.idProProzess)

      await documentRef.collection('json').doc(`${index.toString()}-${timestamp.toString()}`).set(jsonData)

      await jsonCollectionRef.doc(idToDelete).delete()

      let emails = []
      let remainingEmails = []

      for (i = 0; i< result.allAffected.length ; i++){
        const getUsers = getAddressFromArray(result.added, result. removed, result.allAffected[i], timestamp)
        let email = await createUserProjects(admin, result.allAffected[i], getUsers, index)
        email && emails.push(email)
      }

      if (refresh === true){
        const emptyArray= createEmptyArray(jsonData.idProProzess.length)
        const resultNew = differencesArray(emptyArray, jsonData.idProProzess)

        for (i = 0; i< resultNew.allAffected.length ; i++){
          let email = await getEmail(admin, resultNew.allAffected[i])
          email && remainingEmails.push(email)
        }
      }

      emails = mergeArrays(emails, remainingEmails)

      const timestampString = timestampToDate(parseInt(timestamp)*1000)
      const jsonString = JSON.stringify(jsonData, null, 2);

      sendToUsers(jsonString, emails, jsonData.nameProjekt, timestampString, false)

    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const getEmail = async(admin, address)=>{
    try {
      const usersCollectionRef = admin.firestore().collection('users');
  
      const querySnapshot = await usersCollectionRef.where('address', '==', address).get();
  
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];

        const email = docSnapshot.data().email
        return email
      }
      return
    }
    catch(err){
      return err
    }

  }

  const createUserProjects = async(admin, address, jsonData, index ) =>{
    try {
      const usersCollectionRef = admin.firestore().collection('users');

      const querySnapshot = await usersCollectionRef.where('address', '==', address).get();
  
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];

        const email = docSnapshot.data().email
  
        const projectsCollection = docSnapshot.ref.collection('projects');
  
        const existingDocument = await projectsCollection.doc(index.toString()).get();
  
        if (existingDocument.data()) {
          const existingData = existingDocument.data();

          let newDocumentData = existingData

          for (let i=0; i< newDocumentData.started.length; i++){
            if (!newDocumentData.started[i] && jsonData.started[i])
            newDocumentData.started[i] = jsonData.started[i]
          }

          for (let i=0; i<newDocumentData.ended.length; i++){
            if (!newDocumentData.ended[i] && jsonData.ended[i])
              newDocumentData.ended[i] = jsonData.ended[i]
          }

          
          await projectsCollection.doc(index.toString()).set(newDocumentData);

        } else {
          const newDocumentData = jsonData;

          await projectsCollection.doc(index.toString()).set(newDocumentData);
        }
        
        return email

      } else {
        return "error"
      }
    } catch (error) {
      console.error('Error:', error);
      return error
    }

  }

  const getAffectedUser = async (admin, address) => {
    try {
      const usersCollection = admin.firestore().collection('users');

      const jsonCollection = admin.firestore().collectionGroup('json')

      const jsonSnapshot = await jsonCollection.get();

      const querySnapshot = await usersCollection.where('address', '==', address).get();

      const docSnapshot = querySnapshot.docs[0];
      const userProjectsCollection = usersCollection.doc(docSnapshot.id).collection('projects')

      const userProjectsSnapshot = await userProjectsCollection.get()

      const affectedData = []

      const allData = []

      userProjectsSnapshot.forEach((documentSnapshot) => {
        const documentData = documentSnapshot.data();
          affectedData.push({id: documentSnapshot.id, ...documentData})
      });

      for (const documentSnapshot of jsonSnapshot.docs) {
        const documentData = documentSnapshot.data();

        const projectsRef = documentSnapshot.ref.parent.parent;
        const projectsDocSnapshot = await projectsRef.get();
        const projectData = projectsDocSnapshot.data()
        const timestamp = projectData.timestamp;

        const [index, ] = documentSnapshot.id.split('-');

        const findIndex = affectedData.findIndex((item) => item.id === index);

        if (findIndex !== -1){
          allData.push({id: documentSnapshot.id, timestamp: timestamp, ...documentData})
        }

      };

      return [allData, affectedData]
    }
    catch (error) {
      console.error('Error reading documents:', error);
    }
  }

  const getAffectedProcessor = async (admin, address) => {
    try {
        const projectsCollection = admin.firestore().collection('projects')

        const querySnapshot = await projectsCollection.where('address', '==', address).get();
        const allData = [];
        
        for (const documentSnapshot of querySnapshot.docs) {
          const documentData = documentSnapshot.data();
          const timestamp = documentData.timestamp;

          const jsonSubcollection = await projectsCollection.doc(documentSnapshot.id).collection('json').get();

          jsonSubcollection.forEach((jsonDocument) => {
            const documentData = jsonDocument.data()
            allData.push({id: jsonDocument.id, timestamp: timestamp, ...documentData })
          })
        }
        return allData
      }
    catch (error) {
      console.error('Error reading documents:', error);
      return error
    }

  }

  const getAllUsers = async (admin) =>{
    try {
      const usersCollection = admin.firestore().collection('users')

      const querySnapshot = await usersCollection.where('address', '!=', null).get()
      const allData = [];
      
      querySnapshot.forEach((documentSnapshot) => {
        const documentData = documentSnapshot.data()
        const addressData = documentData.address

        if (addressData)
          allData.push(addressData)
        })

      return allData
    }
    catch (error) {
      console.error('Error reading documents:', error);
      return error
    }
  }

  module.exports = {createDocument, getAffectedUser, getAffectedProcessor, getAllUsers, modifyDocument}