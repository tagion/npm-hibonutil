import express, { Application, Request, Response, NextFunction } from "express";
import { HiBON } from "./hibon/HiBON.js";
import { hibonutil } from "./tagion/hibonutil.js";
import { writeFileSync } from "fs";

export class Server {
  private app: Application;

  constructor(public readonly port: number = 3000) {
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

    this.app.post("/hibonutil/convert", (req, res) => {
      const hibon = new HiBON(JSON.stringify(req.body));
      const buffer = hibonutil.fromBuffer(hibon.toJSONBuffer());

      if (buffer) {
        writeFileSync("tmp/script_out2.hibon", buffer.toString("binary"));
        console.log("Decoded JSON:");
        console.log(hibonutil.fromBuffer(buffer)?.toString("utf8"));

        res.status(200);
        res.json({ hibon: buffer.toString("binary") });
      } else {
        res.status(500);
        res.send("Error in handling request");
      }
    });

    this.app.post("/stop", (_, res) => {
      res.status(200);
      res.send("Stop");

      console.log("Stopping server...");

      process.exit(0);
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
