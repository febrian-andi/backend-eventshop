import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";
import { generateUniqueSlug } from "../utils/generateUniqueSlug";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object({
  name: Yup.string().required("Event name is required"),
  startDate: Yup.string().required("Event start date is required"),
  endDate: Yup.string().required("Event end date is required"),
  description: Yup.string().required("Event description is required"),
  banner: Yup.string().required("Event banner is required"),
  isFeatured: Yup.boolean().required("Event featured status is required"),
  isOnline: Yup.boolean().required("Event online status is required"),
  isPublish: Yup.boolean(),
  category: Yup.string().required("Event category is required"),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updateAt: Yup.string(),
  location: Yup.object().required(),
});

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface Event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

export const EventSchema = new Schema<Event>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
    },
    endDate: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    banner: {
      type: Schema.Types.String,
      required: true,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
      },
    },
  },
  { timestamps: true }
);

EventSchema.pre("save", async function () {
  if (!this.slug && this.name) {
    this.slug = await generateUniqueSlug("Event", this.name);
  }
});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;
