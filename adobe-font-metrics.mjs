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
				
				case "BlendAxisTypes":
					this.blendAxisTypes = this.parseArray(value);
					break;
				
				case "VVector":
					this.vVector = value.trim().split(/\s+/).map(n => +n || 0);
					break;
				
				// Concatenate duplicate notices
				case "Notice":
					this.notice += this.notice ? `\n${value}` : value;
					break;
				
				case "FontBBox":
					this.boundingBox = value.trim().split(/\s+/).map(n => +n || 0);
					break;
			}
		}
	}
	
	parseArray(input){
		let list = {parent: null, tokens: []};
		let depth = 0;
		let token = "";
		
		const {length} = input;
		for(let i = 0; i < length; ++i){
			const char = input[i];
			
			// Begin new array
			if("[" === char){
				token && list.tokens.push(token);
				list = {parent: list, tokens: []};
				token = "";
				++depth;
			}
			
			// Terminate current array
			else if("]" === char && depth > 0){
				token && list.tokens.push(token);
				const {tokens} = list;
				(list = list.parent).tokens.push(tokens);
				token = "";
				--depth;
			}
			
			// Collect token data
			else if(/\S/.test(char))
				token += char;
			else{
				token && list.tokens.push(token);
				token = "";
			}
		}
		return list.tokens;
	}
}

Object.assign(AdobeFontMetrics.prototype, {
	characterSet:   "",
	encodingScheme: "",
	escChar:        0,
	familyName:     "",
	fontName:       "",
	fullName:       "",
	mappingScheme:  0,
	version:        "",
	weight:         "",
});
