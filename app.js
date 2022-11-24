const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");
const bodyParser= require("body-parser");
const formidableMiddleware = require('express-formidable');



let para="";

//set storage engine
const yostorage = multer.diskStorage({
  destination: "./public/uploads/",

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//init upload
const upload = multer({
  storage: yostorage,
  limits: { fileSize: 10000000 },
  filefilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("nMyImage");

//check file type

function checkFileType(file, cb) {
  //Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;

  //check extension

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase);

  //check mimetype

  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error : Images only");
  }
}

//INIT APP
const app = express();

//EJS
app.set("view engine", "ejs");

//Public Folder
app.use(express.static(__dirname+"/public"));


//get
app.get("/", function (req, res) {
  res.render("index", { FOO: "BAR" , textname:"hahahha"});
});

//post
app.post("/upload", function (req, res) {
  console.log("aahh do it again");
  console.log(req.body);
  console.log(req.file);


  upload(req, res, function (err) {
    if (err) {
      res.render("index", { msg: err });
    } else {
      console.log(req.body);

      console.log(req.file);

      // res.send("test");

      if (req.file === undefined) {
        res.render("index", { msg: "Error : No file selected."});
      } else {
        res.render("index", {
          msg: "File uploaded",
          file: `uploads/${req.file.filename}`,
          textname:req.body.fname
        });
      }
    }
  });
});





const port = 3000;

app.listen(port, function (err) {
  if (err) {
    console.log("error");
  } else {
    console.log("listening at port " + `${port}`);
  }
});
