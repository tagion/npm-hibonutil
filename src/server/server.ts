import express, { Application, Request, Response, NextFunction } from "express";
import { HiBON } from "../hibon/HiBON.js";
import { hibonutil } from "../tagion/hibonutil.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

export class Server {
  private app: Application;

  constructor(
    public readonly port: number = 3000,
    public readonly trusted_mode = false
  ) {
    this.app = express();
  }

  public defaultSettings() {
    this.app.use(express.json());

    // Validate JSON and handle possible errors
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if ((err instanceof SyntaxError && "body" in err) || !req.is("json")) {
          console.error(`${err.name}: ${err.message}`);
          return res.sendStatus(400); // Bad request
        }
        next();
      }
    );

    /**
     * @swagger
     * /hibonutil/convert:
     *   post:
     *     summary: Convert JSON to HiBON format
     *     tags:
     *       - hibonutil
     *     produces:
     *       - application/octet-stream
     *     requestBody:
     *       description: JSON data to convert
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/octet-stream:
     *             schema:
     *               type: string
     *       500:
     *         description: Internal error in handling request
     */
    this.app.post("/hibonutil/convert", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const buffer = hibonutil.fromBuffer(hibon.toJSONBuffer());

      if (buffer) {
        // Send raw stream in response
        res.setHeader("Content-Type", "application/octet-stream");
        res.write(buffer);
        res.status(200);
        res.end();
      } else {
        res.status(500);
        res.send("Internal error in handling request");
      }
    });

    // Enable shutting down server with request only in trusted mode
    if (this.trusted_mode) {
      this.app.use("/stop", (_, res) => {
        res.status(200);
        res.send("Stop");

        console.log("Stopping server...");

        process.exit(0);
      });
    }

    this.setUpSwagger();
  }

  private setUpSwagger() {
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "HiBON SDK API",
          version: "1.0.0",
          description: "Specification for testing API of HiBON SDK",
        },
        servers: [{ url: `http://localhost:${this.port}` }],
        tags: [
          {
            name: "hibonutil",
            description: "Operations related to hibonutil tool",
          },
          {
            name: "system",
            description: "System operations",
          },
        ],
        schemes: ["http"],
      },
      apis: [fileURLToPath(import.meta.url)],
    };

    const specs = swaggerJsdoc(options);

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
      if (this.trusted_mode) console.log(`Server started in trusted mode`);
    });
  }
}
