const fs = require('fs');

class ProductManager {
    path = '';
    static id = 0;

    constructor(file) {
        this.path = process.cwd() + `/src/files/${file}`;
    }

    async addProduct(product) {
        try {
            if (fs.existsSync(this.path)) {
                const {title, description, code, price, status = true, stock, category, thumbnails = [] } = product;

                if (!title || !description || !code || !price || !stock || !category) {
                    throw new Error('Faltan campos del producto por rellenar');
                }

                const products = await fs.promises.readFile(this.path, 'utf-8');

                const productsJSON = products.trim() ? JSON.parse(products) : [];

                // Validar que no exista otro product con el mismo code
                if(productsJSON.some(productMap => productMap.code === code)){
                    throw new Error(`El producto con código ${code} ya existe`)
                }

                const st = JSON.parse(status) // Convierte el string a boolean

                const thumb = thumbnails.filter(t => t !== null && t !== undefined && t !== '')
                

                const newId = productsJSON.length ? Math.max(...productsJSON.map(p => p.id)) + 1 : 1;

                const productInfo = {
                    id: newId,
                    title,
                    description,
                    code,
                    price,
                    status: st,
                    stock,
                    category,
                    thumbnails: thumb
                }

                productsJSON.push(productInfo);
                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON), 'utf-8');
                console.log('Producto agregado con éxito');
            } else {
                throw new Error('No existe el archivo');
            }
        } catch (error) {
            console.error('Error agregar producto:', error);
        }

    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJSON = products.trim() ? JSON.parse(products) : [];

                const activeProducts = productsJSON.filter(product => product.status === true);
    
                return activeProducts;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            return [];
        }
    }

    async getProductById(id){
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJSON = products.trim() ? JSON.parse(products) : [];
    
                let productFound = productsJSON.find(product => {product.id === Number(id) && product.status === true})
                if(productFound){
                    return productFound;
                } else {
                    console.log('No existe producto con ese ID');
                    return {error: 'No existe producto con ese ID'};
                }
            } else {
                return null;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async updateProduct(id, product){
        try {
            if (fs.existsSync(this.path)) {

                const { title, description, code, price, status, stock, category } = product;

                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJSON = products.trim() ? JSON.parse(products) : [];

                const index = productsJSON.findIndex(product => product.id === Number(id));

                if(index === -1) throw new Error(`No se encontró el producto con id ${id}`);

                const productInfo = { status, stock };
                if (title) product.title = title;
                if (description) product.description = description;
                if (code) product.code = code;
                if (price) product.price = price;
                if (category) product.category = category;
                if (thumbnails.length > 0) {
                    const thumb = thumbnails.filter(t => t !== null && t !== undefined && t !== '')
                    product.thumbnails = thumb;
                }

                productsJSON[index] = { ...productsJSON[index], ...productInfo}

                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON), 'utf-8');
                console.log('Producto actualizado con éxito');
            } else {
                throw new Error('No existe el archivo');
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

    async deleteProduct(id){
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJSON = products.trim() ? JSON.parse(products) : [];
                let index = productsJSON.findIndex(product => product.id === Number(id));

                if(index === -1) throw new Error(`No se encontró el producto con id ${id}`);

                productsJSON[index].status = false;
                // productsJSON.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON), 'utf-8');

                console.log(`Producto con id ${id} eliminado con éxito.`);
            } else {
                throw new Error('No existe el archivo');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    deleteImages (thumbnails) {
        thumbnails.forEach((thumb) => {
            const filePath = process.cwd() + `/src/public/images/products/${thumb}`
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error al eliminar la imagen ${thumb}:`, err.message);
                } else {
                    console.log(`Imagen eliminada: ${thumb}`);
                }
            });
        });
    };
}

module.exports = ProductManager;