const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())// alternative of body parser

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74aai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("happy-resort-101");
        const roomsCollection = database.collection("rooms");
        const ordersCollection = database.collection("orders");

        console.log('database connected');
        // GET API
        app.get('/rooms', async (req, res) => {
            const cursor = roomsCollection.find({}).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET API With
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await roomsCollection.findOne(query);
            console.log(result);
            res.send(result);
        })


        // POST API
        app.post('/rooms', async (req, res) => {
            console.log('hiting users api', req.body);
            const newRoom = req.body;
            const result = await roomsCollection.insertOne(newRoom);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        // DELETE API
        app.delete('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await roomsCollection.deleteOne(query);
            console.log(result);
            res.send(result)
        })

        //Orders
        // POST API
        app.post('/orders', async (req, res) => {
            console.log('hiting orders api', req.body);
            const newOrder = req.body;
            const result = await roomsCollection.insertOne(newOrder);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})