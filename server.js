const express = require ("express");
const cors = require ("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const productRoutes = require("./src/Routes/productRoutes");


const PORT = process.env.PORT || 3000;

//Habilitar Cors para las rutas
app.use(cors());

//Middlewares el npm de express que realizamos
app.use(express.json()); //Habilitar parsing de JSON en las solicitudes

//Rutas (aquí se agregan las que se vayan creando)
app.use("/api/productos", productRoutes);


//Servidor
app.listen(PORT, () => {
console.log (`Servidor corriendo en http://localhost:${PORT}`)
})