const { Router } = require('express');
const UserDao = require('../dao/mongoDb/Users.dao');

const router = Router();

const userDao = new UserDao();

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, age, email, nickName, password } = req.body;
        const newUserInfo = {
            firstName,
            lastName,
            age,
            email,
            nickName,
            password
        }

        const user = await userDao.insertOne(newUserInfo)
        
        res.status(201).json({ status: 'success', message: user});
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ status: 'error', message: 'Server Internal error' });
    }
})

module.exports = router