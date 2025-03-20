const CustomRouter = require('../classes/CustomRouter');
const CartManager = require('../dao/fileSystem/CartManager');
const CartDao = require('../dao/mongoDb/Carts.dao');
const UserDao = require('../dao/mongoDb/Users.dao');
const { generateToken } = require('../utils/jwt.util');

const cartManager = new CartManager('carts.json');
const cartDao = new CartDao();
const userDao = new UserDao();

class CartsController extends CustomRouter{
    init() {
        this.get('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const carts = await cartDao.findAll();
        
                res.status(200).json({status: 'success', payload: carts });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al mostrar carritos' });
            }
        })
        
        this.get('/:cid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
        
                const { cid } = req.params;
        
                const data = await cartDao.findById(cid);
        
                res.status(200).json({status: 'success', payload: data });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al mostrar carrito' });  
            }
        })
        
        this.post('/', ['CLIENT', 'ADMIN'], async (req, res) =>{
            try {
                const data = req.body;
                console.log(data)
                
                const products = data.products;
                if (products.length === 0) throw new Error('El carrito está vacío');
        
                const newCart = await cartDao.insertOne(data)


                await userDao.updateById(req.user.id, { cart: newCart._id });

                const payload = { ...req.user, cartId: newCart._id };
                delete payload.exp;

                const newToken = generateToken(payload);

                res.cookie('authToken', newToken, {maxAge: 600000, httpOnly: true});
                
                res.status(201).json({status: 'success', payload: newCart });
        
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al agregar el carrito' });
            }
        })
        
        this.patch('/:cid/products/:pid', ['CLIENT', 'ADMIN'], async (req, res) =>{
            try {
                const { cid, pid } = req.params;
                const data = req.body;
                const { product, quantity } = data
        
                const productInfo = {
                    product,
                    quantity
                }
        
                const newCart = await cartDao.insertProductToCart(cid, pid, productInfo);
        
                res.status(201).json({status: 'success', payload: newCart });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al agregar el producto al carrito' });
            }
        })
        
        this.delete('/:cid/products/:pid', ['CLIENT', 'ADMIN'], async (req, res) =>{
            try {
                const { cid, pid } = req.params;
        
                await cartDao.removeProductFromCart(cid, pid);
        
                res.status(201).json({status: 'success', payload: 'Producto eliminado del carrito con éxito' });
        
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al eliminar el producto del carrito' });
            }
        })
        
        this.put('/:cid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { cid } = req.params
                const products = req.body
        
                await cartDao.updateOne(cid, products)
                res.status(200).json({status: 'success', payload: 'Carrito actualizado con éxito' });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al actualizar el carrito' });
            }
        })
        
        this.delete('/:cid/products', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { cid } = req.params
        
                await cartDao.deleteProducts(cid)
                res.status(200).json({status: 'success', payload: 'Productos eliminados con éxito' });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({status: 'error', payload: 'Error al eliminar los productos del carrito' });
            }
        })
        
        this.delete('/:cid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { cid } = req.params
        
                await cartDao.deleteById(cid)
                res.status(200).json({status: 'success', payload: 'Carrito eliminado con éxito' });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({status: 'error', payload: 'Error al eliminar el carrito' });
            }
        })
        
        this.get('/:cid/loadItems', ['ADMIN'], async (req, res) => {
            try {
                const carts = await cartManager.getCarts()
                const newCarts = await cartDao.insertMany(carts);
                res.status(200).json({status: 'success', payload: newCarts})
            } catch (error) {
                console.error(error.message)
                res.status(500).json({status: 'error', payload: error})
            }
        })
    }
}

module.exports = CartsController;