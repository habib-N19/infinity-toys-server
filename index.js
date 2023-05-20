const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(express.json())
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))


app.get('/', (req, res) => {
    res.send('Infinity Toy server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufcjidc.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        const toyCollection = client.db('infinityToys').collection('toys')
        // getting all toys from db 
        app.get('/allToys', async (req, res) => {
            // making a cursor to run a find 
            const cursor = toyCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // getting a single toy info
        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id
            // finding the matched id in the db and send it via response
            const query = { _id: new ObjectId(id) }
            const options = {

                projection: { photo: 1, name: 1, sellerName: 1, sellerEmail: 1, price: 1, rating: 1, quantity: 1, details: 1 },
            };
            const result = await toyCollection.findOne(query, options)
            res.send(result)
        })
        // sending date specific to a user
        app.get('/myToys', async (req, res) => {
            const email = req.query.email
            console.log(email);
            const query = { email: email }
            console.log(query);
            const cursor = toyCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // deleting a item based on id
        app.get('/myToys', async (req, res) => {
            const id = req.body.id
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })
        // adding new toys to db
        app.post('/addToy', async (req, res) => {
            const toy = req.body
            console.log(toy);
            const result = await toyCollection.insertOne(toy)
            res.send(result)
        })
        // deleting a specific toy data with id 
        app.delete('/myToys', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`server is listening at port: ${port}`);
})