"use strict";

const AdobeFontMetrics = require("..");

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
