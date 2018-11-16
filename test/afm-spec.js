"use strict";

const {load, when} = require("./utils.js");

describe("AdobeFontMetrics", () => {
	const AdobeFontMetrics = require("..");
	
	// Internal/unexported classes
	let CharacterMetric    = null;
	let CharacterComposite = null;
	let KerningPair        = null;
	let PrimaryFont        = null;
	let TrackKern          = null;
	
	describe("Initialisation", () => {
		when("an AFM object is newly-initialised", () => {
			it("has default properties with empty values", () => {
				const afm = new AdobeFontMetrics();
				afm.should.have.property("format").which.equals("");
				afm.should.have.property("version").which.equals("");
				afm.should.have.property("globalInfo").which.eqls({});
				afm.should.have.property("directions").which.eqls([{}, {}]);
				afm.should.have.property("charMetrics").which.eqls([]);
				afm.should.have.property("composites").which.eqls([]);
				afm.should.have.property("trackKerns").which.eqls([]);
				afm.should.have.property("userFields").which.eqls(new Map());
			});
			
			it("stores type and version headers if present", () => {
				const afm = new AdobeFontMetrics("StartFontMetrics 4.1\n");
				afm.should.have.property("format").which.equals("afm");
				afm.should.have.property("version").which.equals("4.1");
			});
		});
		
		when("initialised with AFM data", () => {
			let afm = null;
			
			before(() => {
				afm = new AdobeFontMetrics(load("fixtures/Bell Gothic Black.afm"));
				afm.format.should.equal("afm");
				afm.version.should.equal("3.0");
			});
			
			it("stores global font information in its `globalKeys` hash", () => {
				afm.should.have.property("globalInfo").which.eqls({
					ascender: 750,
					boundingBox: [-167, -239, 1294],
					capHeight: 731,
					descender: -174,
					encodingScheme: "AdobeStandardEncoding",
					familyName: "Bell Gothic",
					fontName: "BellGothicBT-Black",
					fullName: "Bell Gothic Black",
					notice: "Copyright 1987-1999 as an unpublished work by Bitstream Inc.  All rights reserved.  Confidential.",
					version: "003.001",
					weight: "Extrabold",
					xHeight: 532,
				});
			});
			
			it("stores character metrics in its `charMetrics` array", () => {
				afm.should.have.property("charMetrics").which.is.an("array").with.lengthOf(229);
				afm.charMetrics[0].constructor.name.should.equal("CharacterMetric");
				CharacterMetric = afm.charMetrics[0].constructor;
				afm.charMetrics.should.eql(require("./fixtures/bgb-chars.json"));
			});
			
			it("stores character composites in its `composites` array", () => {
				afm.should.have.property("composites").which.is.an("array").with.lengthOf(56);
				afm.composites[0].constructor.name.should.equal("CharacterComposite");
				CharacterComposite = afm.composites[0].constructor;
				afm.composites.should.eql(require("./fixtures/bgb-composites.json"));
			});
		});
	});
});
