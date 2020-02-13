import { Animation, Frame } from "./atlas-types";

export class Atlas {
    constructor(public frames: Frame[], public animations?: Animation[]) {}
}
