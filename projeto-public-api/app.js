const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const { query, collection, orderBy, getDocs, limit } = require('firebase/firestore');
const serviceAccount = require('./bard-app-d299e-firebase-adminsdk-w63kf-e649ed2c3d.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'));

app.get("/", function(req, res){
    res.render("home")
})

app.get("/recomendacoes", async function(req, res){
    const recomendacao = await db.collection('recomendacoes').orderBy('timestamp', 'desc').limit(1).get()
    console.log(recomendacao)
    if (doc.exists) {
        res.render("recomendacoes", { recomendacao: doc.id, ...doc.data()  });
    } else {
        res.status(404).send("Recomendação não encontrado");
    }
    
});


app.post("/info", function(req, res){
    db.collection('informacoes').add({
        genero: req.body.genero,
        gosto: req.body.gosto,
        autor: req.body.autor,
        tipo: req.body.tipo,
        tema: req.body.tema
    }).then(async function(){
        console.log('Registro adicionado');
        
        const informacoesSnapshot = await db.collection('informacoes').get();
        const informacoes = [];

        informacoesSnapshot.forEach((info) => {
            informacoes.push({ id: info.id, ...info.data() });
        });

        const { default: Bard } = await import('bard-ai');
      
        const COOKIE = 'cwiE7nKHZYFVbS32suuKr-Z1h7zlq6_fIVe7WNfaTcRCF_r66AaKtcwJthr0qV1AHLkiUw.';
      
        const bard = new Bard(COOKIE);
    
        try {
            const prompt = `Preciso da recomendação de cinco livros para ler. Sabendo que:

            1. Meu gênero preferido é: ${informacoes[0].genero}
            2. Entre os livros que li e gostei estão: ${informacoes[0].gosto}
            3. Meu autor preferido é: ${informacoes[0].autor}
            4. Tenho preferência por livros ${informacoes[0].tipo}
            5. Gostaria que os livros abordassem ${informacoes[0].tema}
            
            Responda em formato json, conforme o exemplo a seguir: 
                                
            {
                "recomendacoes": {
                    "um": {
                        "titulo": 
                        "descricao":
                    },
                    "dois": {
                        "titulo": 
                        "descricao":
                    },
                    "tres": {
                        "titulo": 
                        "descricao":
                    },
                    "quatro": {
                        "titulo": 
                        "descricao": 
                    },
                    "cinco": {
                        "titulo": 
                        "descricao":
                    }
                }
            }
            
            A propriedade "titulo" deve conter Titulo e Autor, conforme o padrão: "Titulo" de "Autor". Atenção! Atente-se para que cada objeto tenha os atributos "titulo" e "descricao", sendo fiel ao padrão informado anteriormente. Procure indicar livros de autores diferentes. Retorne apenas os dados formatados em json, sem nenhum outro texto, exatamente como o padrão solicitado.`;
        
            // Solicita resposta do Bard
            const response = await bard.ask(prompt);

            // Seleciona apenas conteúdo json
            const jsonResponse = response.split("```")[1];
            
            // Recebe dados do primeiro item        
            let responseUm = jsonResponse.substring(jsonResponse.indexOf("um"), jsonResponse.indexOf("dois"));
            let tituloUm = responseUm.substring(responseUm.indexOf("titulo") + 9, responseUm.indexOf("descricao") - 5);
            let descricaoUm = responseUm.substring(responseUm.indexOf("descricao") + 12, responseUm.indexOf('}'));
            // Recebe dados do segundo item  
            let responseDois = jsonResponse.substring(jsonResponse.indexOf("dois"), jsonResponse.indexOf("tres"));
            let tituloDois = responseDois.substring(responseDois.indexOf("titulo") + 9, responseDois.indexOf("descricao") - 5);
            let descricaoDois = responseDois.substring(responseDois.indexOf("descricao") + 12, responseDois.indexOf('}'));
            // Recebe dados do terceiro item  
            let responseTres = jsonResponse.substring(jsonResponse.indexOf("tres"), jsonResponse.indexOf("quatro"));
            let tituloTres = responseTres.substring(responseTres.indexOf("titulo") + 9, responseTres.indexOf("descricao") - 5);
            let descricaoTres = responseTres.substring(responseTres.indexOf("descricao") + 12, responseTres.indexOf('}'));
            // Recebe dados do quarto item  
            let responseQuatro = jsonResponse.substring(jsonResponse.indexOf("quatro"), jsonResponse.indexOf("cinco"));
            let tituloQuatro = responseQuatro.substring(responseQuatro.indexOf("titulo") + 9, responseQuatro.indexOf("descricao") - 5);
            let descricaoQuatro = responseQuatro.substring(responseQuatro.indexOf("descricao") + 12, responseQuatro.indexOf('}'));
            // Recebe dados do quinto item  
            let responseCinco = jsonResponse.substring(jsonResponse.indexOf("cinco"));
            let tituloCinco = responseCinco.substring(responseCinco.indexOf("titulo") + 9, responseCinco.indexOf("descricao") - 5);
            let descricaoCinco = responseCinco.substring(responseCinco.indexOf("descricao") + 12, responseCinco.indexOf('}'));
            
            db.collection('recomendacoes').add({
                um: {
                    titulo: tituloUm,
                    descricao: descricaoUm
                },
                dois: {
                    titulo: tituloDois,
                    descricao: descricaoDois
                },
                tres: {
                    titulo: tituloTres,
                    descricao: descricaoTres
                },
                quatro: {
                    titulo: tituloQuatro,
                    descricao: descricaoQuatro
                },
                cinco: {
                    titulo: tituloCinco,
                    descricao: descricaoCinco
                },
                timestamp: new Date()

            })

            console.log("Recomendações criadas.");
            

        } catch (error) {
            console.error('Erro:', error);
        }
        res.redirect('/recomendacoes')
    })
})

app.listen(8080, function(){
    console.log("SERVIDOR ATIVO")
})