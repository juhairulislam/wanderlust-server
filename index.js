const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const { MongoClient, ServerApiVersion, deserialize } = require('mongodb');
dotenv.config()

const uri =process.env.MONGODB_URI ;


const app = express()
const port =process.env.PORT

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();


    const db = client.db("wanderlust") 


    const destinationCollection  = db.collection("destination") ;

    app.get('/destination' , async (req, res) =>{

        const result =await destinationCollection.find().toArray() ;

        res.json(result) ;
    })


    app.post('/destination' ,async (req, res) =>{

        const destinationData=  req.body 

       const result = await destinationCollection.insertOne(destinationData) 

       res.json(result)

    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
