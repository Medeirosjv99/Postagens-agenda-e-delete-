const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categorias")
const Categoria = mongoose.model("categorias")
require ("../models/Postagens")
const Postagem = mongoose.model("postagens")

router.get('/', function(req, res){
    res.render("admin/index")
})

router.get('/posts', function(req, res){
    res.send("Pagina de posts")
})

router.get('/categorias', function(req, res){
    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
    res.render("admin/categorias", { categorias: categorias })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        req.redirect("/admin")
    })
    
})

router.post('/categorias/nova', function(req, res){

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.modelo || typeof req.body.modelo == undefined || req.body.modelo == null){
        erros.push({texto: "Modelo da categoria é invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Este nome é muito curto"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
         const novaCategoria = {
        nome: req.body.nome,
        modelo: req.body.modelo
    }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id",(req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then(function(categoria){
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {

    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome= req.body.nome
        categoria.modelo= req.body.modelo

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria Editada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get('/categorias/add', function(req, res){
    res.render("admin/addcategorias")
})

router.post("/categorias/deletar", (req, res) => {
  Categoria.deleteOne({ _id: req.body.id }).then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria.");
      res.redirect("/admin/categorias");
    });
});

router.get("/postagens", (req, res) => {
  res.render("admin/postagens");
});

router.get("/postagens", (req, res) => {
    res.render("admin/postagens", {postagens: postagens})
}).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as postagens")
    res.redirect("/admin")
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
    res.render("admin/addpostagem", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário");
        res.redirect("/admin");
    })
})

router.post("/postagens/nova", (req, res) => {

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!")
            res.redirect("/admin/postagens")
        })
    }
})

module.exports = router 