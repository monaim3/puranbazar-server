const express = require('express');
const cors = require('cors');
const {  ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undrt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('puranbazar').collection('services');

        const bookingCollection = client.db('puranbazar').collection('booking');
        const usersCollection = client.db('puranbazar').collection('users');
        const addproductCollection=client.db('puranbazar').collection('addproduct');
        const advertiseCollection=client.db('puranbazar').collection('advertise');
        const wishlistCollection=client.db('puranbazar').collection('wishlist');
        
        app.get('/puranbazar', async (req, res) => {
            const query = {sold:false}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/puranb', async (req, res) => {
            const email=req.query.email
            const query = {email:email}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        
        //addService
        app.post('/puranbazar', async (req, res) => {
            const addservice = req.body;
            const result = await serviceCollection.insertOne(addservice);
            res.send(result);
        });
        app.post('/booking', async (req, res) => {
            const addservice = req.body;
            const result = await bookingCollection.insertOne(addservice);
            res.send(result);
        });
       //advertisement
       app.post('/advertise', async (req, res) => {
        const advertise = req.body;
        const result = await advertiseCollection.insertOne(advertise);
        res.send(result);
    });
    app.get('/advertise', async (req, res) => {
        const query = {}
            const cursor = advertiseCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
    });

    app.delete('/advertise', async (req, res) => {
         const email=req.query.email;
        const id = req.query.id;
        const  filter={productId:id}       
        const result = await advertiseCollection.deleteOne(filter);
        res.send(result);
    })
        app.get('/booking', async (req, res) => {
            const query = {}

            const cursor = bookingCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
      //userarea
        app.post('/users', async (req, res) => {
            const user = req.body;
             const query={email:user.email}
             const getuser=await usersCollection.findOne(query)
             if(!getuser){
               
                
                const result = await usersCollection.insertOne(user);
                res.send(result)
             }
             else{
                res.send(getuser)
             }
            
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = usersCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/verify', async (req, res) => {
            const email=req.query.email
            const query = {email: email}
            
            const cursor = await usersCollection.findOne(query);
            console.log(cursor);
            res.send(cursor);
        });
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/users/:id', async(req,res)=>{
            const sellar=req.body;
            const id=req.params.id;
            const filter={_id: ObjectId(id) };
            const options={upsert:true}
            const updateSellar={
                $set:{
                    varified:sellar.varified
                }
            }
            const result=await usersCollection.updateOne(
                filter,
                updateSellar,
                options
            )
            res.send(result)
        })
        // app.post('/addproduct',  async (req, res) => {
        //     const product = req.body;
        //     const result = await addproductCollection.insertOne(product);
        //     res.send(result);
        // });
        // app.get('/addproduct', async (req, res) => {
        //     const query = {}
        //     const cursor = addproductCollection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services);
        // });
        //admin buyar sellar
        app.get('/users/sellar/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user= await usersCollection.findOne(query)
           
            res.send({isSellar: user?.accountType ==="sellar"})
            console.log(user);
        })
        app.get('/users/buyer/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user= await usersCollection.findOne(query)
           
            res.send({isBuyer: user?.accountType ==="buyer"})
           
        })
        app.get('/users/sellar/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user= await usersCollection.findOne(query)
           
            res.send({isSellar: user?.accountType ==="sellar"})
          
        })
        app.get('/users/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user= await usersCollection.findOne(query)
           
            res.send({isAdmin: user?.accountType ==="Admin"})
          
        })
       // Delete api                                       
        app.delete('/puranb/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        //wishlist
        
       app.post('/wishlist', async (req, res) => {
        const wishlist = req.body;
        const result = await wishlistCollection.insertOne(wishlist);
        res.send(result);
    });

    app.get('/wishlist', async (req, res) => {
        const query = {}
        const cursor = wishlistCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });
    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('puranbazar server is running')
})

app.listen(port, () => {
    console.log(`puranbazar  server running on ${port}`);
})