"use strict";

const AdobeFontMetrics = require("..");
const {when} = require("./utils.js");

when("parsing PostScript literals", () => {
	const {parsePostScript} = AdobeFontMetrics;
	
	when("parsing strings", () => {
		it("parses simple values", () => {
			parsePostScript("(Foo)").should.eql(["Foo"]);
			parsePostScript("(Foo Bar)").should.eql(["Foo Bar"]);
			parsePostScript("(This is a string)").should.eql(["This is a string"]);
		});
		
		it("parses empty values", () => {
			parsePostScript("()").should.eql([""]);
			parsePostScript("()()").should.eql(["", ""]);
			parsePostScript("() ()").should.eql(["", ""]);
		});
		
		it("parses multiple values", () => {
			parsePostScript("(LT) (CN)").should.eql(["LT", "CN"]);
			parsePostScript("(LT)(_)(CN)").should.eql(["LT", "_", "CN"]);
		});
		
		it("parses values containing newlines", () => {
			const input = "Strings may contain newlines\nand such.";
			parsePostScript(`(${input})`).should.eql([input]);
		});
		
		it("parses values containing special characters", () => {
			const input = "Strings may [contain] special characters *!&}^% and balanced parentheses (a a) (and so on).";
			parsePostScript(`(${input})`).should.eql([input]);
		});
		
		it("parses values containing parentheses", () => {
			const input = "This is a 0 (zero) value.";
			parsePostScript(`(${input})`).should.eql([input]);
			parsePostScript("(a(Foo Bar))").should.eql(["a(Foo Bar)"]);
		});
		
		it("parses values containing nested parentheses", () => {
			const input = "(This is a 0) (((((zero) value.))))";
			parsePostScript(`(${input})`).should.eql([input]);
		});
		
		it("parses unterminated values", () => {
			const input = "This one is unfinished";
			parsePostScript(`(${input}`).should.eql([input]);
		});
	});
	
	when("parsing arrays", () => {
		it("parses empty arrays", () => {
			parsePostScript("[]").should.eql([[]]);
		});
		
		it("parses multiple arrays", () => {
			parsePostScript("[] []").should.eql([[], []]);
			parsePostScript("[][]").should.eql([[], []]);
			parsePostScript("[] [] []").should.eql([[], [], []]);
		});
		
		it("parses arrays of numbers", () => {
			parsePostScript("[1]").should.eql([[1]]);
			parsePostScript("[1 2]").should.eql([[1, 2]]);
			parsePostScript("[1 2 3]").should.eql([[1, 2, 3]]);
		});
		
		it("parses arrays of strings", () => {
			parsePostScript("[(Foo)]").should.eql([["Foo"]]);
			parsePostScript("[(Foo) (Bar)]").should.eql([["Foo", "Bar"]]);
			parsePostScript("[(Foo) (Bar) (Baz)]").should.eql([["Foo", "Bar", "Baz"]]);
		});
		
		it("parses arrays of booleans", () => {
			parsePostScript("[true]").should.eql([[true]]);
			parsePostScript("[false]").should.eql([[false]]);
			parsePostScript("[true false]").should.eql([[true, false]]);
			parsePostScript("[false true]").should.eql([[false, true]]);
			parsePostScript("[true true false]").should.eql([[true, true, false]]);
			parsePostScript("[false false false]").should.eql([[false, false, false]]);
		});
		
		it("parses arrays of names", () => {
			parsePostScript("[/Foo]").should.eql([["Foo"]]);
			parsePostScript("[/Foo /Bar]").should.eql([["Foo", "Bar"]]);
			parsePostScript("[/Foo /Bar /Baz]").should.eql([["Foo", "Bar", "Baz"]]);
		});
		
		it("parses nested arrays", () => {
			parsePostScript("[[]]").should.eql([[[]]]);
			parsePostScript("[[1]]").should.eql([[[1]]]);
			parsePostScript("[[1 2]]").should.eql([[[1, 2]]]);
			parsePostScript("[[1 2 3]]").should.eql([[[1, 2, 3]]]);
			parsePostScript("[[1 2 3] [4 5 6]]").should.eql([[[1, 2, 3], [4, 5, 6]]]);
		});
		
		it("parses unterminated arrays", () => {
			parsePostScript("[1").should.eql([[1]]);
			parsePostScript("[1 2").should.eql([[1, 2]]);
			parsePostScript("[1 2 [3]").should.eql([[1, 2, [3]]]);
			parsePostScript("[1 2 [3 4]").should.eql([[1, 2, [3, 4]]]);
			parsePostScript("[1 [2 [").should.eql([[1, [2, []]]]);
			parsePostScript("[/Foo").should.eql([["Foo"]]);
			parsePostScript("[/A [/B [/C /D").should.eql([["A", ["B", ["C", "D"]]]]);
		});
	});
});
