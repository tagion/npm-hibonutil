import express, { Application, Request, Response, NextFunction } from "express";
import { HiBON } from "../hibon/HiBON.js";
import { hibonutil } from "../tagion/hibonutil.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as http from "http";
import bodyParser from "body-parser";

export const DEFAULT_PROD_PORT: number = 3000;
export const DEFAULT_TEST_PORT: number = 3001;

function defaultPort(): number {
  return process.env.NODE_ENV === "test"
    ? DEFAULT_TEST_PORT
    : DEFAULT_PROD_PORT;
}

export class Server {
  private app: Application;
  private serverInstance: http.Server | null = null;

  public readonly port: number = defaultPort();
  public readonly trusted_mode: boolean = false;

  constructor(port?: number, trusted_mode?: boolean) {
    if (port) this.port = port;
    if (trusted_mode) this.trusted_mode = trusted_mode;

    this.app = express();
  }

  public defaultSettings() {
    this.app.use(bodyParser.json({ limit: "1mb" }));

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
     *       - text/plain
     *     parameters:
     *       - in: query
     *         name: format
     *         schema:
     *           type: string
     *           enum: [octet-stream, base64]
     *         required: false
     *         description: Specify the format of the response. Options are 'octet-stream' (default) and 'base64'.
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
     *           text/plain:
     *             examples:
     *               SampleBase64:
     *                 $ref: '#/components/examples/sampleBase64'
     *       400:
     *         description: Bad Request. Invalid format specified
     *       413:
     *         description: Payload Too Large. The request entity exceeds server's limitations. Default size limit is 1mb
     *       500:
     *         description: Internal error in handling request
     */
    this.app.post("/hibonutil/convert", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));

      const format = req.query.format;
      if (format === "base64") {
        const base64hibon = hibonutil.getHiBONBase64(hibon);
        if (!base64hibon) {
          res.status(500);
          res.send("Internal error in handling request");
          return;
        }

        res.setHeader("Content-Type", "text/plain");
        res.send(base64hibon);
      } else if (!format || format === "octet-stream") {
        const buffer = hibonutil.fromJSON(hibon.toJSONBuffer());
        if (!buffer) {
          res.status(500);
          res.send("Internal error in handling request");
          return;
        }

        res.setHeader("Content-Type", "application/octet-stream");
        res.write(buffer);
        res.status(200).end();
      } else {
        res
          .status(400)
          .send(
            `Invalid format '${format}'. Valid options are 'base64' or 'octet-stream'.`
          );
        return;
      }
    });

    /**
     * @swagger
     * /hibonutil/dartindex:
     *   post:
     *     summary: Calculate DART index of HiBONJSON
     *     tags:
     *       - hibonutil
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: |
     *         JSON data to calculate.
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
     *           application/json:
     *             examples:
     *               SampleDARTIndex:
     *                 $ref: '#/components/examples/sampleDARTIndex'
     *       413:
     *         description: Payload Too Large. The request entity exceeds server's limitations. Default size limit is 1mb
     *       500:
     *         description: Internal error in handling request
     */
    this.app.post("/hibonutil/dartindex", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const dart_index = hibonutil.getDARTIndex(hibon);

      if (dart_index) {
        res.json({ dartindex: dart_index });
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
     *           application/json:
     *             examples:
     *               ValidExample:
     *                 $ref: '#/components/examples/sampleValid'
     *               InvalidExample:
     *                 $ref: '#/components/examples/sampleInvalid'
     *       413:
     *         description: Payload Too Large. The request entity exceeds server's limitations. Default size limit is 1mb
     *       500:
     *         description: Internal error in handling request
     */
    this.app.post("/hibonutil/validate", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const executionResult = hibonutil.validateJSON(hibon);

      if (executionResult) {
        res.json(executionResult);
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
      apis: ["src/server/server.ts", "src/server/swagger.yaml"],
    };

    const specs = swaggerJsdoc(options);

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  public start() {
    const installed = hibonutil.isInstalled();
    console.log(`Checking ${hibonutil.name}...`, installed);

    if (installed) {
      this.serverInstance = this.app.listen(this.port, () => {
        console.log(`Server listening on port ${this.port}`);
        if (this.trusted_mode) console.log(`Server started in trusted mode`);
      });
    } else {
      console.error(`Can't start server without ${hibonutil.name} installed!`);
    }
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.serverInstance) {
        this.serverInstance.close((err) => {
          if (err) {
            console.error("Error shutting down the server:", err);
            reject(err);
            return;
          }
          console.log("Server successfully closed");
          resolve();
        });
      } else {
        console.log("Server is not running");
        resolve();
      }
    });
  }
}
