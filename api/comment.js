const express = require("express");
const app = express.Router();
const fs = require("fs");
const multer = require("multer")();
const Recaptcha = require("express-recaptcha").RecaptchaV2; 
const recaptcha = new Recaptcha("6LfIrRgqAAAAAMWzrrgiW-EeckPfiItlps1-pguX", "6LfIrRgqAAAAAP54V_0Lt9HVBzO8-lfDEYp6UEgm");

app.post("/comment", multer.none(), recaptcha.middleware.verify, async (req, res) => {

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  });


  if (req.recaptcha.error) {
    return res.send("Falha na validacao do reCAPTCHA.")
  }

  let comments = fs.readFileSync("./comments.json", "UTF-8");
  comments = JSON.parse(comments);

  if (
    !req.body.nome ||
    !req.body.email ||
    !req.body.telefone ||
    !req.body.assunto ||
    !req.body.mensagem
  ) {
    return res.status(200).send("Preencha todos os campos.")
  }

  const data = req.body;

  for(let i = 0; i < data.length; i++){
    if(data[i].trim() === "") return res.send("Preencha todos os campos.")
  }

  comments.push(req.body);
  fs.writeFileSync("./data/comments.json", JSON.stringify(comments, null, 4));

  res.status(200).send("Comentário enviado com sucesso!");
});

module.exports = app;