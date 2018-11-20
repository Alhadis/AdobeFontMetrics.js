"use strict";

const AdobeFontMetrics = require("..");
const {when} = require("./utils.js");

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
