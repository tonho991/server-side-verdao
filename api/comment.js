const express = require("express");
const app = express.Router();

const validator = require("validator");
const sanitizeHtml = require("sanitize-html")
const multer = require("multer")();

const Recaptcha = require("express-recaptcha").RecaptchaV2;
const recaptcha = new Recaptcha("6LfIrRgqAAAAAMWzrrgiW-EeckPfiItlps1-pguX", "6LfIrRgqAAAAAP54V_0Lt9HVBzO8-lfDEYp6UEgm");

function getGreetings() {
  let now = new Date();
  let hour = now.getHours();

  if (hour => 6 && hour < 12) {
    return "bom dia"
  } else if (hour >= 12 && hour < 18) {
    return "boa tarde"
  } else {
    return "boa noite"
  }
}

app.post("/", multer.none(), recaptcha.middleware.verify, async (req, res) => {

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  });


  if (req.recaptcha.error) {
    return res.send({
      success: false,
      error: "Recaptcha inválido."
    })
  }

  if (
    !req.body.nome ||
    !req.body.email ||
    !req.body.telefone ||
    !req.body.assunto ||
    !req.body.mensagem ||
    !req.body.departamento
  ) {
    return res.status(200).send({
      success: false,
      error: "Preencha todos os campos."
    })
  }

  const nome = sanitizeHtml(req.body.nome);
  const email = sanitizeHtml(req.body.email);
  const telefone = sanitizeHtml(req.body.telefone);
  const assunto = sanitizeHtml(req.body.assunto);
  const mensagem = sanitizeHtml(req.body.mensagem);
  const departamendo = sanitizeHtml(req.body.departamento);

  if (!validator.isEmail(email)) {
    return res.status(200).send({ success: false, error: "Email inválido." });
  }

  if (!validator.isMobilePhone(telefone, 'pt-BR')) {
    return res.status(200).send({ success: false, error: "Telefone inválido." });
  }


  const text = `
    Olá ${getGreetings()}! Meu nome é ${nome}.
    
    Meu email é *${email}*.

    Gostaria de falar com o departamendo de *${departamendo}}*.
    Meu assunto é sobre *${assunto}*.

    *Mensagem*: 
    
    ${mensagem}

    `;

  const url = `https://api.whatsapp.com/send?phone=5565993403335&text=${text}`

  res.send({
    success: true,
    url
  })

});

module.exports = app;