const CustomRouter = require('../classes/CustomRouter');
const ReceiptDao = require('../dao/mongoDb/Receipt.dao');

const receiptDao = new ReceiptDao()

class ReceiptsController extends CustomRouter{
    init() {
        this.get('/', ['ADMIN'], async (req, res) => {
            try {
                const receipts = await receiptDao.findAll();
                res.status(200).json({ status: 'success', payload: receipts });
            } catch (error) {
                console.error(error);
                res.status(500).json({ status: 'error', payload: 'Error al obtener los recibos' });
            }    
        });
    }
}

module.exports = ReceiptsController;