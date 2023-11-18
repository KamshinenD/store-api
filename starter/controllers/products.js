const Product= require('../models/product')

const getAllProductsStatic= async(req, res)=>{
    // throw new Error('testing async errors')
    const products= await Product.find({featured:true}).skip(2).limit(4)
    res.status(200).json({msg:products, nbHits:products.length})
}

const getAllProducts= async(req, res)=>{
    const {featured, company, name, sort, fields}= req.query
    // const {featured, company, name, sort, fields, skip, limit}= req.query
    const queryObject={}
        if(featured){
            queryObject.featured=featured==='true'? true: false;
        }
        if(company){
            queryObject.company=company;
        }
        if(name){
            // this ensures we return products that contain whatever is in the name value
            queryObject.name={$regex:name, $options: 'i'};
        }
        // because of the sort functionality, we'd have to use result and then remove the await
    // const products= await Product.find(queryObject)
    let results= Product.find({})
    const allProducts= await Product.find({}); //This is just to enable me gbet a total of the items in the db to assit the front end with their pagination
    // sort
    if(sort){
        // console.log(sort)
        const sortList= sort.split(',').join(' ') //to remove any comma in the sort query
        results=results.sort(sortList);
    } else{
        results=results.sort('createdAt');
    }
    // select only certain fields
    if(fields){
        const fieldsList= fields.split(',').join(' ') //to remove any comma in the sort query
        results=results.select(fieldsList);
    }
// pagination
    const page=Number(req.query.page) ||1
    const limit=Number(req.query.limit) ||10
    const skip=(page-1)*limit
    results=results.skip(skip).limit(limit)
    const products=await results
    res.status(200).json({products, nbHits:products.length, total:allProducts.length, currentPage:page})
}


module.exports={
    getAllProducts,
    getAllProductsStatic
}