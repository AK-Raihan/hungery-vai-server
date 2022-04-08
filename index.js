const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();


const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9idnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log('database connected')
        const database = client.db('hungary_food');
        const productsCollection = database.collection('products');
        const foodCollection = database.collection('food');
        const orderCollection = database.collection('order');

        // get product api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // get food api
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const food = await cursor.toArray();
            res.send(food);
        });

        // single product get api
        app.get("/singleProduct/:id", async (req, res) => {
        const result = await productsCollection.find({ _id: ObjectId(req.params.id) })
          .toArray();
        res.send(result[0]);
       });

      // cofirm order post
        app.post("/confirmOrder", async (req, res) => {
        console.log(req.body);
        const result = await orderCollection.insertOne(req.body);
        res.send(result);
      });

       // get orders api
      app.get('/myOrder', async(req, res)=>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
      });

      // my orders
    app.get('/myOrder/:email', async(req, res)=>{
      const result = await orderCollection.find({ email: req.params.email})
      .toArray();
      console.log(result);
      res.send(result);
    });

     // deleted order
    app.delete("/delteOrder/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({_id: ObjectId(req.params.id),});
      res.send(result);
    });






    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello, Welcome to hungary-vai')
})

app.listen(port, () => {
  console.log(`Hungry vai app listening at : ${port}`)
})