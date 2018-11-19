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
});
