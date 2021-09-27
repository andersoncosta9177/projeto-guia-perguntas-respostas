const { raw } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connection = require("./database/database")
const PerguntaModel = require("./database/Pergunta")
const Resposta = require("./database/Resposta")
//database


connection
.authenticate()
.then( ()=>{
    console.log("conexao feita com sucesso")
})
.catch( (msgErro)=>{
    console.log(msgErro)
})



app.use(express.urlencoded({extended: false}))
app.use(express.json())


//express use o EJS  como view engine
app.set('view engine','ejs')
app.use(express.static('public'))



app.get("/", (req,res)=>{
    PerguntaModel.findAll({raw:true, order: [
        ['id','DESC']
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        })
    })  
})





app.get("/perguntar", (req,res)=>{
    res.render("perguntar")
})


app.post("/salvarPergunta", (req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao
    PerguntaModel.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })

})


app.get("/pergunta/:id", (req,res)=>{
    var id = req.params.id
    PerguntaModel.findOne({
        where:{id:id}
    }).then(pergunta =>{
        if(pergunta != undefined){

            Resposta.findAll({
                where :{perguntaId:  pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas =>{

                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas :respostas
                })

            })
        

        }else{
            res.redirect('/')

        }
    })
})



app.post("/responder" ,(req,res)=>{
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then( ()=>{
        res.redirect("/pergunta/"+perguntaId)

    })

})


app.listen(1337, ()=>{
    console.log("servidor rodando na maior tranquilidade! 🖥 😎")
})