//Importación del fs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'products.json');


/////////////////////////////// LEER EL ARCHIVO JSON DE PRODUCTOS ///////////////////////////////
//Los lee y los devuelve como un objeto
const leerProductosJson = () => {
    //'fs.readFileSync' lee el archivo de forma síncrona.
    const data = fs.readFileSync(filePath, 'utf-8');//'utf-8', leer como texto.

    //Convertir texto en formato JSON
    return JSON.parse(data);
};

/////////////////////////////// ESCRIBIR EL ARCHIVO JSON DE PRODUCTOS ///////////////////////////////
const escribirProductosJson = (productos) => {
    //El segundo argumento de 'JSON.stringify' (null) es para decir que no se usará un replacer, y el tercer argumento es el número de espacios para formatear el JSON de manera legible (en este caso, 2 espacios de indentación).
    //Esto da como resultado un archivo JSON bien formateado y fácil de leer.
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2), 'utf-8');
};

  


///////////////////////////////////////// GET /////////////////////////////////////////
  const getProductos = (req, res) => {
    try {
      const productos = leerProductosJson(); //Traigo los productos desde el Json
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los productos", error });
    }
  };
  

///////////////////////////////////////// POST /////////////////////////////////////////
  const postProducto = (req, res) => {
    try {
      const { name, precio } = req.body;
  
      if (!name || !precio) {
        return res.status(400).json({ message: "Todos los campos son requeridos: 'name' y 'precio'." });
      }
  
      const productos = leerProductosJson(); //Traigo los productos desde el Json
      const nuevoProducto = {
        id: productos.length + 1,
        name,
        precio,
      };
  
      productos.push(nuevoProducto);
      escribirProductosJson (productos); //Envío el nuevo producto al Json
      res.status(201).json(nuevoProducto);
  
    } catch (error) {
      res.status(500).json({ message: "Error al crear el producto", error });
    }
  };
  

///////////////////////////////////////// PUT /////////////////////////////////////////
const updateProducto = (req, res) => {
    try {
      const { id } = req.params;
      const { name, precio } = req.body;
      const productos = leerProductosJson(); //Traigo los productos desde el Json
      const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
      if (productoIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      if (name) {
        productos[productoIndex].name = name;
      }
      if (precio) {
        productos[productoIndex].precio = precio;
      }
  
      escribirProductosJson (productos); //Envío el producto actualizado al Json
      res.status(200).json({ message: "Producto actualizado exitosamente", producto: productos[productoIndex] });
  
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  
///////////////////////////////////////// DELETE /////////////////////////////////////////
const deleteProducto = (req, res) => {
    try {
      const { id } = req.params;
      const productos = leerProductosJson(); //Traigo los productos desde el Json
      const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
      if (productoIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      productos.splice(productoIndex, 1);

      escribirProductosJson (productos); 

      res.status(200).json({ message: "Producto eliminado correctamente." });
  
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  
  

  module.exports = {
    getProductos,
    postProducto, 
    updateProducto,
    deleteProducto
  };