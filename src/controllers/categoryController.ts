import { Request, Response, NextFunction, response } from 'express'
import { ICategory } from '../interface/categoryInterface'
import Category from '../models/Category'
import CustomErrorHandler from '../services/CustomErrorHandler'
import categorySchema from '../validators/categoryValidator'

function createCategories(
  categories: ICategory[],
  parentId: string | null = null
) {
  const categoriesList: any = []

  const category =
    parentId == null
      ? categories.filter((cat) => cat.parentId == undefined)
      : categories.filter((cat) => cat.parentId == parentId)

  category.forEach((item) => {
    categoriesList.push({
      _id: item._id,
      parentId: item.parentId,
      name: item.name,
      image: item.image,
      children: createCategories(categories, item._id),
    })
  })

  return categoriesList
}

const categoryController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const parentId = req.query.parentId as string

    const filter = parentId == '0' ? { parentId: { $exists: false } } : {}

    try {
      const respone = await Category.find(filter).select('-updatedAt -__v')

      const categoriesList =
        parentId == '0' ? respone : createCategories(respone, parentId)

      return res.status(200).json({
        success: true,
        data: categoriesList,
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.id
    try {
      const response = await Category.findById(categoryId).select(
        '-updatedAt -__v'
      )

      return res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    const { error } = categorySchema.validate(req.body)

    if (error) {
      return next(error)
    }
    const { name, image, parentId } = req.body

    const category = new Category({
      name: name,
      image: image,
    })

    if (parentId) {
      category.parentId = parentId
    }

    try {
      const response = await category.save()

      const cat = response.toObject()
      delete cat.__v

      return res.status(201).json({
        success: true,
        message: `${cat.name} category created successfully`,
        data: cat,
      })
    } catch (error) {
      return next(error)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { error } = categorySchema.validate(req.body)

    if (error) {
      return next(error)
    }
    const { name, image, parentId } = req.body
    const categoryId = req.params.id

    try {
      const respone = await Category.findByIdAndUpdate(categoryId, {
        name: name,
        image: image,
        parentId: parentId,
      })

      return res.status(200).json({
        success: true,
        message: `${respone?.name} category update successfully`,
        data: respone,
      })
    } catch (error) {
      return next(error)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.id
    try {
      const response = await Category.findByIdAndRemove(categoryId)
      if (!response) {
        return next(new Error('Nothing to delete'))
      }
      res.json(response)
    } catch (error) {
      return next(error)
    }
  },
}

export default categoryController
