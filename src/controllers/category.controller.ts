import { Request, RequestHandler, Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utils/response";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, "Category created successfully");
    } catch (error) {
      response.error(res, error, "Failed to create category");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};

      if (search) {
        Object.assign(query, {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        });
      }

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: Number(page),
        },
        "Categories retrieved successfully"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all category");
    }
  },

  findOne: (async (req, res) => {
    try {
      const { id } = req.params;

      const result = await CategoryModel.findById(id);

      if (!result) {
        response.notFound(res, "Category not found");
        return;
      }

      response.success(res, result, "Category found successfully");
    } catch (error) {
      response.error(res, error, "Failed to find one category");
    }
  }) as RequestHandler<{ id: string }>,

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "Category updated successfully");
    } catch (error) {
      response.error(res, error, "Failed to update category");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      const result = await CategoryModel.findByIdAndDelete(id, {
        new: true,
      });
      
      if (!result) {
        response.notFound(res, "Category not found");
        return;
      }

      response.success(res, result, "Category removed successfully");
    } catch (error) {
      response.error(res, error, "Failed to remove category");
    }
  },
};
