import { IClock } from "../../application/ports/clock/IClock";

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}