"use strict";

const AdobeFontMetrics = require("..");
const {when} = require("./utils.js");

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
