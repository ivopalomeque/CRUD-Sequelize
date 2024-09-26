const { Product } = require('./src/modelos/product')
const { Employee } = require('./src/modelos/employee')
const { ProductCategoryView } = require('./src/modelos/productsandcategories')

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

app.get('/productos/:productID', async (req, res) => {
  try {
    const { productID } = req.params
    const product = await Product.findByPk(productID)
    product ? res.json(product)
      : res.status(404).json({ error: "Producto no encontrado" })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

app.get('/productos/nombre/:productName', async (req, res) => {
  try {
    const { productName } = req.params
    const product = await Product.findOne({ where: { productName } })
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

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})