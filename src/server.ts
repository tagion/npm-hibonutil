import express, { Application } from "express";

export class Server {
  private app: Application;

  constructor(public readonly port: number = 3000) {
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
        process.exit(0);
      }

      // TBD: handle request
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
