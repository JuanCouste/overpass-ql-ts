import "?/checkConnection";
//
import { describe } from "@jest/globals";
import { standaloneAnyTests } from "./any";
import { standaloneBBoxTests } from "./bbox";
import { standaloneByIdTests } from "./id";
import { standaloneIntersectTests } from "./intersect";
import { standalonePolygonTests } from "./polygon";
import { standaloneQueryTests } from "./query";
import { standaloneRecurseTests } from "./recurse";

describe("Standalone statements", () => {
	describe("By id", standaloneByIdTests);
	describe("BBox", standaloneBBoxTests);
	describe("Query", standaloneQueryTests);
	describe("Polygon", standalonePolygonTests);
	describe("Intersect", standaloneIntersectTests);
	describe("Any", standaloneAnyTests);
	describe("Recurse", standaloneRecurseTests);
});
