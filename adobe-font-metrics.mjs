export default class AdobeFontMetrics{
	
	constructor(input = ""){
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
		if(/^(\S+)\s*(\S.*)?$/.test(input)){
			const key   = RegExp.$1;
			const value = RegExp.$2;
			
			switch(key){
				// Unimportant section changes
				case "StartFontMetrics":
					this.version = value;
					break;
				
				case "StartDirection":
					this.parserState.direction = +value || 0;
					break;
				
				default: {
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
						case "KernPairs": {
							const dir = this.directions[this.parserState.direction];
							(dir.kerningPairs = dir.kerningPairs || []).push(
								new KerningPair(input)
							);
							break;
						}
						case "TrackKern":
							this.trackKerns.push(new TrackKern(value));
							break;
						default:
							this.setField(key, value);
					}
				}
			}
		}
	}
	
	
	setField(key, value){
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
				this.globalInfo[lcKey] = value;
				break;
			
			// Numbers
			case "Ascender":
			case "CapHeight":
			case "Descender":
			case "EscChar":
			case "MappingScheme":
			case "MetricsSets":
			case "StdHW":
			case "StdVW":
			case "XHeight":
				this.globalInfo[lcKey] = +value || 0;
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
				this.globalInfo[lcKey] = parseBoolean(value);
				break;
			
			case "IsFixedPitch":
				this.setDirectionProperty(lcKey, parseBoolean(value));
				break;
			
			// Arrays
			case "BlendAxisTypes":
			case "BlendDesignPositions":
			case "BlendDesignMap":
			case "WeightVector":
				this.globalInfo[lcKey] = parseArray(value)[0];
				break;
			
			case "VVector":
				this.globalInfo[lcKey] = parseArray(value);
				break;
			
			case "FontBBox":
				this.globalInfo.boundingBox = parseArray(value);
				break;
			
			// User-defined
			default:
				/^[a-z]/.test(key) && this.userFields.set(key, value);
		}
	}
	
	setDirectionProperty(key, value){
		const dir = this.parserState.direction;
		if(2 === dir)
			this.directions[0][key] =
			this.directions[1][key] = value;
		else
			this.directions[dir][key] = value;
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
				this.offset[0] = 0;
				break;
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


function parseHex(input){
	return "<" === input[0]
		? parseInt(input.replace(/^<|>$/g, ""), 16)
		: parseInt(input);
}

function parseArray(input){
	let list = {parent: null, tokens: []};
	let depth = 0;
	let token = "";
	
	const {length} = input;
	const endToken = () => {
		if(token){
			if("true" === token || "false" === token)
				token = "true" === token;
			else if("/" === token[0])
				token = token.substr(1);
			else
				token = parseFloat(token);
			list.tokens.push(token);
		}
		token = "";
	};
	for(let i = 0; i < length; ++i){
		const char = input[i];
		
		// Begin new array
		if("[" === char){
			endToken();
			list = {parent: list, tokens: []};
			++depth;
		}
		
		// Terminate current array
		else if("]" === char && depth > 0){
			endToken();
			const {tokens} = list;
			(list = list.parent).tokens.push(tokens);
			--depth;
		}
		
		// Terminate token upon whitespace
		else if(/\s/.test(char))
			endToken();
		
		else token += char;
	}
	return list.tokens;
}

function parseBoolean(input){
	return "true" === input.trim().toLowerCase();
}
