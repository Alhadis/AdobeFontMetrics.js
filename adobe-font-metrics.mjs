export default class AdobeFontMetrics{
	
	constructor(input = ""){
		input && this.readChunk(input);
	}
	
	readChunk(input){
		for(const line of input.split("\n"))
			this.readLine(line);
	}
	
	readLine(input){
		if(input = input.match(/^(\S+)\s*(\S.*)?$/)){
			const [, key, value] = input;
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
					this[lcKey] = value;
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
					this[lcKey] = +value || 0;
					break;
				
				// Booleans
				case "IsBaseFont":
				case "IsCIDFont":
				case "IsFixedV":
					this[lcKey] = "true" === value.trim().toLowerCase();
					break;
				
				// Arrays
				case "BlendAxisTypes":
				case "BlendDesignPositions":
				case "BlendDesignMap":
				case "WeightVector":
					this[lcKey] = this.parseArray(value)[0];
					break;
				
				case "VVector":
					this[lcKey] = this.parseArray(value);
					break;
				
				case "FontBBox":
					this.boundingBox = this.parseArray(value);
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
}

Object.assign(AdobeFontMetrics.prototype, {
	ascender: 0,
	blendAxisTypes: null,
	blendDesignMap: null,
	blendDesignPositions: null,
	boundingBox: null,
	capHeight: 0,
	characterSet: "",
	descender: 0,
	encodingScheme: "",
	escChar: 0,
	familyName: "",
	fontName: "",
	fullName: "",
	isBaseFont: false,
	isCIDFont: false,
	isFixedV: false,
	mappingScheme: 0,
	metricsSets: 0,
	notice: "",
	stdHW: 0,
	stdVW: 0,
	version: "",
	vVector: null,
	weight: "",
	weightVector: null,
	xHeight: 0,
});
