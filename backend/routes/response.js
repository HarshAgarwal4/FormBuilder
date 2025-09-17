import express from 'express'
import { getResponseOfForm, submitForm } from '../controllers/response.js'
let responseRouter = express.Router()

responseRouter.post('/submit/form' , submitForm )
responseRouter.get('/response/form/:id' , getResponseOfForm )

export {responseRouter}