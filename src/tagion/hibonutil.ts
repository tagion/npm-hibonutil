import { run_binary } from "./../utils";

export class hibonutil {
  readonly name: string = "hibonutil";

  static help() {
    run_binary(this.name, ["-h"]);
  }

  static sample() {
    run_binary(this.name, ["--sample"]);
  }

  static JSONtoHiBON() {}
}
