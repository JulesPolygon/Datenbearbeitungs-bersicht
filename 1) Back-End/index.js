const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const http = require('http')
const cors = require('cors');
const { SiweMessage } = require('siwe')
require('dotenv').config()
const  { createDocument, getAffectedUser, getAffectedProcessor, getAllUsers, modifyDocument } = require( './services/databaseService.js')
const { fetchEntries, validateHash } = require( './controllers/validation.js')
const { ethers } = require("ethers");
const contractAbi = require('./abis/Proof.json')
const { CONTRACT_ADDRESS, CHAIN_ID } = require('./constants.js');
const serviceAccount = require('./service_account/datenbearbeitung-a41ca-firebase-adminsdk-66rv9-bfeafc42d8.json');

const app = express();
const port = 8000;
const server = http.createServer(app)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://datenbearbeitung-a41ca-default-rtdb.europe-west1.firebasedatabase.app"
});

const provider = new ethers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);

app.use(bodyParser.json());

if (process.env.TEST === "true")
  app.use(cors())


app.post('/api', async (req, res) => {
  try{
    const requestData = req.body.requestData;
    const signature = requestData.signature
    const message = new SiweMessage(requestData.message)

    const isValid = await message.verify({signature})

    const blockNumber = await provider.getBlockNumber();

    const block = await provider.getBlock(blockNumber);

    const dateBlock = new Date(parseInt(block.timestamp)*1000);

    const receivedDate = new Date(message.issuedAt)

    const diff = dateBlock.getTime() - receivedDate.getTime()

    const daysDifference = diff / (1000 * 3600 * 24);

    if (daysDifference > 1.0){
      throw new Error("error")
    }

    if (requestData.address == requestData.message.address && message.chainId === CHAIN_ID && isValid){
      const userType = await fetchEntries(requestData.address, admin)
      
      if (userType === 2){
        const dataProcessor = await getAffectedProcessor(admin, requestData.address)
        const users = await getAllUsers(admin)
        res.status(200).json({message:"Address is a data processor", jsonData: dataProcessor, users: users})
      }
      if (userType === 1){
        const [dataUser, affectedData] = await getAffectedUser(admin, requestData.address)

        res.status(200).json({message:"Address is a regular user", jsonData: dataUser, affectedData: affectedData})
      }
      if (userType === 0)
        res.status(400).json({message:"Error occured"})
    }
    else 
      res.status(400).json({message:"Error occured"})
  }
  catch(err){
    res.status(400).json({message:"Error occured"})
  }
});

app.post('/create', async(req, res) => {
  try{
    const requestData = req.body.requestData;

    const index = await contract.projectId()

    const [owner, hash, timestamp] = await contract.projectInfos(parseInt(index)-1)

    const hashBool = await validateHash(requestData, hash)

    if(!hashBool){
      throw(new Error("Error"))
    }
    else
      createDocument(admin, requestData.json, parseInt(index)-1, owner, timestamp)
      res.status(200).json({message:"Success"})
  }
  catch(err){
    res.status(400).json({message:"Error"})
  }
  
})

app.post('/update', async (req, res) => {
  try{
    const requestData = req.body.requestData;

    const [owner, hash, timestamp] = await contract.projectInfos(parseInt(requestData.index))

    if(!validateHash(requestData, hash))
      throw(new Error("Error"))
    else
      modifyDocument(admin, requestData.json, parseInt(requestData.index), timestamp, requestData.refresh)
    
    res.status(200).json({message:"Success", id:`${requestData.index}-${timestamp}`})
  }
  catch(err){
    res.status(400).json({message:"Error"})
  }
})


app.get('/', function(request, response) {
  response.send('App is live')
}) 

server.listen(port, function(){
  console.log(`listening on: ${port}`)
})
