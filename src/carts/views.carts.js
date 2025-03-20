const CustomRouter = require('../classes/CustomRouter');
const CartDao = require('../dao/mongoDb/Carts.dao');
const ProductDao = require('../dao/mongoDb/Products.dao');

const cartDao = new CartDao();
const productDao = new ProductDao();

class CartsView extends CustomRouter {
    init() {
        this.get('/:cid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { cid } = req.params;
                const cart = await cartDao.findById(cid);
        
                if (!cart || cart.products.length === 0) {
                    res.render('cart.handlebars', { message: 'El carrito está vacío' });
                } else {
                    //Promise.all espera a que se resuelvan las promesas
                    const productsData = await Promise.all(cart.products.map(async (p) => {
                        const productDetails = await productDao.findById(p.product);
                            return {
                                ...productDetails.toObject(),
                                quantity: p.quantity
                            };
                        })
                    );
                    res.render('cart.handlebars', { products: productsData });
                }
            } catch (error) {
                console.error('Error al obtener el carrito:', error.message);
                res.status(500).json({ message: 'Error al obtener el carrito' });
            }    
        })
        
        this.get('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                res.render('cart.handlebars', { message: 'El carrito está vacío' });
            } catch (error) {
                console.error('Error al obtener el carrito:', error.message);
                res.status(500).json({ message: 'Error al obtener el carrito' });
            }    
        })
        
        this.get('/session/cart', ['CLIENT', 'ADMIN'], (req, res) => {
            if (!req.user.cartId) {
                console.log('No hay carrito en la sesión')
                return res.json({ cartId: null });
            }
            res.json({ cartId: req.user.cartId });
        });
    }
}

module.exports = CartsView;