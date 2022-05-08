const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const PORT = process.env.PORT || 4000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyofd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);



async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("carDb1").collection("cars");


        // post item
        app.post('/item', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item)
            res.send(result)
        })

        // get all item

        app.get('/item', async (req, res) => {
            const result = await itemCollection.find({}).toArray()
            res.send(result).status(200)
        })

        //get item by id

        app.get('/myitem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.findOne(query)
            res.send(result);
        })

        // delete an item
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.deleteOne(query)
            res.send(result);

        })

        // get specific users item
        app.get('/item', async (req, res) => {
            const email = req.query.email;
            const query = { supplierEmail: email }
            const result = await itemCollection.find(query).toArray()
            res.send(result).status(200)
        })

        //update quantity
        app.patch('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body.amount;

            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity
                }
            };
            const result = await itemCollection.updateOne(query, updatedDoc, options);
            res.send(result);

        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('heroku connected successfully');
})

// server run

app.listen(process.env.PORT || PORT, () => {
    console.log('server started');
})