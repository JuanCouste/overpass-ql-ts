import "?/checkConnection";
//
import { describe } from "@jest/globals";
import { standaloneAnyTests } from "./any";
import { standaloneAroundTests } from "./around";
import { standaloneBBoxTests } from "./bbox";
import { standaloneByTagsTests } from "./byTags";
import { standaloneForEachTests } from "./foreach";
import { standaloneByIdTests } from "./id";
import { standaloneIfFilterTests } from "./ifFilter";
import { standaloneInAreaTests } from "./inArea";
import { standaloneIntersectTests } from "./intersect";
import { standaloneOutTests } from "./out";
import { standalonePivotTests } from "./pivot";
import { standalonePolygonTests } from "./polygon";
import { standaloneRecurseTests } from "./recurse";
import { standaloneRootRecurseTests } from "./rootRecurse";

/** For information regarding tests see /test/README.md */

describe("Standalone statements", () => {
	describe("By id", standaloneByIdTests);
	describe("BBox", standaloneBBoxTests);
	describe("By tags", standaloneByTagsTests);
	describe("Polygon", standalonePolygonTests);
	describe("Intersect", standaloneIntersectTests);
	describe("Any", standaloneAnyTests);
	describe("Root Recurse", standaloneRootRecurseTests);
	describe("Recurse", standaloneRecurseTests);
	describe("IfFilter", standaloneIfFilterTests);
	describe("Around", standaloneAroundTests);
	describe("In area", standaloneInAreaTests);
	describe("Pivot", standalonePivotTests);
	describe("Out", standaloneOutTests);
	describe("ForEach", standaloneForEachTests);
});
