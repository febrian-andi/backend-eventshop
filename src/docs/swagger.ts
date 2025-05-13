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
        fullName: "tes 123",
        userName: "tes-123",
        email: "tes123@example.com",
        password: "1234ABCD",
        confirmPassword: "1234ABCD",
      },
      LoginRequest: {
        identifier: "tes-123",
        password: "12345678",
      },
      ActivationRequest: {
        code: "1234567890abcdef",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
