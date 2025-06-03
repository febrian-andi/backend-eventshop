import mongoose from "mongoose";

export async function generateUniqueSlug(
  modelName: string,
  name: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end

  let finalSlug = baseSlug;
  let counter = 100;

  const Model = mongoose.models[modelName];

  let query: any = { slug: finalSlug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  while (await Model.exists(query)) {
    finalSlug = `${baseSlug}-${counter++}`;
    query.slug = finalSlug;
  }

  return finalSlug;
}