//Importación del fs
const fs = require('fs').promises;
const path = require('path');

//importación del archivo json
const archivoJson = path.join(__dirname, 'productos.json');


///////////////////////////////  LEER EL ARCHIVO JSON  ///////////////////////////////
const leerJson = async () => {
  try {
      const data = await fs.readFile(archivoJson, 'utf8');
      return JSON.parse(data); //Convertir a JSON
  } catch (err) {
      console.error("Error al leer el archivo JSON", err);
      throw err; //Propagar el error para que sea capturado en el controlador
  }
};

///////////////////////////////  ESCRIBIR EL ARCHIVO JSON  ///////////////////////////////
const escribirJson = async (productos) => {
  try {
      await fs.writeFile(archivoJson, JSON.stringify(productos, null, 2), 'utf8');
      console.log("El archivo JSON ha sido modificado con éxito");
  } catch (err) {
      console.error("Error al escribir en el archivo JSON", err);
      throw err; //Propagar el error para que sea capturado en el constralador
  }
};

///////////////////////////////////////// GET /////////////////////////////////////////
  const getProductos = async (req, res) => {
    try {
      const productos = await leerJson(); //Traer los productos desde el JSON
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los productos", error });
    }
  };
  

///////////////////////////////////////// POST /////////////////////////////////////////
  const postProducto = async (req, res) => {
    try {
      const { nombre, descripcion, precio, cantidadDisponible } = req.body;

      //Validar errores de sintáxis o falta de dato
      if (!nombre || !descripcion || !precio || !cantidadDisponible) {
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'." });
      }
  
      const productos = await leerJson(); //Traer los productos desde el JSON

      //Agregar el nuevo producto
      const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        descripcion,
        precio,
        cantidadDisponible
      };
  
      //Enviar el nuevo producto a la lista de productos
      productos.push(nuevoProducto);

      //Y lo envío al JSON:
      await escribirJson (productos); 
      res.status(201).json(nuevoProducto);

    //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error al agregar producto", error });
    }
  };
  

///////////////////////////////////////// PUT /////////////////////////////////////////
const updateProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, cantidadDisponible } = req.body;
      const productos = await leerJson(); //Traer los productos desde el JSON
      const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));

      //Validar errores de sintáxis o falta de dato
      if (!nombre || !descripcion || !precio || !cantidadDisponible) {
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'." });
      }
  
      if (nombre) {
        productos[productoIndex].nombre = nombre;
      }
      if (descripcion) {
        productos[productoIndex].descripcion = descripcion;
      }
      if (precio) {
        productos[productoIndex].precio = precio;
      }
      if (cantidadDisponible) {
        productos[productoIndex].cantidadDisponible = cantidadDisponible;
      }
  
      await escribirJson (productos); //Envío el producto actualizado al Json
      res.status(200).json({ message: "Producto actualizado con éxito", producto: productos[productoIndex] });
    
      //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  
///////////////////////////////////////// DELETE /////////////////////////////////////////
const deleteProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const productos = await leerJson(); //Traer los productos desde el JSON
      const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
      //Validar que el producto esté disponible
      if (productoIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      //Eliminar de la lista de productos
      productos.splice(productoIndex, 1);

      //Eliminar del archivo productos.json
      await escribirJson (productos); 

      res.status(200).json({ message: "Producto eliminado correctamente." });

    //Capturar errores
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
