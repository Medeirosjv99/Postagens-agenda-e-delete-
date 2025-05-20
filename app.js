//Carregando os modulos
    const express = require('express')
    const { engine } = require('express-handlebars');
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    
//Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg   = req.flash("error_msg")
            next()
        })
    // Body Parser
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    //Handlebars
        app.engine('handlebars', engine({ defaultLayout: 'main' }));
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
            console.log("Conetado ao mongo")
        }).catch((err) => {
            console.log("Erro ao se conectar ao mongo")
        })
    //Public
    app.use(express.static(path.join(__dirname,"public")))
//Rotas
    app.use('/admin', admin)
//Outros
const PORT = 8082
app.listen(PORT,() => {
    console.log("Servidor rodando! ")
})