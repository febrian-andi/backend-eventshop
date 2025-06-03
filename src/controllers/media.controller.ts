import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      res.status(400).json({
        data: null,
        message: "File is not exist",
      });
      return;
    }

    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      res.status(200).json({
        data: result,
        message: "File uploaded successfully",
      });
      return;
    } catch (error) {
      res.status(500).json({
        data: null,
        message: "file upload failed : " + error,
      });
      return;
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      res.status(400).json({
        data: null,
        message: "Files are not exist",
      });
      return;
    }

    try {
      const result = await uploader.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      res.status(200).json({
        data: result,
        message: "Files uploaded successfully",
      });
      return;
    } catch (error) {
      res.status(500).json({
        data: null,
        message: "files upload failed : " + error,
      });
      return;
    }
  },

  async remove(req: IReqUser, res: Response) {
    const { fileUrl } = req.body as { fileUrl: string };

    try {
        const result = await uploader.remove(fileUrl);
        res.status(200).json({
            data: result,
            message: "File removed successfully",
        });
        return;
    } catch (error) {
        res.status(500).json({
            data: null,
            message: "file remove failed : " + error,
        });
        return;
    }
  },
};
