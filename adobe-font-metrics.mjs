export default class AdobeFontMetrics{
	
	constructor(input = ""){
		this.format      = "";
		this.version     = "";
		this.globalInfo  = {};
		this.directions  = [{}, {}];
		this.charMetrics = [];
		this.composites  = [];
		this.trackKerns  = [];
		this.userFields  = new Map();
		Object.defineProperty(this, "parserState", {
			enumerable: false,
			value: {
				direction: 0,
				endKey: "",
				section: "",
				tail: "",
			},
		});
		input && this.readChunk(input);
	}
	
	charByCode(value){
		return this.charMetrics.find(char => value === char.code) || null;
	}
	
	charByName(value){
		return this.charMetrics.find(char => value === char.name) || null;
	}
	
	readChunk(input){
		if(this.parserState.done) return;
		input = String(input || "");
		if(this.parserState.tail){
			input = this.parserState.tail + input;
			this.parserState.tail = "";
		}
		input = input.split(/\r?\n|\r/);
		this.parserState.tail = input.pop();
		for(const line of input)
			this.readLine(line);
	}
	
	readLine(input){
		if(this.parserState.done) return;
		
		if(/^(\S+)\s*(\S.*)?$/.test(input)){
			const key   = RegExp.$1;
			const value = RegExp.$2;
			
			switch(key){
				// Format specifiers
				case "StartFontMetrics":
				case "StartCompFontMetrics":
				case "StartMasterFontMetrics":
					this.version = value;
					this.format  = {F: "afm", C: "acfm", M: "amfm"}[key[5]];
					this.parserState.endKey = key.replace(/^Start/, "End");
					break;
				
				// Optional direction specifier
				case "StartDirection":
					this.parserState.direction = +value || 0;
					break;
				
				// ACFM only: Descendent font
				case "StartDescendent": {
					const root = this.parserState.descendent || this;
					(root.descendents = root.descendents || [])
						.push(this.parserState.descendent = {
							charRange: value.trim().split(/\s+/).map(parseHex),
							parent: root,
						});
					break;
				}
				case "EndDescendent": {
					const desc = this.parserState.descendent;
					if(!desc) return;
					this.parserState.descendent = desc === this
						? null
						: desc.parent;
					delete desc.parent;
					break;
				}
				
				// AMFM: Axes and masters
				case "StartAxis":
					(this.axes = this.axes || [])
						.push(this.parserState.axis = {});
					break;
				case "StartMaster":
					(this.masters = this.masters || [])
						.push(this.parserState.master = {});
					break;
				
				default: {
					// EOF; ignore trailing data
					if(key === this.parserState.endKey){
						this.parserState.done = true;
						return;
					}
					
					// Major (state-significant) section changes
					if(/^(Start|End)(\S+)(0|1)?$/.test(key)){
						if("Start" === RegExp.$1){
							this.parserState.section = RegExp.$2;
							this.parserState.direction = +RegExp.$3 || 0;
						}
						else this.parserState.section = "";
					}
					
					else switch(this.parserState.section){
						case "CharMetrics":
							this.charMetrics.push(new CharacterMetric(input));
							break;
						case "Composites":
							this.composites.push(new CharacterComposite(input));
							break;
						case "PrimaryFonts":
							for(const chunk of input.split(/\b(?=PC|End)/))
								/^EndPrimaryFonts/.test(chunk)
									? this.parserState.section = ""
									: (this.primaryFonts = this.primaryFonts || [])
										.push(new PrimaryFont(chunk));
							break;
						case "TrackKern":
							this.trackKerns.push(new TrackKern(value));
							break;
						default:
							// Pair-wise kerning data with possible direction specifier
							if(/^KernPairs(0|1)?$/.test(this.parserState.section)){
								const dir = this.directions[this.parserState.direction = +RegExp.$1 || 0];
								(dir.kerningPairs = dir.kerningPairs || [])
									.push(new KerningPair(input));
							}
							else this.setField(key, value);
					}
				}
			}
		}
	}
	
	
	setField(key, value){
		let fontInfo = this.globalInfo;
		switch(this.format){
			case "amfm":
				fontInfo = this.parserState.master || fontInfo;
				break;
			case "acfm":
				fontInfo = this.parserState.descendent || fontInfo;
				break;
		}
			
		const lcKey = key[0].toLowerCase() + key.substr(1);
		switch(key){
			// Strings
			case "CharacterSet":
			case "EncodingScheme":
			case "FamilyName":
			case "FontName":
			case "FullName":
			case "Notice":
			case "Version":
			case "Weight":
				fontInfo[lcKey] = value;
				break;
			
			case "AxisType":
			case "AxisLabel":
				this.setAxisProperty(key, value);
				break;
			
			// Numbers
			case "Ascender":
			case "Axes":
			case "CapHeight":
			case "Characters":
			case "Descendents":
			case "Descender":
			case "EscChar":
			case "MappingScheme":
			case "Masters":
			case "MetricsSets":
			case "StdHW":
			case "StdVW":
			case "XHeight":
				fontInfo[lcKey] = +value || 0;
				break;
			
			case "UnderlinePosition":
			case "UnderlineThickness":
			case "ItalicAngle":
				this.setDirectionProperty(lcKey, +value || 0);
				break;
			
			// Booleans
			case "IsBaseFont":
			case "IsCIDFont":
			case "IsFixedV":
				fontInfo[lcKey] = parseBoolean(value);
				break;
			
			case "IsFixedPitch":
				this.setDirectionProperty(lcKey, parseBoolean(value));
				break;
			
			// Arrays
			case "BlendAxisTypes":
			case "BlendDesignPositions":
			case "BlendDesignMap":
			case "WeightVector":
				fontInfo[lcKey] = parsePostScript(value)[0];
				break;
			
			case "VVector":
				fontInfo[lcKey] = parsePostScript(value);
				break;
			
			case "FontBBox":
				fontInfo.boundingBox = parsePostScript(value);
				break;
			
			case "CharWidth":
				this.setDirectionProperty(lcKey, parsePostScript(value));
				break;
			
			// User-defined
			default:
				/^[a-z]/.test(key) && this.userFields.set(key, value);
		}
	}
	
	setAxisProperty(key, value){
		const {axis} = this.parserState;
		axis && (axis[key.replace(/^Axis(.)/, (_, c) => c.toLowerCase())] = value);
	}
	
	setDirectionProperty(key, value){
		const target = this.parserState.descendent || this;
		const list = target.directions = target.directions || [{}, {}];
		const dir = this.parserState.direction;
		2 === dir
			? list[0][key] = list[1][key] = value
			: list[dir][key] = value;
	}
}


