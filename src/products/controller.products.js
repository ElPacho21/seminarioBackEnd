const CustomRouter = require('../classes/CustomRouter');
const ProductManager = require('../dao/fileSystem/ProductManager');
const ProductDao = require('../dao/mongoDb/Products.dao')
const { getIo } = require('../socketio/socket');
const uploader = require('../utils/multer.util');

const productManager = new ProductManager('products.json');
const productDao = new ProductDao();

class ProductsController extends CustomRouter {
    init() {
        this.get('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { limit = 10, page = 1, sort, category, search } = req.query;
        
                const filter = {}
        
                //Filtrar los productos según category
                if(category) {
                    filter.category = category
                }
        
                //Paginar los productos según limit y page
                const data = await productDao.paginate(filter, {limit, page});
        
                const { docs, totalDocs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage} = data;
        
                //Ordenar los productos según sort
                if(sort === 'asc') {
                    docs.sort((a, b) => a.price - b.price);
                }
                if(sort === 'desc') {
                    docs.sort((a, b) => b.price - a.price);
                }
        
                //Generar prevLink y nextLink
                const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        
                const prevLink = hasPrevPage
                    ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}&search=${search}` : ''}`
                    : null;
         
                const nextLink = hasNextPage
                    ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}&search=${search}` : ''}`
                    : null;
        
                return res.status(200).json({
                    status: 'success',
                    payload: docs,
                    totalPages,
                    prevPage,
                    nextPage,
                    hasPrevPage,
                    hasNextPage,
                    totalDocs,
                    prevLink,
                    nextLink,
                    page
                });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al mostrar productos' });
            }
        })
        
        this.get('/:pid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
        
                const { pid } = req.params;
        
                const data = await productDao.findById(pid);
        
                res.status(200).json({status: 'success', payload: data });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al mostrar producto' });  
            }
        })
        
        this.post('/', ['ADMIN'], uploader.array('thumbnails'), async (req, res) =>{
            try {
                const {title, description, code, price, status, stock, category} = req.body;
        
                const thumbnails = req.files ? req.files.map(f => f.filename) : [];
        
                const productInfo = {
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails
                }
        
                await productDao.insertOne(productInfo);
                console.log('Producto por agregar: ', productInfo)
        
                const products = await product.findAll();
        
                const io = getIo();
                io.emit('updateProducts', products);
        
                res.status(201).json({status: 'success', payload: 'Producto agregado con éxito' });
        
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al agregar el producto' });
            }
        })
        
        this.patch('/:pid', ['ADMIN'], uploader.array('thumbnails'), async (req, res) =>{
            try {
        
                const { pid } = req.params;
        
                const { title, description, code, price, status, stock, category } = req.body;
        
                const thumbnails = req.files ? req.files.map(f => f.filename) : [];
        
                const productInfo = {
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails
                }
        
                await productDao.updateById(pid, productInfo);
        
                const products = await productDao.findAll();
                const io = getIo();
                io.emit('updateProducts', products);
        
                res.status(200).json({status: 'success', payload: 'Producto actualizado con éxito' });
        
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al actualizar producto' });
            }
        })
        
        this.delete('/:pid', ['ADMIN'], async (req, res) =>{
            try {
        
                const { pid } = req.params;
                
                const data = await productDao.findById(pid);
        
                productManager.deleteImages(data.thumbnails)
        
                await productDao.deleteById(pid);
        
                const products = await productDao.findAll();
        
                const io = getIo();
                io.emit('updateProducts', products);
        
                res.status(200).json({status: 'success', payload: 'Producto eliminado con éxito' });
        
            } catch (error) {
                console.log(error.message);
                res.status(500).json({status: 'error', payload: 'Error al eliminar producto' });
            }
        })
        
        this.get('/:pid/loadItems', ['ADMIN'], async (req, res) => {
            try {
                const products = await productManager.getProducts()
                console.log(products)
                const newProducts = await productDao.insertMany(products);
                res.status(200).json({status: 'success', payload: newProducts})
            } catch (error) {
                console.error(error.message)
                res.status(500).json({status: 'error', payload: error})
            }
        })
    }
}

module.exports = ProductsController;