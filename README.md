<FUNCIONAMIENTO DE LA API>
Esta API permite ejecutar operaciones CRUD (Crear, Leer, Actualizar y Eliminar), sobre una lista de productos que están almacenados en un archivo JSON. Se pueden ejecutar a través del <POSTMAN


ENDPOINTS
1. Obtner todos los productos
    <GET: Se obtiene la lista completa de los productos
    Ejemplo de solicitud: GET http://localhost:3000/api/productos

    => Respuesta
    [
        {
            "id": 1,
            "nombre": "Auriculares Bluetooth X-Pro",
            "descripcion": "Auriculares inalámbricos con sonido envolvente.",
            "precio": "$49.99",
            "cantidadDisponible": "30 unidades"
        },
    ]

2. Agregar un nuevo producto
    <POST: Se agrega un nuevo producto a la lista
    Ejemplo de solicitud: POST http://localhost:3000/api/productos

    => Cuerpo de la solicitud
    {
        "nombre": "Mochila Ecológica EcoBag",
        "descripcion": "Mochila fabricada con materiales reciclados",
        "precio": "$34.99",
        "cantidadDisponible": "20 unidades"
    }

    => Respuesta
    {
        "id": 2,
        "nombre": "Mochila Ecológica EcoBag",
        "descripcion": "Mochila fabricada con materiales reciclados",
        "precio": "$34.99",
        "cantidadDisponible": "20 unidades"
    }

3. Actualizar producto que ya existe
    <PUT: Actualiza los detalles de un producto específico
    Ejemplo de solicitud: PUT http://localhost:3000/api/productos/1 (el id correspondiente)

    => Cuerpo de la solicitud
    {
        "nombre": "Auriculares Bluetooth X-Pro", 
        "descripcion": "Auriculares inalámbricos con sonido envolvente.",
        "precio": "Nuevo precio",
        "cantidadDisponible": "Nueva cantidad disponible"
    }

    => Respuesta
    {
        "message": "Producto actualizado con éxito",
        "producto": {
            "id": 1,
            "nombre": "Auriculares Bluetooth X-Pro",
            "descripcion": "Auriculares inalámbricos con sonido envolvente.",
            "precio": "$70", <precio actualizado>
            "cantidadDisponible": "25 unidades" <cantidadDisponible actualizada>
        }
    }

4. Eliminar un producto
    <DELETE: Elimina un producto de la lista
    Ejemplo de solicitud: PUT http://localhost:3000/api/productos/2 (el id correspondiente)

    => Respuesta
    {
    "message": "Producto eliminado correctamente."
    }

///////////////////////////////// VALIDACIONES PARA MANEJAR ERRORES ///////////////////////////////////////////////////

1. Falta de datos requeridos (POST o PUT)

    => Si al ejecutar la solicitud falta algún campo requerido (nombre, descripción, precio o cantidadDisponible)
    Se usa el código de estado: <400> BAD REQUEST

    Estructura:
        if (!nombre || !descripcion || !precio || !cantidadDisponible) {
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún dato: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'." });
        }

    => Respuesta
    {
        "message": "Existe un error de sintáxis o falta algún atributo: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'."
    }

2. Productos no encontrados  (PUT o DELETE)
    => Si el id del producto no existe 
    Se usa el código de estado: <404> NOT FOUND

    Estructura:
        if (productoIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
        }

    => Respuesta 
    {
        "message": "Producto no encontrado."
    }

3. Error interno del servidor
    => Esto es en caso de algún error inesperado en el servidor
    Se usa el código de estado: <500> INTERNAL SERVER ERROR

    Estructura:
    catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }

    => Respuesta 
    {
        "message": "Error interno del servidor."
        "error": "Detalles del error"
    }
