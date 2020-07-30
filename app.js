const express = require('express')
const app = express()

const fs = require('fs')

const router = express.Router()

app.use(require('cors')())

app.use(express.json({ extended: true }))


app.use('/refactor', router.patch('/', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./Data/Data.json', 'utf-8'))
        data.accounts = req.body
        fs.writeFileSync('./Data/Data.json', JSON.stringify(data, null, '\t'));
        res.status(201).json({message:"created", data})
    } catch (e) {
        res.status(500).json(e.message)
    }
}))

app.listen(8600, () => console.log('start'))
