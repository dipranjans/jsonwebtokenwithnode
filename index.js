const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

// parser application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Node.js with jsonwebtoken!");
});

const Secrect = "heymynameisdipranjan";

//first authenticate the user to access all the url
app.post("/authenticate", (req, res) => {
  if (req.body.username === "dipranjan") {
    if (req.body.password === "123") {
      const token = jwt.sign({ check: true }, Secrect, { expiresIn: 1440 });
      res.json({ message: "authentication done", token });
    } else {
      res.json({ message: "please check your password!" });
    }
  } else {
    res.json({ message: "user not found!" });
  }
});

const ProtectedRoutes = express.Router();

app.use("/api", ProtectedRoutes);

ProtectedRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["access-token"];

  //decode token
  if (token) {
    //verifies secret and checks exp
    jwt.verify(token, Secrect, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authentcate token."
        });
      } else {
        //if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //if there is no token return an error
    return res.status(403).send({
      message: "No Token Provided."
    });
  }
});

ProtectedRoutes.get("/getAllProducts", (req, res) => {
  let products = [
    {
      id: 1,
      name: "cheese"
    },
    {
      id: 2,
      name: "carrotes"
    }
  ];
  res.json(products);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
