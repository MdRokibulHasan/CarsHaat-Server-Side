const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lpvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('cars_haat');
        const usersCollectioin = database.collection('users');
        const productsCollectioin = database.collection('products');
        const ordersCollectioin = database.collection('orders');
        const reviewsCollectioin = database.collection('reviews');

        // users post api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollectioin.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollectioin.insertOne(user);
            res.json(result)

        });
        // update user
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollectioin.updateOne(filter, updateDoc);
            res.json(result);
        });

        // add order api
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollectioin.insertOne(order);
            res.json(result)

        });
        //order get api
        app.get('/order', async (req, res) => {

            const cursor = ordersCollectioin.find({});
            const order = await cursor.toArray();
            res.json(order);

        });

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await ordersCollectioin.deleteOne(query);
            res.json(result);
        })

        app.get('/products', async (req, res) => {

            const cursor = productsCollectioin.find({});
            const product = await cursor.toArray();
            res.send(product);

        });
        // add products api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollectioin.insertOne(product);
            res.json(result)

        });

        // user review POST API

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollectioin.insertOne(review);
            res.json(result)

        });

        app.get('/reviews', async (req, res) => {

            const cursor = reviewsCollectioin.find({});
            const review = await cursor.toArray();
            res.send(review);

        });

    }

    finally {
        // await client.close();

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Cars-Haat server!')
})

app.listen(port, () => {
    console.log(` listening at${port}`)
})