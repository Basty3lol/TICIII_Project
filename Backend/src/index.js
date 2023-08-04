import app from "./app"
import "./database"

app.listen(5000);

console.log("server listen on port", 5000);

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: "TEST-3834561635124690-112022-39cee623bb48690e118e6ea9bef450c8-600293696",
});

app.use("/pago", (req, res) => {
        // Crea un objeto de preferencia
    const {title,unit_price,quantity,currency_id}= req.body;
    let preference = {
        back_urls:{
            success:'http://localhost:3000/confirmacion',
            failure:'http://localhost:3000/rechazado'
        },

        items: [
        {
            title: title,
            unit_price: unit_price,
            quantity: quantity,
            currency_id: currency_id
        },
        ],
        //mercado pago notifica la data a ese url
        //Notification_url:'http://localhost:3000/agendar'
    };
    
    mercadopago.preferences
        .create(preference)
        .then(function (response) {
        // Este valor reemplazarÃ¡ el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
        //console.log(response.body.init_point);
        res.json(response.body.init_point);
        })
        .catch(function (error) {
        console.log(error);
        });
    
})