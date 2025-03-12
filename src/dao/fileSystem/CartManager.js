const fs = require('fs');

class CartManager {
    path = '';
    static id = 0;

    constructor(file) {
        this.path = process.cwd() + `/src/files/${file}`;
    }

    async addCart(cart) {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf-8');

                const cartsJSON = carts.trim() ? JSON.parse(carts) : [];

                const newId = cartsJSON.length ? Math.max(...cartsJSON.map(c => c.id)) + 1 : 1;

                const { products } = cart;

                const cartInfo = {
                    id: newId,
                    products
                }

                cartsJSON.push(cartInfo);
                await fs.promises.writeFile(this.path, JSON.stringify(cartsJSON), 'utf-8');
                console.log('Carrito agregado con éxito');
            } else {
                throw new Error('No existe el archivo');
            }
        } catch (error) {
            console.error('Error agregar carrito:', error);
        }

    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf-8');
                const cartsJSON = carts.trim() ? JSON.parse(carts) : [];
    
                return cartsJSON;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener carritos:', error.message);
            return [];
        }
    }

    async getCartById(id){
            try {
                if (fs.existsSync(this.path)) {
                    const carts = await fs.promises.readFile(this.path, 'utf-8');
                    const cartsJSON = carts.trim() ? JSON.parse(carts) : [];  
                    let cartFound = cartsJSON.find(cart => cart.id === Number(id))
                    if(cartFound){
                        return productFound;
                    } else {
                        console.log('No existe carrito con ese ID');
                        return {error: 'No existe carrito con ese ID'};
                    }

                } else {
                    return null;
                }
            } catch (error) {
                console.log(error.message);
            }
        }

    async addProductToCart(idProduct, idCart, product){
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf-8');
                const cartsJSON = carts.trim() ? JSON.parse(carts) : [];  
                let cartFound = cartsJSON.find(cart => cart.id === Number(idCart))
                if(cartFound){
                    let productFound = cartFound.products.find(p => p.id === Number(idProduct));
                    if (productFound) {
                        productFound.quantity++;
                    } else {
                        cartFound.products.push(product);
                    }
                    await fs.promises.writeFile(this.path, JSON.stringify(cartsJSON), 'utf-8');
                    console.log('Producto agregado al carrito con éxito');
                } else {
                    console.log('No existe carrito con ese ID');
                    return {error: 'No existe carrito con ese ID'};
                }
            } else {
                return null;
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = CartManager;