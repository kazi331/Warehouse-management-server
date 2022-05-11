const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middle wares
const cors = require("cors");
app.use(cors());
require("dotenv").config();
app.use(express.json()); // express js build in body parser

app.get("/", (req, res) => {
  res.send("Hello, Welcome!!");
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eityj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("inventory").collection("product");

    // create new product from client site with post method
    app.post("/newproduct", async (req, res) => {
      const newProduct = req.body;
      console.log("new user from client site:", newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // find all products from db
    app.get("/get-product", async (req, res) => {
      const query = {};   
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // find a sinlge product
    app.get("/product/:pid", async (req, res) => {
      const id = req.params.pid;
      const query = { _id: ObjectId(id) };
      const cursor = await productCollection.findOne(query);
      console.log(cursor);
      res.send(cursor);
    });
    // find my items product with supplier email 
    app.get('/my-items', async (req, res) => {
      const email = req.query.email;
      const query = {sEmail: email}
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
      console.log(req.query);
    })

    // delete a product
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`running at http://localhost:${port}`));
