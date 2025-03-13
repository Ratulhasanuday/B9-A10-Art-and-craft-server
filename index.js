const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kjbuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const juteCraftCollections = client.db('uniceJuteCraftDB').collection('juteCraft');
    //create users database 
    const uniceUsers = client.db('uniceUsersDb').collection('users');
    //get data form claind 
    app.post('/juteCrafts', async (req, res) => {
      const juteCraft = req.body;
      console.log(juteCraft);
      const result = await juteCraftCollections.insertOne(juteCraft);
      res.send(result)
    })
    //get data by id form server
    app.get('/juteCrafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juteCraftCollections.findOne(query)
      res.send(result)
    });
    //get data form server
    app.get('/juteCrafts', async (req, res) => {
      const cursor = juteCraftCollections.find();
      const juteCrafts = await cursor.toArray();
      res.send(juteCrafts);
    })
    // Delete form  server 
    app.delete('/juteCrafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juteCraftCollections.deleteOne(query)
      res.send(result)
    })
    //update data form user
    app.put('/juteCrafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedCard = req.body
      const artCard = {
        $set: {
          name: updatedCard.name,

          photo: updatedCard.photo,
          subcategory: updatedCard.subcategory,
          processingTime: updatedCard.processingTime,
          rating: updatedCard.rating,
          price: updatedCard.price,
          userName: updatedCard.userName,
          userEmail: updatedCard.userEmail,
          details: updatedCard.details,
          customaization: updatedCard.customaization,
          stockStatus: updatedCard.stockStatus,
        }
      }
      const result = await juteCraftCollections.updateOne(query, artCard, options)
      res.send(result)
    })
    //user info post in database
   
    app.post('/users', async (req, res) => {
        const users = req.body;
        console.log("User data received:", users);
        const result = await uniceUsers.insertOne(users);
        res.send(result);
      });
      app.get('/users', async(req, res)=>{
        const cursor= uniceUsers.find()
        const result=await cursor.toArray(cursor)
        res.send(result)
      })
      app.get('/users/:email', async (req, res) => {
        const email = req.params.email.toLowerCase(); 
        console.log(`Fetching user with email: ${email}`); 
        const result = await uniceUsers.findOne({email})
        res.send(result)
      });
      
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Unice Jute and wooder craft server is running');
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

