import { FormModel } from "../models/Form.js";

async function saveForm(req,res) {
    try {
    const { title, description, fields } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const form = new FormModel({
      title,
      description,
      fields,
      user: req.user.id
    });

    await form.save();

    res.send({status:1, message: "Form created successfully", form });
  } catch (err) {
    console.error(err);
    res.send({status:0, message: "Server error" });
  }
}

async function getForm(req , res) {
    let id = req.params.id
     try{
        let r = await FormModel.findOne({_id: id})
        if(!r) return res.send({status:7, msg:"No forms found"})
        return res.send({status: 1 , msg: "form fetched succesfully" , form: r})
    }
    catch(err) {
        console.log(err)
        return res.send({status: 0, msg: "internal server error"})
    }
}

async function fetchForms(req,res) {
    try{
        let r = await FormModel.find({user: req.user.id})
        if(!r) return res.send({status:7, msg:"No forms found"})
        return res.send({status: 1 , msg: "forms fetched succesfully" , forms: r})
    }
    catch(err) {
        console.log(err)
        return res.send({status: 0, msg: "internal server error"})
    }
}

async function deleteForm(req, res) {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "Form ID is required" });

  try {
    await FormModel.deleteOne({ _id: id });
    res.send({status:1, message: "Form deleted successfully" });
  } catch (err) {
    console.error(err);
    res.send({status:0, message: "Server error" });
  }
}

export {saveForm , fetchForms , deleteForm , getForm}