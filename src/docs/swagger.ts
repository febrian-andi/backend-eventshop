import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation - Event Shop",
    description: "API documentation for the Event Shop application",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://backend-eventshop.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT authorization header using the Bearer scheme. Example: 'Authorization: Bearer <token>'",
      },
    },
    schemas: {
      RegisterRequest: {
        fullName: "",
        userName: "",
        email: "tes123@example.com",
        password: "",
        confirmPassword: "",
      },
      LoginRequest: {
        identifier: "",
        password: "",
      },
      ActivationRequest: {
        code: "",
      },
      CreateOrUpdateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateOrUpdateEventRequest: {
        name: "",
        banner:"",
        category: "category ObjectID",
        description: "",
        startDate: "yyy-mm-dd hh:mm:ss",
        endDate: "yyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
        },
        isOnline: false,
        isFeatured: false,
      },
      RemoveMediaRequest: {
        fileUrl: "fileUrl"
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
