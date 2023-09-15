const db = require("./banco")

const Agendamentos = db.sequelize.define("Agendamentos", {
    nome:{
        type: db.Sequelize.STRING
    },
    
    endereco:{
        type: db.Sequelize.STRING
    },
    
    bairro:{
        type: db.Sequelize.STRING
    },
    
    cep:{
        type: db.Sequelize.STRING
    },
})

// Agendamentos.sync({force:true})

module.exports = Agendamentos
