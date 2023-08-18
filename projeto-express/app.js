const express = require("express")
const app = express()

app.get("/", function(req, res){
    res.send("Seja Bem-vindo ao NodeJS")
})

app.listen(8081, function() {
    console.log("Servidor Rodando na Porta 8081")
})