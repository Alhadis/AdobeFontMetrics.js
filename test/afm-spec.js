"use strict";

const AdobeFontMetrics = require("..");
const {when} = require("./utils.js");

when("parsing AFM data", () => {
	it("stores format and version headers", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 3.5\n");
		afm.should.have.property("format").which.equals("afm");
		afm.should.have.property("version").which.equals("3.5");
	});
	
	when("parsing control information", () => {
		it("stores `MetricsSets`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nMetricsSets 1\n");
			afm.should.have.property("globalInfo").which.is.an("object");
			afm.globalInfo.should.have.property("metricsSets").which.equals(1);
		});
	});
	
	when("parsing global font information", () => {
		it("stores `FontName`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFontName Foo\n");
			afm.globalInfo.should.have.property("fontName").which.equals("Foo");
		});
		
		it("stores `FullName`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFullName Bar\n");
			afm.globalInfo.should.have.property("fullName").which.equals("Bar");
		});
		
		it("stores `FamilyName`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFamilyName Baz\n");
			afm.globalInfo.should.have.property("familyName").which.equals("Baz");
		});
		
		it("stores `Weight`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nWeight Bold\n");
			afm.globalInfo.should.have.property("weight").which.equals("Bold");
		});
		
		it("stores `FontBBox`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFontBBox 34 65 100 300\n");
			afm.globalInfo.should.have.property("boundingBox").which.eqls([34, 65, 100, 300]);
		});
		
		it("stores `Version`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nVersion 001.000\n");
			afm.globalInfo.should.have.property("version").which.equals("001.000");
		});
		
		it("stores `Notice`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nNotice Foo Bar\n");
			afm.globalInfo.should.have.property("notice").which.equals("Foo Bar");
		});
		
		it("stores `EncodingScheme`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nEncodingScheme Foo\n");
			afm.globalInfo.should.have.property("encodingScheme").which.equals("Foo");
		});
		
		it("stores `MappingScheme`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nMappingScheme 5\n");
			afm.globalInfo.should.have.property("mappingScheme").which.equals(5);
		});
		
		it("stores `EscChar`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nEscChar 27\n");
			afm.globalInfo.should.have.property("escChar").which.equals(27);
		});
		
		it("stores `CharacterSet`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCharacterSet Foo\n");
			afm.globalInfo.should.have.property("characterSet").which.equals("Foo");
		});
		
		it("stores `Characters`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCharacters 360\n");
			afm.globalInfo.should.have.property("characters").which.equals(360);
		});
		
		it("stores `IsBaseFont`", () => {
			let afm = new AdobeFontMetrics("StartFontMetrics 1.0\nIsBaseFont false\n");
			afm.globalInfo.should.have.property("isBaseFont").which.equals(false);
			
			afm = new AdobeFontMetrics("StartFontMetrics 2.0\nIsBaseFont true\n");
			afm.globalInfo.should.have.property("isBaseFont").which.equals(true);
		});
		
		it("stores `VVector`", () => {
			let afm = new AdobeFontMetrics("StartFontMetrics 1.0\nVVector 120 340\n");
			afm.globalInfo.should.have.property("vVector").which.eqls([120, 340]);
			
			afm = new AdobeFontMetrics("StartFontMetrics 2.0\nVVector -200\n");
			afm.globalInfo.should.have.property("vVector").which.eqls([-200]);
		});
		
		it("stores `IsFixedV`", () => {
			let afm = new AdobeFontMetrics("StartFontMetrics 1.0\nIsFixedV false\n");
			afm.globalInfo.should.have.property("isFixedV").which.equals(false);
			
			afm = new AdobeFontMetrics("StartFontMetrics 2.0\nIsFixedV true\n");
			afm.globalInfo.should.have.property("isFixedV").which.equals(true);
		});
		
		it("stores `CapHeight`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCapHeight 320\n");
			afm.globalInfo.should.have.property("capHeight").which.equals(320);
		});
		
		it("stores `XHeight`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nXHeight 430\n");
			afm.globalInfo.should.have.property("xHeight").which.equals(430);
		});
		
		it("stores `Ascender`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nAscender 540\n");
			afm.globalInfo.should.have.property("ascender").which.equals(540);
		});
		
		it("stores `Descender`", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nDescender 256\n");
			afm.globalInfo.should.have.property("descender").which.equals(256);
		});
		
		it("stores user-defined fields", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nunknownField Foo\n");
			afm.should.have.property("userFields").which.is.an.instanceOf(Map);
			afm.userFields.get("unknownField").should.equal("Foo");
		});
	});
	
	when("parsing direction-specific properties", () => {
		when("direction 0 is specified", () => {
			const str = "StartFontMetrics 1.0\nStartDirection 0\n";
			
			it("stores `UnderlinePosition`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlinePosition 34\n`);
				afm.directions[0].should.eql({underlinePosition: 34});
				afm.directions[1].should.eql({});
			});
			
			it("stores `UnderlineThickness`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlineThickness 55\n`);
				afm.directions[0].should.eql({underlineThickness: 55});
				afm.directions[1].should.eql({});
			});
			
			it("stores `ItalicAngle`", () => {
				const afm = new AdobeFontMetrics(`${str}ItalicAngle 180\n`);
				afm.directions[0].should.eql({italicAngle: 180});
				afm.directions[1].should.eql({});
			});
			
			it("stores `CharWidth`", () => {
				const afm = new AdobeFontMetrics(`${str}CharWidth 32 64\n`);
				afm.directions[0].should.eql({charWidth: [32, 64]});
				afm.directions[1].should.eql({});
			});
			
			it("stores `IsFixedPitch`", () => {
				const afm = new AdobeFontMetrics(`${str}IsFixedPitch false\n`);
				afm.directions[0].should.eql({isFixedPitch: false});
				afm.directions[1].should.eql({});
			});
		});
		
		when("direction 1 is specified", () => {
			const str = "StartFontMetrics 2.0\nStartDirection 1\n";
			
			it("stores `UnderlinePosition`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlinePosition 86\n`);
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({underlinePosition: 86});
			});
			
			it("stores `UnderlineThickness`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlineThickness 110\n`);
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({underlineThickness: 110});
			});
			
			it("stores `ItalicAngle`", () => {
				const afm = new AdobeFontMetrics(`${str}ItalicAngle 270\n`);
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({italicAngle: 270});
			});
			
			it("stores `CharWidth`", () => {
				const afm = new AdobeFontMetrics(`${str}CharWidth 35 48\n`);
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({charWidth: [35, 48]});
			});
			
			it("stores `IsFixedPitch`", () => {
				const afm = new AdobeFontMetrics(`${str}IsFixedPitch false\n`);
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({isFixedPitch: false});
			});
		});
		
		when("direction 2 is specified", () => {
			const str = "StartFontMetrics 3.2\nStartDirection 2\n";
			
			it("stores `UnderlinePosition`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlinePosition -85\n`);
				afm.directions[0].should.eql({underlinePosition: -85});
				afm.directions[1].should.eql(afm.directions[0]);
			});
			
			it("stores `UnderlineThickness`", () => {
				const afm = new AdobeFontMetrics(`${str}UnderlineThickness 5\n`);
				afm.directions[0].should.eql({underlineThickness: 5});
				afm.directions[1].should.eql(afm.directions[0]);
			});
			
			it("stores `ItalicAngle`", () => {
				const afm = new AdobeFontMetrics(`${str}ItalicAngle -45\n`);
				afm.directions[0].should.eql({italicAngle: -45});
				afm.directions[1].should.eql(afm.directions[0]);
			});
			
			it("stores `CharWidth`", () => {
				const afm = new AdobeFontMetrics(`${str}CharWidth 12 24\n`);
				afm.directions[0].should.eql({charWidth: [12, 24]});
				afm.directions[1].should.eql(afm.directions[0]);
			});
			
			it("stores `IsFixedPitch`", () => {
				const afm = new AdobeFontMetrics(`${str}IsFixedPitch true\n`);
				afm.directions[0].should.eql({isFixedPitch: true});
				afm.directions[1].should.eql(afm.directions[0]);
			});
		});
		
		when("no direction is specified", () => {
			const str = "StartFontMetrics 1.0\n";
			
			it("uses an implied direction of 0", () => {
				let afm = new AdobeFontMetrics(`${str}UnderlinePosition 20\n`);
				afm.directions[0].should.eql({underlinePosition: 20});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`${str}UnderlineThickness 45\n`);
				afm.directions[0].should.eql({underlineThickness: 45});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`${str}ItalicAngle 360\n`);
				afm.directions[0].should.eql({italicAngle: 360});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`${str}CharWidth 40 50\n`);
				afm.directions[0].should.eql({charWidth: [40, 50]});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`${str}IsFixedPitch true\n`);
				afm.directions[0].should.eql({isFixedPitch: true});
				afm.directions[1].should.eql({});
			});
		});
		
		when("multiple directions are specified", () => {
			it("assigns each their respective fields", () => {
				let afm = new AdobeFontMetrics(`
					StartFontMetrics 1.0
					StartDirection 0
					UnderlinePosition -24
					EndDirection
					StartDirection 1
					UnderlineThickness 90
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({underlinePosition: -24});
				afm.directions[1].should.eql({underlineThickness: 90});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 2.0
					StartDirection 0
					CharWidth 20 45
					IsFixedPitch false
					EndDirection
					StartDirection 1
					UnderlinePosition 64
					UnderlineThickness 90
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({charWidth: [20, 45], isFixedPitch: false});
				afm.directions[1].should.eql({underlinePosition: 64, underlineThickness: 90});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 3.0
					StartDirection 1
					UnderlinePosition 256
					UnderlineThickness 40
					EndDirection
					StartDirection 0
					CharWidth 20 40
					IsFixedPitch true
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({charWidth: [20, 40], isFixedPitch: true});
				afm.directions[1].should.eql({underlinePosition: 256, underlineThickness: 40});
			});
			
			it("merges duplicate declarations", () => {
				let afm = new AdobeFontMetrics(`
					StartFontMetrics 1.0
					StartDirection 0
					UnderlinePosition 10
					EndDirection
					StartDirection 0
					UnderlineThickness 24
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({underlinePosition: 10, underlineThickness: 24});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 2.0
					StartDirection 0
					UnderlinePosition -450
					EndDirection
					StartDirection 0
					UnderlinePosition 243
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({underlinePosition: 243});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 3.0
					StartDirection 2
					UnderlineThickness 20
					EndDirection
					StartDirection 0
					IsFixedPitch false
					EndDirection
					StartDirection 1
					UnderlinePosition 65
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({underlineThickness: 20, isFixedPitch: false});
				afm.directions[1].should.eql({underlineThickness: 20, underlinePosition: 65});
			});
			
			it("ignores empty blocks", () => {
				let afm = new AdobeFontMetrics(`
					StartFontMetrics 1.0
					StartDirection 0
					IsFixedPitch false
					EndDirection
					StartDirection 0
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({isFixedPitch: false});
				afm.directions[1].should.eql({});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 1.0
					StartDirection 1
					IsFixedPitch true
					EndDirection
					StartDirection 1
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({isFixedPitch: true});
				
				afm = new AdobeFontMetrics(`
					StartFontMetrics 1.0
					StartDirection 0
					EndDirection
					StartDirection 1
					EndDirection
				`.replace(/^\s+|\t/g, ""));
				afm.directions[0].should.eql({});
				afm.directions[1].should.eql({});
			});
		});
	});
	
	when("parsing character metrics", () => {
		it("initialises fields with empty or zeroed values", () => {
			const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nStartCharMetrics 1\n_\n");
			afm.should.have.property("charMetrics").which.is.an("array");
			afm.charMetrics[0].should.eql({
				code:        -1,
				name:        "",
				widths:      [0, 0],
				heights:     [0, 0],
				boundingBox: [0, 0, 0, 0],
				ligatures:   {},
			});
		});
		
		it("stores character codes in decimal", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 2
				C 150 ;
				C 300 ;
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].code.should.equal(150);
			afm.charMetrics[1].code.should.equal(300);
		});
		
		it("stores character codes in hexadecimal", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 2
				CH <DEAD> ;
				CH <BEEF> ;
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].code.should.equal(0xDEAD);
			afm.charMetrics[1].code.should.equal(0xBEEF);
		});
		
		it("stores character names", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 4
				C -1 ;
				N Foo ;
				N Bar ;
				N Baz ;
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].name.should.be.empty;
			afm.charMetrics[1].name.should.equal("Foo");
			afm.charMetrics[2].name.should.equal("Bar");
			afm.charMetrics[3].name.should.equal("Baz");
		});
		
		it("stores horizontal character widths", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 4
				WX 20
				W0X 50
				C 1 ; WX 60
				C 2 ; W0X 70
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].widths.should.eql([20, 0]);
			afm.charMetrics[1].widths.should.eql([50, 0]);
			afm.charMetrics[2].widths.should.eql([60, 0]);
			afm.charMetrics[3].widths.should.eql([70, 0]);
		});
		
		it("stores horizontal character heights", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 4
				WY 250
				W0Y 64
				C 1 ; WY 320
				C 2 ; W0Y 40
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].heights.should.eql([250, 0]);
			afm.charMetrics[1].heights.should.eql([64,  0]);
			afm.charMetrics[2].heights.should.eql([320, 0]);
			afm.charMetrics[3].heights.should.eql([40,  0]);
		});
		
		it("stores vertical character widths", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 4
				W1X 45
				W1X 90
				C 1 ; W1X 22
				C 2 ; W1X 50
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].widths.should.eql([0, 45]);
			afm.charMetrics[1].widths.should.eql([0, 90]);
			afm.charMetrics[2].widths.should.eql([0, 22]);
			afm.charMetrics[3].widths.should.eql([0, 50]);
		});
		
		it("stores vertical character heights", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 4
				W1Y 45
				W1Y 90
				C 1 ; W1Y 64
				C 2 ; W1Y 20
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].heights.should.eql([0, 45]);
			afm.charMetrics[1].heights.should.eql([0, 90]);
			afm.charMetrics[2].heights.should.eql([0, 64]);
			afm.charMetrics[3].heights.should.eql([0, 20]);
		});
		
		it("can simultaneously set horizontal metrics", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 2
				W 40 80
				W0 26 64
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].widths.should.eql([40, 0]);
			afm.charMetrics[1].widths.should.eql([26, 0]);
			afm.charMetrics[0].heights.should.eql([80, 0]);
			afm.charMetrics[1].heights.should.eql([64, 0]);
		});
		
		it("can simultaneously set vertical metrics", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 1
				W1 256 64
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].widths.should.eql([0, 256]);
			afm.charMetrics[0].heights.should.eql([0, 64]);
		});
		
		it("can simultaneously set homogenous metrics", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 1
				VV 30 80
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].widths.should.eql([30, 30]);
			afm.charMetrics[0].heights.should.eql([80, 80]);
		});
		
		it("stores character bounding boxes", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 6
				B 5 24 30 84
				B 0 0 100 2
				B 2 3 4
				B 5 6
				B 7
				B
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].boundingBox.should.eql([5, 24, 30, 84]);
			afm.charMetrics[1].boundingBox.should.eql([0, 0, 100, 2]);
			afm.charMetrics[2].boundingBox.should.eql([2, 3, 4, 0]);
			afm.charMetrics[3].boundingBox.should.eql([5, 6, 0, 0]);
			afm.charMetrics[4].boundingBox.should.eql([7, 0, 0, 0]);
			afm.charMetrics[5].boundingBox.should.eql([0, 0, 0, 0]);
		});
		
		it("stores ligature sequences", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartCharMetrics 3
				N f ; L i fi ; L l fl ; L f ff
				N F ; L i Fi ; L l Fl ; L f Ff
			`.replace(/^\s+|\t/g, ""));
			afm.charMetrics[0].ligatures.should.eql({i: "fi", l: "fl", f: "ff"});
			afm.charMetrics[1].ligatures.should.eql({i: "Fi", l: "Fl", f: "Ff"});
		});
	});

	when("parsing track kerning data", () => {
		it("stores it as a flat array", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartTrackKern 2
				TrackKern 20 30 40 50 60
				TrackKern 0  0  30 40 50
			`.replace(/^\s+|\t/g, ""));
			afm.should.have.property("trackKerns").which.is.an("array");
			afm.trackKerns[0].should.eql({
				degree:       20,
				minPointSize: 30,
				minKern:      40,
				maxPointSize: 50,
				maxKern:      60,
			});
			afm.trackKerns[1].should.eql({
				degree:       0,
				minPointSize: 0,
				minKern:      30,
				maxPointSize: 40,
				maxKern:      50,
			});
		});
		
		it("initialises each field with zero", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartTrackKern 1
				TrackKern
			`.replace(/^\s+|\t/g, ""));
			afm.trackKerns[0].should.eql({
				degree:       0,
				minPointSize: 0,
				minKern:      0,
				maxPointSize: 0,
				maxKern:      0,
			});
		});
	});
	
	when("parsing pair-wise kerning data", () => {
		it("stores kerning pairs for horizontal writing", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs
				KP A B 3 4
				KP C D 5 6
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].should.have.property("kerningPairs").which.is.an("array");
			afm.directions[0].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [3, 4]},
				{chars: ["C", "D"], offset: [5, 6]},
			]);
			
			(new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs0
				KP A B 3 4
				KP C D 5 6
			`.replace(/^\s+|\t/g, ""))).should.eql(afm);
			
			(new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs 1
				KP A B 3 4
				KP C D 5 6
			`.replace(/^\s+|\t/g, ""))).should.eql(afm);
		});
		
		it("stores kerning pairs for vertical writing", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs1
				KP A B -2 -5
				KP C D 0 600
			`.replace(/^\s+|\t/g, ""));
			afm.directions[1].should.have.property("kerningPairs").which.is.an("array");
			afm.directions[1].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [-2, -5]},
				{chars: ["C", "D"], offset: [0, 600]},
			]);
		});
		
		it("stores kerning pairs for both writing directions", () => {
			let afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs0
				KP AB CD 40 400
				KP EF GH -4 200
				EndKernPairs
				StartKernPairs1
				KP AB CD -20 90
				KP EF GH -9 -30
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].kerningPairs.should.eql([
				{chars: ["AB", "CD"], offset: [40, 400]},
				{chars: ["EF", "GH"], offset: [-4, 200]},
			]);
			afm.directions[1].kerningPairs.should.eql([
				{chars: ["AB", "CD"], offset: [-20, 90]},
				{chars: ["EF", "GH"], offset: [-9, -30]},
			]);
			
			afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs1
				KP AB CD 40 400
				EndKernPairs
				StartKernPairs
				KP A B -20 90
				KP C D -9 -30
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [-20, 90]},
				{chars: ["C", "D"], offset: [-9, -30]},
			]);
			afm.directions[1].kerningPairs.should.eql([
				{chars: ["AB", "CD"], offset: [40, 400]},
			]);
		});
		
		it("can specify characters by codepoint instead of name", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs
				KPH <DEAD> <BEEF> 30 40
				KPH <BABE> <FACE> -2 -4
				EndKernPairs
				StartKernPairs1
				KPH <100> <3B0> 50 0
				KPH <2B> <8FBA> 0 90
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].kerningPairs.should.eql([
				{chars: [0xDEAD, 0xBEEF], offset: [30, 40]},
				{chars: [0xBABE, 0xFACE], offset: [-2, -4]},
			]);
			afm.directions[1].kerningPairs.should.eql([
				{chars: [0x100, 0x3B0], offset: [50, 0]},
				{chars: [0x2B, 0x8FBA], offset: [0, 90]},
			]);
		});
		
		it("can specify adjustments along the X axis only", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs
				KPX A B 90
				KPX C D -4
				EndKernPairs
				StartKernPairs1
				KPX A B 45
				KPX C D -3
				EndKernPairs
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [90, 0]},
				{chars: ["C", "D"], offset: [-4, 0]},
			]);
			afm.directions[1].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [45, 0]},
				{chars: ["C", "D"], offset: [-3, 0]},
			]);
		});
		
		it("can specify adjustments along the Y axis only", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartKernPairs
				KPY A B -35
				KPY C D 440
				EndKernPairs
				StartKernPairs1
				KPY A B -45.2
				KPY C D -3.20
				EndKernPairs
			`.replace(/^\s+|\t/g, ""));
			afm.directions[0].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [0, -35]},
				{chars: ["C", "D"], offset: [0, 440]},
			]);
			afm.directions[1].kerningPairs.should.eql([
				{chars: ["A", "B"], offset: [0, -45.2]},
				{chars: ["C", "D"], offset: [0, -3.20]},
			]);
		});
	});
	
	when("parsing composite characters", () => {
		it("stores them by name", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartComposites
				CC Foo
				CC Bar
			`.replace(/^\s+|\t/g, ""));
			afm.should.have.property("composites").which.is.an("array");
			afm.composites[0].should.have.property("name").which.equals("Foo");
			afm.composites[1].should.have.property("name").which.equals("Bar");
		});
		
		it("composes them from named characters", () => {
			const afm = new AdobeFontMetrics(`
				StartFontMetrics 1.0
				StartComposites
				PCC Foo 2 4
				PCC Bar 0 0 ; PCC Baz 3.2 5.12
				PCC foo -40 0 ; PCC bar 0 -40 ; PCC baz 9 9.9 ;
			`.replace(/^\s+|\t/g, ""));
			afm.composites[0].should.have.property("parts").which.eqls([
				{char: "Foo", offset: [2, 4]},
			]);
			afm.composites[1].should.have.property("parts").which.eqls([
				{char: "Bar", offset: [0, 0]},
				{char: "Baz", offset: [3.2, 5.12]},
			]);
			afm.composites[2].should.have.property("parts").which.eqls([
				{char: "foo", offset: [-40, 0]},
				{char: "bar", offset: [0, -40]},
				{char: "baz", offset: [9, 9.9]},
			]);
		});
	});
});