class CharacterMetric{
	constructor(input){
		this.code        = -1;
		this.name        = "";
		this.widths      = [0, 0];
		this.heights     = [0, 0];
		this.boundingBox = [0, 0, 0, 0];
		this.ligatures   = {};
		
		for(const field of input.trim().split(/\s*;\s*/)){
			const [key, ...values] = field.split(/\s+/);
			switch(key){
				case "C":
				case "CH":
					this.code = parseHex(values[0]);
					break;
				case "N":
					this.name = values.join(" ");
					break;
				case "WX":
				case "W0X":
					this.widths[0] = +values[0] || 0;
					break;
				case "W1X":
					this.widths[1] = +values[0] || 0;
					break;
				case "WY":
				case "W0Y":
					this.heights[0] = +values[0] || 0;
					break;
				case "W1Y":
					this.heights[1] = +values[0] || 0;
					break;
				case "W":
				case "W0":
					this.widths[0]  = +values[0] || 0;
					this.heights[0] = +values[1] || 0;
					break;
				case "W1":
					this.widths[1]  = +values[0] || 0;
					this.heights[1] = +values[1] || 0;
					break;
				case "VV":
					this.widths[0]  = this.widths[1]  = +values[0] || 0;
					this.heights[0] = this.heights[1] = +values[1] || 0;
					break;
				case "B":
					this.boundingBox.splice(0, values.length, ...values.map(Number));
					break;
				case "L":
					this.ligatures[values.shift()] = values.join(" ");
					break;
			}
		}
	}
}

class CharacterComposite{
	constructor(input){
		this.name = "";
		this.parts = [];
		for(const field of input.trim().split(/\s*;\s*/)){
			const [key, name, x, y] = field.split(/\s+/);
			switch(key){
				case "CC":
					this.name = name;
					break;
				case "PCC":
					this.parts.push({
						char: name,
						offset: [+x || 0, +y || 0],
					});
			}
		}
	}
}

