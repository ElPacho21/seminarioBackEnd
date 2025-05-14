const Category = require('../models/Category.model')

class CategoryDao {
    constructor() {

    }

    async insertOne(category) {
        try {
            const newCategory = await Category.create(category)
            return newCategory
        } catch (error) {
            console.error('Error al crear categoria:', error.message)
            throw new Error('Error al crear categoria:', error.message)
        }
    }

    async findAll() {
        try {
            const categories = await Category.find()
            return categories
        } catch (error) {
            console.error('Error al obtener categorias:', error.message)
            throw new Error('Error al obtener categorias:', error.message)
        }
    }

    async updateById(id, category){
        try{
            const updatedCategory = await Category.findByIdAndUpdate(id, category)
            return updatedCategory
        }catch(error){
            console.error('Error al modificar categoria:', error.message)
            throw new Error('Error al modificar categorias:', error.message)
        }
    }


    async deleteById(id) {
        try {
            console.log(`Categoria con id ${id} se eliminó`)
            return await Category.findByIdAndDelete(id)
        } catch (error) {
            console.error(`Error al eliminar Categoria con id ${id}:`, error.message)
            throw new Error(`Error al eliminar Categoria con id ${id}:`, error.message)
        }
    }
}

module.exports = CategoryDao