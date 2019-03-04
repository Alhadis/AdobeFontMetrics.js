"use strict";

const AdobeFontMetrics = require("..");

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
