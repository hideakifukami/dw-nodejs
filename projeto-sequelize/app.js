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