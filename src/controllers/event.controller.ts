import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";
import CategoryModel from "../models/category.model";
import { generateUniqueSlug } from "../utils/generateUniqueSlug";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      
      const categoryExists = await CategoryModel.exists({ _id: payload.category });
      if (!categoryExists) {
        response.notFound(res, "Please provide a valid category");
        return;
      }

      const result = await EventModel.create(payload);
      response.success(res, result, "Event created successfully");
    } catch (error) {
      response.error(res, error, "Failed to create event");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TEvent> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await EventModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await EventModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: Number(page),
        },
        "All events retrieved successfully."
      );
    } catch (error) {
      response.error(res, error, "Failed to find all events");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventModel.findById(id);
      if (!event) {
        response.notFound(res, "Event not found");
      }
      response.success(res, event, "Event found successfully");
    } catch (error) {
      response.error(res, error, "Failed to event by id");
    }
  },

  async findOneBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const event = await EventModel.findOne({slug});
      if (!event) {
        response.notFound(res, "Event not found");
      }
        response.success(res, event, "Event found successfully");
    } catch (error) {
      response.error(res, error, "Failed to fetch event by slug");
    }
  },
  
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      const oldEvent = await EventModel.findById(id);
      if (!oldEvent) {
        response.notFound(res, "Event not found");
        return;
      }

      if (req.body.name && req.body.name !== oldEvent.name) {
        const newSlug = await generateUniqueSlug("Event", req.body.name, id);
        req.body.slug = newSlug;
      }

      const event = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, event, "Event updated successfully");
    } catch (error) {
      response.error(res, error, "Failed to update event");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
    const { id } = req.params;
      const event = await EventModel.findByIdAndDelete(id, {
        new: true,
      });
      if (!event) {
        response.notFound(res, "Event not found");
      }
        response.success(res, event, "Event removed successfully");
    } catch (error) {
      response.error(res, error, "Failed to remove events");
    }
  },
};
