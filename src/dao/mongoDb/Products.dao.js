const Product = require('../models/Products.model')

class ProductDao {
    constructor() {

    }
    async findAll() {
        try {
            return await Product.find()
        } catch(error){
            console.error('Error al obtener productos:', error.message)
            throw new Error('Error al obtener productos:', error.message)
        }
    }

    async findById(id){
        try {
            return await Product.findOne({_id: id})
        } catch(error){
            console.error(`Error al obtener producto con id ${id}:`, error.message)
            throw new Error(`Error al obtener producto con id ${id}:`, error.message)
        }
    }

    async insertOne(product){
        try {
            const {title, description, code, price, status = true, stock, category, thumbnails} = product;

            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error('Faltan campos del producto por rellenar');
            }

            const duplicatedProduct = await Product.findOne({ code: product.code})
            if(duplicatedProduct){
                throw new Error(`El producto con código ${code} ya existe`)
            }

            const st = JSON.parse(status)
            
            const thumb = thumbnails.filter(t => t !== null && t !== undefined && t !== '')
            
            const productInfo = {
                title,
                description,
                code,
                price,
                status: st,
                stock,
                category,
                thumbnails: thumb
            }

            const newProduct = await Product.create(productInfo)
            console.log(newProduct)
            return newProduct
        } catch(error){
            console.error('Error al agregar producto:', error.message)
            throw new Error('Error al agregar producto:', error.message)
        }
    }

    async insertMany(products){
        try {
            return await Product.insertMany(products)
        } catch(error){
            console.error('Error al agregar varios productos:', error.message)
            throw new Error('Error al agregar varios productos:', error.message)
        }
    }

    async updateById(id, updatedProduct){
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = updatedProduct;

            const product = { status, stock };
                if (title) product.title = title;
                if (description) product.description = description;
                if (code) product.code = code;
                if (price) product.price = price;
                if (category) product.category = category;
                if (thumbnails.length > 0) {
                    const thumb = thumbnails.filter(t => t !== null && t !== undefined && t !== '')
                    product.thumbnails = thumb;
                }
            return await Product.findByIdAndUpdate(id, product)
        } catch(error){
            console.error(`Error al actualizar producto con id ${id}:`, error.message)
            throw new Error(`Error al actualizar producto con id ${id}:`, error.message)
        }
    }

    async deleteById(id){
        try {
            console.log(`Producto con id ${id} se eliminó`)
            return await Product.findByIdAndDelete(id)
        } catch(error){
            console.error(`Error al eliminar producto con id ${id}:`, error.message)
            throw new Error(`Error al eliminar producto con id ${id}:`, error.message)
        }
    }

    async paginate(query, options){
        try {
            const { limit, page } = options;
            return await Product.paginate(query, { limit, page })
        } catch (error) {
            console.error('Error al obtener productos:', error.message)
            throw new Error('Error al obtener productos:', error.message)
        }
    }
}

module.exports = ProductDao