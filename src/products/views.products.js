const ProductDao = require('../dao/mongoDb/Products.dao');
const uploader = require('../utils/multer.util');
const authorization = require('../middlewares/authorization.middleware');
const CustomRouter = require('../classes/CustomRouter');

const productDao = new ProductDao()

class ProductsView extends CustomRouter{
    init() {
        this.get('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
        
                const { limit = 10, page = 1, sort, query, value } = req.query;
        
                const filter = {}
        
                //Filtrar los productos según query y value
                if(query === 'category' && value) {
                    filter.category = value
                }
                if(query === 'status' && value !== undefined) {
                    const status = value === 'true'
                    filter.status = status
                }
        
                //Paginar los productos según limit y page
                const data = await productDao.paginate(filter, {limit, page, lean: true});
        
                const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = data
                
                const products = docs.map(product => product.toJSON());
        
                //Ordenar los productos según sort
                if(sort === 'asc') {
                    products.sort((a, b) => a.price - b.price);
                }
                if(sort === 'desc') {
                    products.sort((a, b) => b.price - a.price);
                }
        
                //Generar prevLink y nextLink
                const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        
                const prevLink = hasPrevPage
                    ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}&value=${value}` : ''}`
                    : null;
         
                const nextLink = hasNextPage
                    ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}&value=${value}` : ''}`
                    : null;
        
                // Sessions
                const { nickName } = req.user
                console.log(req.user)
                res.render('home.handlebars', {products, limit, page, query, value, prevLink, nextLink, nickName});
                
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ message: 'Error al mostrar productos' });
            }
        })
        
        this.get('/addproduct', ['ADMIN'], (req, res) => {
            res.render('addproduct.handlebars');
        })
        
        this.get('/deleteproduct', ['ADMIN'], (req, res) => {
            res.render('deleteproduct.handlebars');
        })
        
        // Endpoint para cargar imagenes, se llama con el fetch dentro de createProduct
        this.post('/upload', ['PUBLIC'], uploader.array('thumbnails', 10), (req, res) => {
            try {
                console.log('Archivos recibidos:', req.files);
        
                const filenames = req.files.map(file => file.filename);
                res.json({ filenames });
            } catch (err) {
                console.error('Error al subir archivos:', err);
                res.status(500).json({ error: 'Error al subir archivos' });
            }
        });
        
        this.get('/products/:pid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { pid } = req.params;
                const productDetails = await productDao.findById(pid);
                if (!productDetails) {
                    return res.status(404).render('404.handlebars', { message: 'Producto no encontrado.' });
                }
                const product = productDetails.toJSON();
                console.log(product)
                res.render('productdetails.handlebars', { product });
            } catch (error) {
                console.error(error.message);
                res.status(500).render('error.handlebars', { message: 'Error al cargar los detalles del producto.' });
            }
        });        
    }
}

module.exports = ProductsView;