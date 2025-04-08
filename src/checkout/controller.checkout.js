const Stripe = require('stripe');

const CustomRouter = require('../classes/CustomRouter');
const { stripeSecretKey } = require('../config/stripe.config');
const { frontEndUrl } = require('../config/app.config');

const stripe = new Stripe(stripeSecretKey)

class OrdersController extends CustomRouter{
    init() {
        this.post('/', ['PUBLIC'], async (req, res) => {
            try {
                const { products } = req.body;
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
                        currency: 'usd',
                        unit_amount: Math.round(product.price),
                    },
                    quantity: product.quantity
                }));

                const session = await stripe.checkout.sessions.create({
                    line_items: productsStripe,
                    mode: 'payment',
                    success_url: `${frontEndUrl}/payment/success`,
                    cancel_url: `${frontEndUrl}/products`,
                });
        
                console.log(session);
                res.status(201).json({ payment: session });
            } catch (error) {
                console.error(error);
                res.status(500).json({ status: 'error', payload: 'Error al realizar el pago' });
            }    
        });

        this.get('/success', ['PUBLIC'], async (req, res) => {
            try {
                
            } catch (error) {
                
            }    
        });

        this.get('/cancel', ['PUBLIC'], async (req, res) => {
            try {
                
            } catch (error) {
                
            }    
        });
    }
}

module.exports = OrdersController;