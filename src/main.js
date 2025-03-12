const ProductManager = require('./ProductManager');

(async () => {
    try {

        const productManager = new ProductManager('products.json');
        const products = await productManager.getProducts();
        console.log(products);
        
        let product = {
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25
        }

        //await productManager.addProduct(product);

        const productFound = await productManager.getProductById(1);

        console.log('Producto buscado por id: ', productFound);

        /* const productModified = {
            title: 'Sombrero de Lana',
        }

        await productManager.updateProduct(1, productModified);
        
        await productManager.deleteProduct(1); */

    } catch (error) {
        console.log(error);
    }
})();