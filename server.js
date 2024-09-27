const { Product } = require('./src/modelos/product')
const { Employee } = require('./src/modelos/employee')
const { ProductCategoryView } = require('./src/modelos/productsandcategories')
const { Category } = require('./src/modelos/category')

const { sequelize } = require('./src/conexion/connection')
const { Op } = require('sequelize')
const express = require('express')
const app = express()
const port = 3001

app.use(express.json())
app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito ! =)')
    await Product.sync()
    await Employee.sync()
    next()
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.get('/productosycategorias', async (req, res) => {
  try {
    const products = await ProductCategoryView.findAll(
    )
    products.length > 0 ? res.status(200).json(products)
      : res.status(404).json({ error: "No encontramos productos cargados" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos', async (req, res) => {
  try {
    const products = await Product.findAll(
      { order: [['CategoryID', 'ASC'], ['productName', 'DESC']] }
    )
    products.length > 0 ? res.status(200).json(products)
      : res.status(404).json({ error: "No encontramos productos cargados" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/:ProductID', async (req, res) => {
  try {
    const { ProductID } = req.params
    const product = await Product.findByPk(ProductID)
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/nombre/:ProductName', async (req, res) => {
  try {
    const { ProductName } = req.params
    const product = await Product.findOne({ where: { ProductName } })
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/categoria/:CategoryID', async (req, res) => {
  try {
    const { CategoryID } = req.params
    const products = await Product.findAll({ where: { CategoryID } })
    products ? res.json(products)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/buscar/:query', async (req, res) => {
  try {
    const { query } = req.params
    const product = await Product.findAll({
      where:
      {
        productName: {
          [Op.like]: `%${query}%`
        }
      }
    })
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/importeMayor/:query', async (req, res) => {
  try {
    const { query } = req.params
    const product = await Product.findAll({
      where:
      {
        UnitPrice: {
          [Op.gt]: query
        }
      },
      order: [['UnitPrice', 'ASC']]
    })
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/:campo/:valor', async (req, res) => {
  try {
    const { campo, valor } = req.params
    const query = { [campo]: valor }
    const product = await Product.findOne({ where: { query } })
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/empleados', async (req, res) => {
  try {
    const employees = await Employee.findAll()
    employees.length > 0 ? res.status(200).json(employees)
      : res.status(404).json({ error: "No encontramos empleados cargados" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.post('/productos', async (req, res) => {
  try {
    // Tomamos todos los datos desde el body
    const {
      ProductName,
      SupplierID,
      CategoryID,
      QuantityPerUnit,
      UnitPrice,
      UnitsInStock,
      UnitsOnOrder,
      ReorderLevel,
      Discontinued
    } = req.body
    // Hacemos el INSERT mediante sequelize
    const product = await Product.create({
      ProductName,
      SupplierID,
      CategoryID,
      QuantityPerUnit,
      UnitPrice,
      UnitsInStock,
      UnitsOnOrder,
      ReorderLevel,
      Discontinued
    })
    // Devolvemos en la response el código 201 con el producto
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: `Ocurrio un error`, message: `error: ${error.message}` })
  }
})

app.put('/productos/:ProductID', async (req, res) => {
  try {
    // Tomamos el parametro
    const { ProductID } = req.params
    // Tomamos todos los datos desde el body
    const {
      ProductName,
      SupplierID,
      CategoryID,
      QuantityPerUnit,
      UnitPrice,
      UnitsInStock,
      UnitsOnOrder,
      ReorderLevel,
      Discontinued
    } = req.body
    // Hacemos el UPDATE mediante sequelize
    const [productToUpdate] = await Product.update({
      ProductName,
      SupplierID,
      CategoryID,
      QuantityPerUnit,
      UnitPrice,
      UnitsInStock,
      UnitsOnOrder,
      ReorderLevel,
      Discontinued
    },
      { where: { ProductID } }
    )
    if (productToUpdate === 0) {
      res.status(404).json({ error: "Producto no encontrado" })
    }

    // Devolvemos en la response el código 201 con el producto
    const product = await Product.findByPk(ProductID)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: `Ocurrio un error`, message: `error: ${error.message}` })
  }
})

app.delete('/productos/:ProductID', async (req, res) => {
  try {
    // Tomamos el parametro
    const { ProductID } = req.params
    // Buscamos el producto
    const productToDelete = await Product.findByPk(ProductID)
    // Si no encontramos el producto
    if (!productToDelete)
      return res.status(404).json({ error: "Producto no encontrado" })
    // Hacemos el delete mediante sequelize
    productToDelete.destroy()
    // Devolvemos en la response el código 204 con mensaje vacio
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: `Ocurrio un error`, message: `error: ${error.message}` })
  }
})

app.get('/categorias', async (req, res) => {
  try {
    const categorias = await Category.findAll()
    categorias.length > 0 ? res.status(200).json(categorias)
      : res.status(404).json({ error: "No encontramos categorias cargados" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/categorias/:CategoryID', async (req, res) => {
  try {
    const { CategoryID } = req.params
    const category = await Category.findByPk(CategoryID)
    category ? res.json(category)
      : res.status(404).json({ error: "Categoría no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.delete('/categorias/:CategoryID', async (req, res) => {
  try {
    // Tomamos el parametro
    const { CategoryID } = req.params
    // Buscamos el categoría
    const categoryToDelete = await Category.findByPk(CategoryID)
    // Si no encontramos el categoría
    if (!categoryToDelete)
      return res.status(404).json({ error: "categoría no encontrada" })
    // Buscamos si la categoría tiene un producto
    const productsInCategory = await Product.findOne({ where: { CategoryID } })
    // Si tiene al menos uno, entonces arrojamos 400
    if (productsInCategory)
      return res.status(400).json({ error: "No se pudo eliminar la categoría", message: "Existen productos asociados a la categoria" })
    // Hacemos el delete mediante sequelize
    categoryToDelete.destroy()
    // Devolvemos en la response el código 204 con mensaje vacio
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: `Ocurrio un error`, message: `error: ${error.message}` })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})