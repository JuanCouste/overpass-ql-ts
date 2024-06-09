import { NoOverpassStringSanitizer } from "@/imp";
import { OverpassStringSanitizer } from "@/model";

export const NO_SANITIZER: OverpassStringSanitizer = new NoOverpassStringSanitizer();
