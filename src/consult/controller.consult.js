const CustomRouter = require('../classes/CustomRouter');
const ConsultDao = require('../dao/mongoDb/Consult.dao');

const consultDao = new ConsultDao()

class ConsultController extends CustomRouter {
    init() {
        this.post('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { question, product } = req.body;
                const consultInfo = {
                    question,
                    product
                }
                const newConsult = await consultDao.insertOne(consultInfo);
                res.status(201).json({ status: 'success', payload: newConsult });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.get('/firstConsults/:pid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { pid } = req.params;
                const consults = await consultDao.findFirstConsults(pid);
                res.status(200).json({ status: 'success', payload: consults });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })
    }
}

module.exports = ConsultController;