class KerningPair{
	constructor(input){
		const [keyword, ...args] = input.trim().split(/\s+/);
		this.chars  = [args[0], args[1]];
		this.offset = [+args[2] || 0, +args[3] || 0];
		switch(keyword){
			case "KPH":
				this.chars[0] = parseHex(this.chars[0]);
				this.chars[1] = parseHex(this.chars[1]);
				break;
			case "KPX":
				this.offset[1] = 0;
				break;
			case "KPY":
				this.offset.reverse()[0] = 0;
				break;
		}
	}
}

class PrimaryFont{
	constructor(input){
		this.coordinates = [];
		this.labels      = [];
		this.name        = "";
		for(const field of input.trim().split(/\s*;\s*/)){
			if(!/^(\S+)\s+(\S.*)$/.test(field)) continue;
			const key   = RegExp.$1;
			const value = RegExp.$2;
			switch(key){
				case "PC":
					this.coordinates.push(...value.split(/\s+/).map(n => ~~n));
					break;
				case "PL":
					this.labels.push(...parsePostScript(value));
					break;
				case "PN":
					this.name = parsePostScript(value)[0];
					break;
			}
		}
	}
}

class TrackKern{
	constructor(input){
		input = input.trim().split(/\s+/);
		this.degree       = +input[0] || 0;
		this.minKern      = +input[2] || 0;
		this.maxKern      = +input[4] || 0;
		this.minPointSize = +input[1] || 0;
		this.maxPointSize = +input[3] || 0;
	}
}


/**
 * Convert a boolean-like string to an actual {@link Boolean}.
 *
 * @internal
 * @example parseBoolean("true") === true;
 * @example parseBoolean("false") === false;
 * @param {String} input
 * @return {Boolean}
 */
function parseBoolean(input){
	return "true" === String(input).trim().toLowerCase();
}


/**
 * Parse a decimal string using hexadecimal or base-10 notation.
 *
 * @internal
 * @example parseHex("<0x100>") == 256;
 * @example parseHex("100") == 100;
 * @param {String} input
 * @return {Number}
 */
function parseHex(input){
	return "<" === input[0]
		? parseInt(input.replace(/^<|>$/g, ""), 16)
		: parseInt(input);
}


/**
 * Tokenise basic PostScript values.
 *
 * @internal
 * @example parsePostScript("(Foo) (Bar)") == ["Foo", "Bar"];
 * @example parsePostScript("[1 2 [3]]") == [[1, 2, [3]]];
 * @param {String} input
 * @return {Array}
 */
function parsePostScript(input){
	let list = {parent: null, tokens: []};
	let depth = 0;
	let parens = 0;
	let token = "";
	
	const {length} = input;
	const endToken = () => {
		if(token){
			if("true" === token || "false" === token)
				token = "true" === token;
			else if("/" === token[0])
				token = token.substr(1);
			else if("(" === token[0])
				token = token.replace(/^\(|\)$/g, "");
			else
				token = parseFloat(token);
			list.tokens.push(token);
		}
		token = "";
	};
	const endArray = () => {
		endToken();
		const {tokens} = list;
		(list = list.parent).tokens.push(tokens);
		--depth;
	};
	for(let i = 0; i < length; ++i){
		const char = input[i];
		
		// Begin new array
		if("[" === char && !parens){
			endToken();
			list = {parent: list, tokens: []};
			++depth;
		}
		
		// Terminate current array
		else if("]" === char && depth > 0)
			endArray();
		
		// Terminate token upon (unquoted) whitespace
		else if(!parens && /\s/.test(char))
			endToken();
		
		// Terminate string literal or bracket-pair
		else if(")" === char && !--parens){
			token += char;
			endToken();
		}
		
		else{
			// Start literal text or balanced bracket-pair
			if("(" === char)
				parens++ || endToken();
			token += char;
		}
	}
	while(depth > 0) endArray();
	token && endToken();
	return list.tokens;
}



// Expose internal functions/classes
Object.assign(AdobeFontMetrics, {
	CharacterMetric,
	CharacterComposite,
	KerningPair,
	PrimaryFont,
	TrackKern,
	parseBoolean,
	parseHex,
	parsePostScript,
});
