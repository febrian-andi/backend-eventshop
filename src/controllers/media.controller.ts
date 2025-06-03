import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      response.error(res, null, "file is not exist");
      return;
    }

    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      response.success(res, result, "File uploaded successfully");
      return;
    } catch (error) {
      response.error(res, error, "File upload failed");
      return;
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      response.error(res, null, "files are not exist");
      return;
    }

    try {
      const result = await uploader.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      response.success(res, result, "Files uploaded successfully");
      return;
    } catch (error) {
      response.error(res, error, "Files upload failed");
      return;
    }
  },

  async remove(req: IReqUser, res: Response) {
    const { fileUrl } = req.body as { fileUrl: string };

    try {
        const result = await uploader.remove(fileUrl);
        response.success(res, result, "File removed successfully");
        return;
    } catch (error) {
        response.error(res, error, "File removal failed");
        return;
    }
  },
};
