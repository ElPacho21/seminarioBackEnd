const Stripe = require('stripe');

const CustomRouter = require('../classes/CustomRouter');
const { stripeSecretKey } = require('../config/stripe.config');
const { frontEndUrl } = require('../config/app.config');
const ReceiptDetailDao = require('../dao/mongoDb/ReceiptDetail.dao');
const ReceiptDao = require('../dao/mongoDb/Receipt.dao');

const stripe = new Stripe(stripeSecretKey)

const receiptDao = new ReceiptDao()
const receiptDetailDao = new ReceiptDetailDao()

class CheckoutController extends CustomRouter{
    init() {
        this.post('/', ['PUBLIC'], async (req, res) => {
            try {
                const { products, uid } = req.body;
                console.log(products)

                const productsStripe = products.map(product => ({
                    price_data: {
                        product_data: {
                            name: product.title,
                            description: product.description,
                            metadata: {
                                id: product._id
                            }
                        },
                        currency: 'ars',
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: product.quantity
                }));

                const receipt = await receiptDao.insertReceipt({ uid, date: new Date() })

                let total = 0;

                await Promise.all(products.map(async (product) => {
                    const mount = product.price * product.quantity
                    total += mount
                    await receiptDetailDao.insertReceiptDetail({
                        quantity: product.quantity,
                        receipt: receipt._id,
                        product: product._id,
                        mount
                    })
                }))

                await receiptDao.updateById(receipt._id, { totalMount: total })

                const session = await stripe.checkout.sessions.create({
                    line_items: productsStripe,
                    mode: 'payment',
                    success_url: `${frontEndUrl}/payment/success`,
                    cancel_url: `${frontEndUrl}/products`,
                });
        
                console.log('Sesion: ', session);
                res.status(201).json({ payment: session });
            } catch (error) {
                console.error(error);
                res.status(500).json({ status: 'error', payload: 'Error al realizar el pago' });
            }    
        });

        this.post('/webhook', ['PUBLIC'], async (req, res) => {
            const event = request.body;
            console.log("event: ", event)
        });
    }
}

module.exports = CheckoutController;