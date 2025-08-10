import { z } from "zod";

export const imageSchema = z
  .custom<FileList>(
    (val) =>
      typeof window !== "undefined" &&
      val instanceof FileList &&
      val.length > 0,
    { message: "Please select an image" }
  )
  .refine(
    (files) =>
      files &&
      Array.from(files).every((file) => file.type.startsWith("image/")),
    { message: "Only image files are allowed" }
  )
  .refine(
    (files) =>
      files && Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
    { message: "Max file size is 5MB" }
  );
