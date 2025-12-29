// console.log("Application intiialized successfully")

// const catalog =["Electronics","Home","Sports"]

// console.log (catalog)


// const product = {
//     name: "Electronic",
//     object: "LapTop",
//     quantity: 40,
//     price: 50,
//     active: true
// }

// for(let prop in product){
//     console.log(prop,":", product[prop])
// }

// const electronic =[
//     {
//         product: "MacBook",
//         quantity: 50,
//     },
//     {
//         product: "PlayStation 5",
//         quantity: 20,
//     }
// ];

// for(let item of electronic){
//     console.log(item)
// }

async function loadPricing(){
    try{
        const response = await fetch('data/pricing.json')
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.text()
        console.log(data);
        return data;
    }
    catch(error){
        console.error('Error: ', error);
    }
}

loadPricing();