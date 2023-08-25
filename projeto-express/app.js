const express = require("express")
const app = express()

app.use("/img",  express.static(__dirname + "/html/img"));



app.get("/", function(req, res){
    res.send("Seja Bem-vindo ao NodeJS")
})

app.get("/contato", function(req, res){
    res.send("Página de Contato")
})

app.get("/texto", function(req, res){
    res.send("Página de Texto")
})

app.get("/index", function(req, res){
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/produtos/:item/:qtd", function(req, res){
    res.send("Item: " + req.params.item + "<br> Quantidade: " + req.params.qtd)
})

app.get("/produtos/:item", function(req, res){
    res.send("Item: " + req.params.item)
})

app.listen(8081, function() {
    console.log("Servidor Rodando")
})