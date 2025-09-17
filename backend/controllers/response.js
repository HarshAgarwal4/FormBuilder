import { ResponseModel } from "../models/response.js"

async function submitForm(req, res) {
    let { form, values } = req.body
    try {
        const r = new ResponseModel({
            form,
            values
        })
        await r.save()
        return res.send({ status: 1, msg: "response recorder succesfully" })
    } catch (err) {
        console.log(err)
        return res.send({ status: 0, msg: "server error" })
    }
}

async function getResponseOfForm(req,res) {
    let id = req.params.id
    try{
        const responses = await ResponseModel.find({form: id})
        if(!responses) return res.send({status:7, msg:"No responses"})
        return res.send({status:1, msg:"responses fetched" , responses: responses})
    }
    catch(err){
        console.log(err)
        return res.send({status: 0,msg:"server error"})
    }
}

export {submitForm , getResponseOfForm}