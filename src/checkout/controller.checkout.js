const Stripe = require('stripe');
const mongoose = require('mongoose')

const CustomRouter = require('../classes/CustomRouter');
const { stripeSecretKey, stripeEndpointSecret } = require('../config/stripe.config');
const { frontEndUrl } = require('../config/app.config');
const ReceiptDetailDao = require('../dao/mongoDb/ReceiptDetail.dao');
const ReceiptDao = require('../dao/mongoDb/Receipt.dao');

const stripe = new Stripe(stripeSecretKey)
const endpointSecret = stripeEndpointSecret

const receiptDao = new ReceiptDao()
const receiptDetailDao = new ReceiptDetailDao()

class CheckoutController extends CustomRouter{
    init() {
        this.post('/', ['PUBLIC'], async (req, res) => {
            try {
                const { products, uid } = req.body;

                const productsStripe = products.map(product => ({
                    price_data: {
                        product_data: {
                            name: product.title,
                            description: product.description,
                        },
                        currency: 'ars',
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: product.quantity,
                }));

                const session = await stripe.checkout.sessions.create({
                    line_items: productsStripe,
                    mode: 'payment',
                    metadata: {
                        userId: uid,
                      },
                    success_url: `${frontEndUrl}/payment/success`,
                    cancel_url: `${frontEndUrl}/products`,
                });
        
                console.log('Sesion: ', session);
                res.status(201).json({ status: 'success', payment: session });
            } catch (error) {
                console.error(error);
                res.status(500).json({ status: 'error', payload: 'Error al realizar el pago' });
            }    
        });

        this.post('/webhook', ['PUBLIC'], async (req, res) => {
            const sig = req.headers['stripe-signature'];

            let event;

            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            } catch (err) {
                console.log(`Webhook error: ${err.message}`);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;

                try {
                    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

                    const receipt = await receiptDao.insertReceipt({ uid: session.metadata.userId, date: new Date() });

                    let total = 0;

                    await Promise.all(lineItems.data.map(async (item) => {
                        const mount = item.amount_total / 100;
                        total += mount;
                    
                        const stripeProduct = await stripe.products.retrieve(item.price.product);
                    
                        const productId = mongoose.Types.ObjectId.createFromHexString(stripeProduct.metadata.productId);
                    
                        await receiptDetailDao.insertReceiptDetail({
                            quantity: item.quantity,
                            receipt: receipt._id,
                            product: productId,
                            mount
                        });
                    }));

                    await receiptDao.updateById(receipt._id, { totalMount: total });

                    res.status(201).json({ status: 'success', payload: receipt });
                } catch (err) {
                console.error('Error al guardar recibo:', err);
                res.status(500).json({ status: 'error', payload: 'Error al crear recibo' });
                }
            } else {
                res.status(200).json({ status: 'success', payload: 'Evento ignorado' });
            } 
        });
    }
}

module.exports = CheckoutController;