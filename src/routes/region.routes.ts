import express from "express";
import regionController from "../controllers/region.controller";

const router = express.Router();

router.get(
  "/regions",
  regionController.getAllProvinces
  /* 
  #swagger.tags = ["Regions"]
  */
);
router.get(
  "/regions/:id/province",
  regionController.getProvince
  /* 
    #swagger.tags = ["Regions"]
    #swagger.parameters['id'] = {
        description: 'ID of the province',
        type: 'integer'
    }
    */
);
router.get(
  "/regions/:id/regency",
  regionController.getRegency
  /* 
    #swagger.tags = ["Regions"]
    #swagger.parameters['id'] = {
        description: 'ID of the regency',
        type: 'integer'
    }
    */
);
router.get(
  "/regions/:id/district",
  regionController.getDistrict
  /* 
    #swagger.tags = ["Regions"]
    #swagger.parameters['id'] = {
        description: 'ID of the district',
        type: 'integer'
    }
    */
);
router.get(
  "/regions/:id/village",
  regionController.getVillage
  /* 
    #swagger.tags = ["Regions"]
    #swagger.parameters['id'] = {
        description: 'ID of the village',
        type: 'integer'
    }
    */
);
router.get(
  "/regions-search",
  regionController.findByCity
  /* 
    #swagger.tags = ["Regions"]
    #swagger.parameters['city'] = {
        description: 'City name to search for regions',
        type: 'string'
    }
    */
);

export default router;
