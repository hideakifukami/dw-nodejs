import Bard from 'bard-ai';

const COOKIE = 'cwiE7voe9e2IToLGZt8GBpEnLrMp-qON-1taOoOzGI6Mxr88KtVx9U49DUBzv8Isz0Y69w.';

const bard = new Bard(COOKIE);

async function askBard() {
  try {
    const response = await bard.ask('Qual o sentido da vida?');
    console.log(response);
  } catch (error) {
    console.error('Erro:', error);
  }
}

askBard();


const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./bard-app-d299e-firebase-adminsdk-w63kf-e649ed2c3d.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/consulta", function(req, res){
    var agendamentos = [];
    db.collection('agendamentos').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                agendamentos.push({ id: doc.id, ...doc.data() });
            });
            res.render("consulta", { agendamento: agendamentos });
        })
        .catch((error) => {
            console.error("Erro ao consultar agendamentos: ", error);
        });
})

app.post("/cadastrar", function(req, res){
    db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Registro adicionado');
        res.redirect('/')
    })
})

app.get("/editar/:id", function(req, res){
    var id = req.params.id;
    db.collection('agendamentos').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                res.render("editar", { agendamento: doc.data(), id: id });
            } else {
                res.status(404).send("Agendamento não encontrado");
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar agendamento para edição: ", error);
        });
})

app.get("/excluir/:id", function(req, res){
    var id = req.params.id;
    db.collection('agendamentos').doc(id).delete()
        .then(() => {
            console.log("Agendamento excluído com sucesso");
            res.redirect("/consulta");
        })
        .catch((error) => {
            console.error("Erro ao excluir agendamento: ", error);
        });
})

app.post("/atualizar", function(req, res){
    var id = req.body.id;
    var updatedData = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    };
    db.collection('agendamentos').doc(id).update(updatedData)
        .then(() => {
            console.log("Agendamento atualizado com sucesso");
            res.redirect("/consulta");
        })
        .catch((error) => {
            console.error("Erro ao atualizar agendamento: ", error);
        });
})

app.listen(8080, function(){
    console.log("SERVIDOR ATIVO")
})