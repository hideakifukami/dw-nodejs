const express = require("express")
const app = express()

app.get("/", function(req, res){
    res.send("Seja Bem-vindo ao NodeJS")
})

app.get("/contato", function(req, res){
    res.send("Página de Contato")
})

app.get("/produtos/:item/:qtd", function(req, res){
    res.send("Item: " + req.params.item + "<br> Quantidade: " + req.params.qtd)
})

app.listen(8081, function() {
    console.log("Servidor Rodando na Porta 8081")
})