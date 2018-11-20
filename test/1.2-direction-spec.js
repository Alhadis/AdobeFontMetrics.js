"use strict";

const AdobeFontMetrics = require("..");
const {when} = require("./utils.js");

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
