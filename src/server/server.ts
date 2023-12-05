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
     *       description: |
     *         JSON data to convert.
     *
     *         *The body size should be less than 100kb*
     *       required: true
     *       content:
     *         application/json:
     *           examples:
     *             SampleJSON:
     *               $ref: '#/components/examples/sampleJson'
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/octet-stream:
     *             examples:
     *               SampleHiBON:
     *                 $ref: '#/components/examples/sampleHiBON'
     *       413:
     *         description: Payload Too Large. The request entity exceeds server's limitations. Default size limit is 100kb
     *       500:
     *         description: Internal error in handling request
     */
    this.app.post("/hibonutil/convert", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const buffer = hibonutil.fromJSON(hibon.toJSONBuffer());

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

    /**
     * @swagger
     * /hibonutil/validate:
     *   post:
     *     summary: Validate HiBON JSON with hibonutil
     *     tags:
     *       - hibonutil
     *     produces:
     *       - text/plain
     *     requestBody:
     *       description: |
     *         JSON data to verify.
     *
     *         *The body size should be less than 100kb*
     *       required: true
     *       content:
     *         application/json:
     *           examples:
     *             SampleJSON:
     *               $ref: '#/components/examples/sampleJson'
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *             examples:
     *               DummyText:
     *                 $ref: '#/components/examples/sampleVerifyText'
     *       413:
     *         description: Payload Too Large. The request entity exceeds server's limitations. Default size limit is 100kb
     */
    this.app.post("/hibonutil/validate", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const buffer = hibonutil.fromJSON(hibon.toJSONBuffer());

      if (buffer) {
        res.type("text/plain");
        res.send(
          "We have no updated hibonutil yet, but HiBON you've sent valid, trust me\nHere's your buffer:\n" +
            buffer.toString("utf8")
        );
        res.status(200);
      } else {
        res.send("I'm sorry, but your HiBON is malformed");
        res.status(400);
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
        servers: [
          { url: "https://hibon.tagion.org" },
          { url: "https://test-hibon.tagion.org" },
          { url: "https://dev-hibon.tagion.org" },
          { url: `http://localhost:${this.port}` },
        ],
        tags: [
          {
            name: "hibonutil",
            description: "Operations related to hibonutil tool",
          },
        ],
        schemes: ["http"],
      },
      apis: [fileURLToPath(import.meta.url)],
    };
    options.apis.push("src/server/swagger.yaml");

    const specs = swaggerJsdoc(options);

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  public start() {
    const installed = hibonutil.isInstalled();
    console.log(`Checking ${hibonutil.name}...`, installed);

    if (installed) {
      this.app.listen(this.port, () => {
        console.log(`Server listening on port ${this.port}`);
        if (this.trusted_mode) console.log(`Server started in trusted mode`);
      });
    } else {
      console.error(`Can't start server without ${hibonutil.name} installed!`);
    }
  }
}
