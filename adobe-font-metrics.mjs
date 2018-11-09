export default class AdobeFontMetrics{
	
	constructor(input = ""){
		this.version    = "";
		this.globalInfo = {};
		this.directions = [{}, {}];
		Object.defineProperty(this, "parserState", {
			enumerable: false,
			value: {
				direction: 0,
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
		input = input.split("\n");
		this.parserState.tail = input.pop();
		for(const line of input)
			this.readLine(line);
	}
	
	readLine(input){
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
					this.globalInfo[lcKey] = this.parseBoolean(value);
					break;
				
				case "IsFixedPitch":
					this.setDirectionProperty(lcKey, this.parseBoolean(value));
					break;
				
				// Arrays
				case "BlendAxisTypes":
				case "BlendDesignPositions":
				case "BlendDesignMap":
				case "WeightVector":
					this.globalInfo[lcKey] = this.parseArray(value)[0];
					break;
				
				case "VVector":
					this.globalInfo[lcKey] = this.parseArray(value);
					break;
				
				case "FontBBox":
					this.globalInfo.boundingBox = this.parseArray(value);
					break;
			}
		}
	}
	
	parseArray(input){
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
	
	parseBoolean(input){
		return "true" === input.trim().toLowerCase();
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
