//Importación del fs
const fs = require('fs').promises;
const path = require('path');


const archivoJson = path.join(__dirname, 'productos.json');


/////////////////////////////// LEER EL ARCHIVO JSON DE PRODUCTOS ///////////////////////////////
const leerProductosJson = async () => {
  try {
      const data = await fs.readFile(archivoJson, 'utf8');
      return JSON.parse(data); // Convertir a JSON
  } catch (err) {
      console.error("Error al leer el archivo JSON", err);
      throw err; //Propagar el error para que sea capturado en el controlador
  }
};

/////////////////////////////// ESCRIBIR EL ARCHIVO JSON DE PRODUCTOS ///////////////////////////////
const escribirProductosJson = async (productos) => {
  try {
      await fs.writeFile(archivoJson, JSON.stringify(productos, null, 2), 'utf8');
      console.log("El archivo JSON ha sido actualizado con éxito");
  } catch (err) {
      console.error("Error al escribir en el archivo JSON", err);
      throw err; //Propagar el error
  }
};

///////////////////////////////////////// GET /////////////////////////////////////////
  const getProductos = async (req, res) => {
    try {
      const productos = await leerProductosJson(); //Traer los productos desde el JSON
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los productos", error });
    }
  };
  

///////////////////////////////////////// POST /////////////////////////////////////////
  const postProducto = async (req, res) => {
    try {
      const { name, precio } = req.body;
  
      if (!name || !precio) {
        return res.status(400).json({ message: "Todos los campos son requeridos: 'name' y 'precio'." });
      }
  
      const productos = await leerProductosJson(); //Traer los productos desde el JSON
      const nuevoProducto = {
        id: productos.length + 1,
        name,
        precio,
      };
  
      productos.push(nuevoProducto);
      await escribirProductosJson (productos); //Envío el nuevo producto al Json
      res.status(201).json(nuevoProducto);
  
    } catch (error) {
      res.status(500).json({ message: "Error al crear el producto", error });
    }
  };
  

///////////////////////////////////////// PUT /////////////////////////////////////////
const updateProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, precio } = req.body;
      const productos = await leerProductosJson(); //Traer los productos desde el JSON
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
  
      await escribirProductosJson (productos); //Envío el producto actualizado al Json
      res.status(200).json({ message: "Producto actualizado exitosamente", producto: productos[productoIndex] });
  
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  
///////////////////////////////////////// DELETE /////////////////////////////////////////
const deleteProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const productos = await leerProductosJson(); //Traer los productos desde el JSON
      const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
      if (productoIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      productos.splice(productoIndex, 1);

      await escribirProductosJson (productos); 

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
