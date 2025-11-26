const productModel = require('../models/productModel')

const productListController = async(req,res)=>{
const product = await productModel.find()
res.json(product)
}

const newProductController = async (req, res) => {
  console.log("added");
  console.log(req.body);
const newProduct= {        
      name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            image:req.body.image,}

            const newProductDocument = new productModel(newProduct)

            try{

              await newProductDocument.save()

          
                res.send({"message":"product added"})

  
            }
            catch(error){
              res.status(400).send({"message":"something went wrong","error":error})

            }
}

const productDetailController= async(req, res) => {
  const productID = req.params.id
    const product = await productModel.findById(productID)
  res.json(product)
}



const deleteProductController = async (req, res) => {
  

  await productModel.findByIdAndDelete(req.query.id)
    res.json({ message: "product deleted successfully" }); // <-- Send response here!

    


}


module.exports={productListController,newProductController,productDetailController,deleteProductController}