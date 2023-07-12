const express = require('express')
const fileUpload = require('express-fileupload')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { connectMailer } = require('./configs/mailerConfig')
const { connectDrive } = require('./configs/uploadDrive')

//app & port
//==========================================================
const app = express()
const port = process.env.PORT || 8000
//==========================================================

//config
//==========================================================
app.use(cors({
    origin: '*',
}));
app.use(fileUpload())
app.use(helmet())
app.use(morgan('common'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
connectMailer.getInstance()
connectDrive.getInstance()

const indexRouter = require('./routes/index.route')

app.use('/api', indexRouter)



app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})