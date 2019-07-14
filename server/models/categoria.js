const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//defino los roles Válidos.
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let Schema = mongoose.Schema;
//Instancio el objecto Schema de Mongoose.
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
}); 

module.exports = mongoose.model('Categoria', categoriaSchema);