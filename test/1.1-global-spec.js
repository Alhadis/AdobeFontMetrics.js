"use strict";

const AdobeFontMetrics = require("..");

when("parsing global font information", () => {
	it("stores format and version headers", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 3.5\n");
		afm.should.have.property("format").which.equals("afm");
		afm.should.have.property("version").which.equals("3.5");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 4.6\n");
		acfm.should.have.property("format").which.equals("acfm");
		acfm.should.have.property("version").which.equals("4.6");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 2.0\n");
		amfm.should.have.property("format").which.equals("amfm");
		amfm.should.have.property("version").which.equals("2.0");
	});
	
	it("stores `MetricsSets`", () => {
		const afm  = new AdobeFontMetrics("StartFontMetrics 1.0\nMetricsSets 1\n");
		afm.should.have.property("globalInfo").which.is.an("object");
		afm.globalInfo.should.have.property("metricsSets").which.equals(1);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nMetricsSets 2\n");
		acfm.should.have.property("globalInfo").which.is.an("object");
		acfm.globalInfo.should.have.property("metricsSets").which.equals(2);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nMetricsSets 3\n");
		amfm.should.have.property("globalInfo").which.is.an("object");
		amfm.globalInfo.should.have.property("metricsSets").which.equals(3);
	});
	
	it("stores `FontName`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFontName Foo\n");
		afm.globalInfo.should.have.property("fontName").which.equals("Foo");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nFontName Bar\n");
		acfm.globalInfo.should.have.property("fontName").which.equals("Bar");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nFontName Baz\n");
		amfm.globalInfo.should.have.property("fontName").which.equals("Baz");
	});
	
	it("stores `FullName`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFullName Bar\n");
		afm.globalInfo.should.have.property("fullName").which.equals("Bar");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nFullName Foo Bar\n");
		acfm.globalInfo.should.have.property("fullName").which.equals("Foo Bar");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nFullName Z\n");
		amfm.globalInfo.should.have.property("fullName").which.equals("Z");
	});
	
	it("stores `FamilyName`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFamilyName Baz\n");
		afm.globalInfo.should.have.property("familyName").which.equals("Baz");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nFamilyName Qux\n");
		acfm.globalInfo.should.have.property("familyName").which.equals("Qux");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nFamilyName Foo\n");
		amfm.globalInfo.should.have.property("familyName").which.equals("Foo");
	});
	
	it("stores `Weight`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nWeight Bold\n");
		afm.globalInfo.should.have.property("weight").which.equals("Bold");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nWeight Normal\n");
		acfm.globalInfo.should.have.property("weight").which.equals("Normal");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nWeight Book\n");
		amfm.globalInfo.should.have.property("weight").which.equals("Book");
	});
	
	it("stores `FontBBox`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nFontBBox 34 65 100 300\n");
		afm.globalInfo.should.have.property("boundingBox").which.eqls([34, 65, 100, 300]);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nFontBBox 0 0 10 20\n");
		acfm.globalInfo.should.have.property("boundingBox").which.eqls([0, 0, 10, 20]);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nFontBBox 14 28 0 0\n");
		amfm.globalInfo.should.have.property("boundingBox").which.eqls([14, 28, 0, 0]);
	});
	
	it("stores `Version`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nVersion 001.000\n");
		afm.globalInfo.should.have.property("version").which.equals("001.000");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nVersion v0.9-rc1\n");
		acfm.globalInfo.should.have.property("version").which.equals("v0.9-rc1");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nVersion (latest)\n");
		amfm.globalInfo.should.have.property("version").which.equals("(latest)");
	});
	
	it("stores `Notice`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nNotice Foo Bar\n");
		afm.globalInfo.should.have.property("notice").which.equals("Foo Bar");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nNotice Baz Qux\n");
		acfm.globalInfo.should.have.property("notice").which.equals("Baz Qux");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nNotice Qux Foo\n");
		amfm.globalInfo.should.have.property("notice").which.equals("Qux Foo");
	});
	
	it("stores `EncodingScheme`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nEncodingScheme Foo\n");
		afm.globalInfo.should.have.property("encodingScheme").which.equals("Foo");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nEncodingScheme Bar Baz\n");
		acfm.globalInfo.should.have.property("encodingScheme").which.equals("Bar Baz");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nEncodingScheme Bar\n");
		amfm.globalInfo.should.have.property("encodingScheme").which.equals("Bar");
	});
	
	it("stores `MappingScheme`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nMappingScheme 5\n");
		afm.globalInfo.should.have.property("mappingScheme").which.equals(5);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nMappingScheme 0\n");
		acfm.globalInfo.should.have.property("mappingScheme").which.equals(0);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nMappingScheme 2\n");
		amfm.globalInfo.should.have.property("mappingScheme").which.equals(2);
	});
	
	it("stores `EscChar`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nEscChar 27\n");
		afm.globalInfo.should.have.property("escChar").which.equals(27);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nEscChar 89\n");
		acfm.globalInfo.should.have.property("escChar").which.equals(89);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nEscChar 5\n");
		amfm.globalInfo.should.have.property("escChar").which.equals(5);
	});
	
	it("stores `CharacterSet`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCharacterSet Foo\n");
		afm.globalInfo.should.have.property("characterSet").which.equals("Foo");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nCharacterSet Bar\n");
		acfm.globalInfo.should.have.property("characterSet").which.equals("Bar");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nCharacterSet Baz\n");
		amfm.globalInfo.should.have.property("characterSet").which.equals("Baz");
	});
	
	it("stores `Characters`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCharacters 360\n");
		afm.globalInfo.should.have.property("characters").which.equals(360);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nCharacters 127\n");
		acfm.globalInfo.should.have.property("characters").which.equals(127);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 1.0\nCharacters 64\n");
		amfm.globalInfo.should.have.property("characters").which.equals(64);
	});
	
	it("stores `IsBaseFont`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nIsBaseFont false\n");
		afm.globalInfo.should.have.property("isBaseFont").which.equals(false);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nIsBaseFont true\n");
		acfm.globalInfo.should.have.property("isBaseFont").which.equals(true);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nIsBaseFont false\n");
		amfm.globalInfo.should.have.property("isBaseFont").which.equals(false);
	});
	
	it("stores `VVector`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nVVector 120 340\n");
		afm.globalInfo.should.have.property("vVector").which.eqls([120, 340]);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nVVector -200\n");
		acfm.globalInfo.should.have.property("vVector").which.eqls([-200]);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nVVector 0 450\n");
		amfm.globalInfo.should.have.property("vVector").which.eqls([0, 450]);
	});
	
	it("stores `IsFixedV`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nIsFixedV false\n");
		afm.globalInfo.should.have.property("isFixedV").which.equals(false);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nIsFixedV true\n");
		acfm.globalInfo.should.have.property("isFixedV").which.equals(true);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nIsFixedV false\n");
		amfm.globalInfo.should.have.property("isFixedV").which.equals(false);
	});
	
	it("stores `CapHeight`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nCapHeight 320\n");
		afm.globalInfo.should.have.property("capHeight").which.equals(320);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nCapHeight 90\n");
		acfm.globalInfo.should.have.property("capHeight").which.equals(90);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.3\nCapHeight 45\n");
		amfm.globalInfo.should.have.property("capHeight").which.equals(45);
	});
	
	it("stores `XHeight`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nXHeight 430\n");
		afm.globalInfo.should.have.property("xHeight").which.equals(430);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nXHeight 225\n");
		acfm.globalInfo.should.have.property("xHeight").which.equals(225);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nXHeight 320\n");
		amfm.globalInfo.should.have.property("xHeight").which.equals(320);
	});
	
	it("stores `Ascender`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nAscender 540\n");
		afm.globalInfo.should.have.property("ascender").which.equals(540);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nAscender 220\n");
		acfm.globalInfo.should.have.property("ascender").which.equals(220);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nAscender 32\n");
		amfm.globalInfo.should.have.property("ascender").which.equals(32);
	});
	
	it("stores `Descender`", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nDescender 256\n");
		afm.globalInfo.should.have.property("descender").which.equals(256);
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\nDescender 36\n");
		acfm.globalInfo.should.have.property("descender").which.equals(36);
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nDescender 2563\n");
		amfm.globalInfo.should.have.property("descender").which.equals(2563);
	});
	
	it("stores user-defined fields", () => {
		const afm = new AdobeFontMetrics("StartFontMetrics 1.0\nunknownField Foo\n");
		afm.should.have.property("userFields").which.is.an.instanceOf(Map);
		afm.userFields.get("unknownField").should.equal("Foo");
		
		const acfm = new AdobeFontMetrics("StartCompFontMetrics 2.0\ncustomProperty 2\n");
		acfm.should.have.property("userFields").which.is.an.instanceOf(Map);
		acfm.userFields.get("customProperty").should.equal("2");
		
		const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.0\nfoo Bar\n");
		amfm.should.have.property("userFields").which.is.an.instanceOf(Map);
		amfm.userFields.get("foo").should.equal("Bar");
	});
	
	when("parsing ACFM data", () => {
		it("stores `Descendents`", () => {
			const acfm = new AdobeFontMetrics("StartCompFontMetrics 1.0\nDescendents 4\n");
			acfm.globalInfo.should.have.property("descendents").which.equals(4);
		});
	});
	
	when("parsing AMFM data", () => {
		it("stores `Masters`", () => {
			const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.2\nMasters 3\n");
			amfm.globalInfo.should.have.property("masters").which.equals(3);
		});
		
		it("stores `Axes`", () => {
			const amfm = new AdobeFontMetrics("StartMasterFontMetrics 3.2\nAxes 3\n");
			amfm.globalInfo.should.have.property("axes").which.equals(3);
		});
	});
});
