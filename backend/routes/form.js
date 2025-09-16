import express from 'express'
import { deleteForm, fetchForms, getForm, saveForm } from '../controllers/form.js'
let fromRoutrer = express.Router()

fromRoutrer.post('/saveForm' , saveForm)
fromRoutrer.get('/fetchForms' , fetchForms)
fromRoutrer.post('/deleteForm' , deleteForm)
fromRoutrer.get('/form/:id' , getForm)

export {fromRoutrer}