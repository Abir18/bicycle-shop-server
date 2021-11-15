const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mongodb Configaration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8vsmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('database connected');

    const database = client.db('bicycle_shop');
    const bikesCollection = database.collection('bikes');
    const ordersCollection = database.collection('orders');

    // GET All Bikes
    app.get('/bikes', async (req, res) => {
      const cursor = bikesCollection.find({}).limit(10);
      const result = await cursor.toArray();
      res.json(result);
    });

    // GET a Single Bike
    app.get('/bikes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikesCollection.findOne(query);
      res.json(result);
    });

    // GET All Orders of a Specific USer
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      console.log(req.query);
      const query = { email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // POST Orders
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // Delete Order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Bicycle Shop Server');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
