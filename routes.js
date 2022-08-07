const express = require("express");
const router = express.Router();
const elastic = require("elasticsearch");
const { route } = require("express/lib/application");
const bodyParser = require("body-parser").json();

const elasticClient = elastic.Client({
  node: "https://1277.0.0.1:9200",
  // maxRetries: 50,
  // requestTimeout: 1000 * 60 * 120,
  auth: {
    // username: "elastic",
    // passowrd: "756+5gJ*GN0Vaw2B6u5O",
    apiKey: "YndWejRJQUItemdYbjA2VjhBR2o6Q2hSQUtJLTRSdUtKVG5jUzYwLW54Zw==",
  },
  // tls: {
  //   ca: fs.readFileSync("./http_ca.crt"),
  //   rejectUnauthorized: false,
  // },
});

// router.use((req, res, next) => {
//   elasticClient
//     .index({
//       index: "logs",
//       body: {
//         url: "https://127.0.0.1:9200",
//         method: req.method,
//       },
//     })
//     .then(() => {
//       console.log("Logs Indexed");
//     })
//     .catch((err) => {
//       console.error(`Error ${err.message}`);
//     });
//   next();
// });

let products = [
  {
    sku: "1",
    name: "Product-1",
    categories: ["a", "b", "c"],
    description: "Sample Product-1",
  },
  {
    sku: "2",
    name: "Product-2",
    categories: ["a", "b", "c"],
    description: "Sample Product-2",
  },
  {
    sku: "3",
    name: "Product-3",
    categories: ["x", "y", "z"],
    description: "Sample Product-3",
  },
  {
    sku: "4",
    name: "Product-4",
    categories: ["x", "y", "z"],
    description: "Sample Product-4",
  },
  {
    sku: "5",
    name: "Product-5",
    categories: ["p", "q", "r"],
    description: "Sample Product-5",
  },
];

router.post("/prodssucts", bodyParser, (req, res) => {
  console.log("here");
  elasticClient
    .index({
      index: "products",
      body: products,
    })
    .then((res) => {
      console.log("Products Indexed");
      return res.status(200).json({
        msg: "Products Indexed",
      });
    })
    .catch((err) => {
      console.error(`Error ${err.message}`);
      return res.status(500).json({
        msg: `Error ${err.message}`,
      });
    });
});

router.get("/product/:id", bodyParser, (req, res) => {
  let query = {
    index: "products",
    id: req.params.id,
  };
  elasticClient
    .get(query)
    .then((res) => {
      if (!res) {
        return res.status(404).json({
          product: res,
        });
      }
      return res.status(200).json({
        product: res,
      });
    })
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      return res.status(500).json({
        msg: `Error: ${err.message}`,
      });
    });
});

router.get("/products", bodyParser, (req, res) => {
  let query = {
    index: "products",
  };
  if (req.query.product) {
    query.q = `*{req.query.product}*`;
  }
  elasticClient
    .search(query)
    .then((res) => {
      return res.status(200).json({
        product: res.hits.hits,
      });
    })
    .catch((err) => {
      console.error(`Error ${err.message}`);
      return res.status(500).json({
        msg: `Error ${err.message}`,
      });
    });
});

module.exports = router;
