import express, { NextFunction, Request, Response } from 'express'
import { BlogControllers } from './blog.controller'
import { multerUpload } from '../../config/multer.config'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import auth from '../../middlewares/auth'


const router = express.Router()
router.post(
  '/',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'No cover image uploaded for the blog',
      )
    }
    req.body = JSON.parse(req.body.data)
    next()
  },
  auth(["admin"]),
  BlogControllers.createBlog,
)

router.put(
  '/:id',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body = {
        ...JSON.parse(req.body.data),
        coverImage: req.file.path,
      }
    } else {
      req.body = JSON.parse(req.body.data)
    }
    next()
  },
  auth(["admin"]),
  BlogControllers.updateBlog,
)
router.get('/', BlogControllers.getAllBlogs)
router.get('/:id', BlogControllers.getBlogById)
router.delete('/:id', auth(["admin"]), BlogControllers.deleteBlog)

export const BlogRoutes = router
