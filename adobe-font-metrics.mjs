export default class AdobeFontMetrics{
	
	constructor(input = ""){
		this.version     = "";
		this.globalInfo  = {};
		this.directions  = [{}, {}];
		this.charMetrics = {};
		Object.defineProperty(this, "parserState", {
			enumerable: false,
			value: {
				direction: 0,
				section: "header",
				tail: "",
			},
		});
		input && this.readChunk(input);
	}
	
	readChunk(input){
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
		switch(this.parserState.section){
			case "header":
				this.readHeaderField(input);
				break;
			case "chars":
				const char = new CharacterMetric(input);
				this.charMetrics[char.code] = char;
				break;
		}
	}
	
	
	readHeaderField(input){
		if(input = input.match(/^(\S+)\s*(\S.*)?$/)){
			const [, key, value] = input;
			const lcKey = key[0].toLowerCase() + key.substr(1);
			switch(key){
				// Sections
				case "StartFontMetrics":
					this.version = value;
					break;
				
				case "StartDirection":
					this.parserState.direction = +value || 0;
					break;
				
				case "StartCharMetrics":
					this.parserState.section = "chars";
					break;
				
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
			}
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
