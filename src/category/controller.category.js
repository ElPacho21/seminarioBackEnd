const CustomRouter = require('../classes/CustomRouter');
const CategoryDao = require('../dao/mongoDb/Category.dao');

const categoryDao = new CategoryDao()

class CategoryController extends CustomRouter {
    init() {

        this.get('/', ['ADMIN'], async (_req, res) => {
            try {
                const categories = await categoryDao.findAll();
                res.status(200).json({ status: 'success', payload: categories });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.post('/', ['ADMIN'], async (req, res) => {
            try {
                const { category } = req.body;
                console.log(req.body)
                const newCategory = await categoryDao.insertOne({ name: category.toUpperCase() });
                res.status(201).json({ status: 'success', payload: newCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })


        this.patch('/:cid', ['ADMIN'], async (req, res) => {
            try {
                const {cid} = req.params;
                const { category } = req.body;
                const updatedCategory = await categoryDao.updateById(cid, { name: category.toUpperCase() });
                res.status(200).json({ status: 'success', payload: updatedCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.delete('/:cid', ['ADMIN'], async (req, res) => {
            try {
                const {cid} = req.params;
                const deletedCategory = await categoryDao.deleteById(cid)
                res.status(200).json({ status: 'success', payload: deletedCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        //Rutas pubicas para testear
        this.get('/public', ['PUBLIC'], async (_req, res) => {
            try {
                const categories = await categoryDao.findAll();
                res.status(200).json({ status: 'success', payload: categories });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.post('/public', ['PUBLIC'], async (req, res) => {
            try {
                const { category } = req.body;
                const newCategory = await categoryDao.insertOne({ name: category.toUpperCase() });
                res.status(201).json({ status: 'success', payload: newCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })


        this.patch('/public/:cid', ['PUBLIC'], async (req, res) => {
            try {
                const {cid} = req.params;
                const { category } = req.body;
                const updatedCategory = await categoryDao.updateById(cid, { name: category.toUpperCase() });
                res.status(200).json({ status: 'success', payload: updatedCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.delete('/public/:cid', ['PUBLIC'], async (req, res) => {
            try {
                const {cid} = req.params;
                const deletedCategory = await categoryDao.deleteById(cid)
                res.status(200).json({ status: 'success', payload: deletedCategory });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })
      
    }
}

module.exports = CategoryController;