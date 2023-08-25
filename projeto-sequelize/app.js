const express = require("express")
const app = express()

const Sequelize = require("sequelize")
const sequelize = new Sequelize("exemplo", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso!")
}).catch(function(erro){
    console.log("Falha ao conectar: " + erro)
})

const Agendamentos = sequelize.define("agendamentos", {
    nome:{
        type: Sequelize.STRING
    },
    endereco:{
        type: Sequelize.STRING
    },
    bairro:{
        type: Sequelize.STRING
    },
    cep:{
        type: Sequelize.INTEGER
    },
    cidade:{
        type: Sequelize.STRING
    },
    estado:{
        type: Sequelize.STRING
    },
    observacao:{
        type: Sequelize.TEXT
    }
})

// Agendamentos.sync({force: true})

/* 
Agendamentos.create({
    nome: "Hideaki Fukami",
    endereco: "Rua Lagoa D'anta, 125",
    bairro:"Vila Cisper",
    cep: 3818030, 
    cidade: "São Paulo",
    estado:"São Paulo",
    observacao: "Realizar os serviços de alinhamento e balanceamento do meu veículo."
})
*/

app.get("/", function(req, res){
    res.send("Tela Inicial")
})

app.get("/cadastrar/:nome/:endereco/:bairro/:cep/:cidade/:estado/:observacao", function(req, res){
    Agendamentos.create({
        nome: req.params.nome,
        endereco: req.params.endereco,
        bairro: req.params.bairro,
        cep: req.params.cep,
        cidade: req.params.cidade,
        estado: req.params.estado,
        observacao: req.params.observacao
    })
    res.redirect("/")
})

app.listen(8081, function(){
    console.log("Servidor Web Carregado!")
})