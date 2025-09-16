import { ResponseModel } from "../models/response"

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

export {submitForm}