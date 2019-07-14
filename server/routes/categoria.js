//dependencias
const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

//-------- RUTAS: categoria.js -----------//

//servicio para mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
    .populate('usuario', 'nombre email')
    .sort('descripcion')
        .exec((err, categorias) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
                
        })
});

//servicio para mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                message: 'El ID no es exite.'
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    }); 
});

//Servicio para crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Servicio para actualizar una categoría por ID.
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion 
    };    
    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators:true }, (err, categoriaDB) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //si todo está ok se devuelve el objeto categoria actualizado.
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});

//Servicio para borrar una categoria.
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        //si todo está ok se devuelve el objeto categoria actualizado.
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });    
});

module.exports = app;