import express from 'express'
import { submitForm } from '../controllers/response'
let responseRouter = express.Router()

responseRouter.post('/submit/form' , submitForm )

export {responseRouter}