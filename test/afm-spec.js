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
		when("an AFM object is initialised", () => {
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
		
		when("initialising with AFM data", () => {
			let json, afm;
			
			before(() => {
				json = JSON.parse(load("fixtures/bgb.json"));
				afm = new AdobeFontMetrics(load("fixtures/bgb.afm"));
				afm.format.should.equal("afm");
				afm.version.should.equal("3.0");
			});
			
			it("stores global font information in its `globalInfo` hash", () => {
				afm.should.have.property("globalInfo").which.eqls({
					ascender: 750,
					boundingBox: [-167, -239, 1294, 988],
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
				}).which.eqls(json.globalInfo);
			});
			
			it("stores character metrics in its `charMetrics` array", () => {
				afm.should.have.property("charMetrics").which.is.an("array").with.lengthOf(229);
				afm.charMetrics[0].constructor.name.should.equal("CharacterMetric");
				afm.charMetrics[0].should.eql({
					code: 32,
					name: "space",
					widths: [278, 0],
					heights: [0, 0],
					boundingBox: [0, 0, 0, 0],
					ligatures: {},
				});
				afm.charMetrics.should.eql(json.charMetrics);
				CharacterMetric = afm.charMetrics[0].constructor;
			});
			
			it("stores character composites in its `composites` array", () => {
				afm.should.have.property("composites").which.is.an("array").with.lengthOf(56);
				afm.composites[0].constructor.name.should.equal("CharacterComposite");
				afm.composites[0].should.eql({
					name: "Aacute",
					parts: [
						{char: "A", offset: [0, 0]},
						{char: "acute", offset: [83, 206]},
					],
				});
				afm.composites.should.eql(json.composites);
				CharacterComposite = afm.composites[0].constructor;
			});
			
			it("stores track-kerning data in its `trackKerns` array", () => {
				afm.should.have.property("trackKerns").which.is.an("array").with.lengthOf(3);
				afm.trackKerns[0].constructor.name.should.equal("TrackKern");
				afm.trackKerns.should.eql([
					{degree: -1, minKern: 0.08, maxKern: -1.76, minPointSize: 6, maxPointSize: 144},
					{degree: -2, minKern: 0.04, maxKern: -3.39, minPointSize: 6, maxPointSize: 144},
					{degree: -3, minKern: 0,    maxKern: -5.02, minPointSize: 6, maxPointSize: 144},
				]).and.eql(json.trackKerns);
				TrackKern = afm.trackKerns[0].constructor;
			});
			
			when("assigning properties which change between writing systems", () => {
				it("stores them in a hash-map indexed by writing direction", () => {
					afm.should.have.property("directions").which.is.an("array").with.lengthOf(2);
					afm.directions[0].should.eql({
						isFixedPitch: false,
						italicAngle: 0,
						kerningPairs: afm.directions[0].kerningPairs,
						underlinePosition: -94,
						underlineThickness: 92,
					});
					afm.directions[0].kerningPairs.slice(0, 5).should.eql([
						{chars: ["hyphen", "C"], offset: [19, 0]},
						{chars: ["hyphen", "G"], offset: [19, 0]},
						{chars: ["hyphen", "J"], offset: [37, 0]},
						{chars: ["hyphen", "O"], offset: [19, 0]},
						{chars: ["hyphen", "T"], offset: [-60, 0]},
					]);
					afm.directions[0].kerningPairs.should.eql(json.directions[0].kerningPairs);
					KerningPair = afm.directions[0].kerningPairs[0].constructor;
				});
				it("leaves the other hash-map empty if the other system isn't supported", () =>
					afm.directions[1].should.eql({}));
			});
		});


		when("initialising with AMFM data", () => {
			let amfm = null;
			
			before(() => {
				amfm = new AdobeFontMetrics(load("fixtures/impossible.amm"));
				amfm.should.have.property("format").which.equals("amfm");
				amfm.should.have.property("version").which.equals("4.1");
			});
			
			it("assigns to the `globalInfo` hash like the other types do", () => {
				amfm.should.have.property("globalInfo").which.eqls({
					ascender:       812,
					capHeight:      812,
					descender:      240,
					encodingScheme: "FontSpecific",
					familyName:     "ImpossibleMM",
					fontName:       "ImpossibleMM",
					fullName:       "ImpossibleMM",
					notice:         "© Apostrophe ('). Distribute freely. apostrofe@mail.com",
					version:        "001.001",
					weight:         "All (Multiple Master)",
					weightVector:   [1, 0, 0, 0, 0, 0, 0, 0],
					boundingBox:    [-101, -234, 1000, 983],
					xHeight:        662,
					
					// The actual designer's stuff
					blendAxisTypes: ["Width", "OpticalSize", "Serif"],
					blendDesignMap: [
						[[0, 0], [1000, 1]],
						[[0, 0], [1000, 1]],
						[[0, 0], [1000, 1]],
					],
					blendDesignPositions: [
						[0, 0, 0],
						[1, 0, 0],
						[0, 1, 0],
						[1, 1, 0],
						[0, 0, 1],
						[1, 0, 1],
						[0, 1, 1],
						[1, 1, 1],
					],
				});
			});
			
			it("stores axis information in its `axes` array", () => {
				amfm.should.have.property("axes").which.eqls([
					{label: "Width", type: "Width"},
					{label: "OpticalSize", type: "OpticalSize"},
					{label: "Serif", type: "Serif"},
				]);
			});
			
			it("stores primary-font information in its `primaryFonts` array", () => {
				amfm.should.have.property("primaryFonts").which.eqls([
					{coordinates: [215, 300], labels: ["LT", "_", "CN"], name: "a(Light Condensed)"},
					{coordinates: [1000, 1000, 0,    0, 0,   1000, 0,    0], labels: [], name: ""},
					{coordinates: [0,    1000, 0,    0, 465, 465,  0,    0], labels: [], name: ""},
					{coordinates: [465,  465,  0,    0, 0,   0,    1000, 0], labels: [], name: ""},
					{coordinates: [0,    0,    1000, 0, 465, 485,  1000, 0], labels: [], name: ""},
					{coordinates: [465,  485,  1000, 0, 999, 999,  999,  0], labels: [], name: ""},
					{coordinates: [999,  999,  999,  0, 0,   0,    0,    0], labels: [], name: ""},
				]);
				amfm.primaryFonts[0].constructor.name.should.equal("PrimaryFont");
				PrimaryFont = amfm.primaryFonts[0].constructor;
			});
			
			it("stores master-font information in its `masters` array", () => {
				amfm.should.have.property("masters").which.is.an("array").with.lengthOf(8);
				amfm.masters[0].should.eql({
					weightVector: [1, 0, 0, 0, 0, 0, 0, 0],
					fontName: "ImpossibleMM_0_wd_0_op_0_sr",
					fullName: "ImpossibleMM_0 wd 0 op 0 sr",
					familyName: "ImpossibleMM",
				});
				amfm.masters.should.eql(JSON.parse(load("fixtures/masters.json")));
			});
		});
	});
});
