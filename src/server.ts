import express, { Application } from "express";
import { JSONCollector } from "./JSONCollector";

export class Server {
  private app: Application;

  constructor(
    public collector: JSONCollector,
    public readonly port: number = 3000
  ) {
    this.app = express();

    this.setup();
  }

  private setup() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.post("/hibonutil", (req, res) => {
      const key = req.body.key;
      const type = req.body.type;
      const value = req.body.value;

      const success: boolean = key && type && value;

      if (success) {
        res.status(200);
        res.send("OK");
      } else {
        res.status(400);
        res.send("Wrong parameters");
        this.collector.cleanup();
        process.exit(0);
      }

      if (type === "null") {
        // call hibonutil with JSON
        // this.collector.cleanup();
        process.exit(0); // Exit the server after receiving null-type
      }

      this.collector.updateJSON(key, type, value);
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
