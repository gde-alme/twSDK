window.WorldData = {	
	playerId: 0,
	world: '',
	villages: [],
	village_map: {},
	player_village_map: {},
	available_urls: ['/map/village.txt','/map/player.txt','/map/ally.txt'],

	fetchWorldData: async function(target = "") {
		if (target === 'village') {
			try {
				const response = await jQuery.ajax(this.available_urls[0]);
				const raw_village_data = this.parseCsvToArray(response);
				let data_response = raw_village_data.filter(value => value[0] != '')
            			.map(value => ({
                			villageId: parseInt(value[0]),
                			villageName: value[1],
                			villageCoord: value[2] + "|" + value[3],
                			playerId: parseInt(value[4]),
                			villagePoints: parseInt(value[5]),
                			villageType: parseInt(value[6]),
            			}));
				return data_response;
			} catch (e) {throw `error: ${e} fetching villages data`}
		}
	},

	// BEGIN Getters (for attributes)
	getPlayerId: function() {
		if (this.playerId === 0) {this.playerId = game_data.player.id;}
		return this.playerId;
	},

	getWorld: function() {
		if (this.world === '') {this.world = game_data.world;}
		return this.world;
	},

	getVillages: async function() {
		if (this.villages.length === 0) {this.villages = await this.fetchWorldData('village');}
			return this.villages;
	}, 

	getVillageMap: async function() {
    		if (Object.keys(this.village_map).length === 0) {
        		let villages = await this.getVillages();
        		this.village_map = this.villageArrayToCoordMap(villages);
    		}
    		return this.village_map;
	},
	// END Getters

	// BEGIN Getters (non attributes)
	getCurrentVillage: function () {
		return {id: game_data.village.id, coord: game_data.village.coord, name: game_data.village.name}
	},
	// END Getters

	// Utils: convert csv + url encoded format to array
	parseCsvToArray: function (csv_data) {
		const rows = csv_data.trim().split('\n');
        	return rows.map(row => {
        		return row.split(',').map(field => decodeURIComponent(field.replace(/\+/g, ' ')));
        	});
	},

	// Utils: convert villages array format to map searchable by coord set "123|321"
	villageArrayToCoordMap: function (village_array) {
		let village_map = new Map()
		village_array.forEach(village => {
			village_map.set(village.villageCoord, village)
		});
		return village_map;
	},

	// Utils: convert villages array format to map searchable by player id
	villageArrayToPlayerMap: function (village_array) {
		let player_village_map = new Map()
		village_array.forEach(village => {
    			if (!player_village_map.has(village.playerId)) {
        			player_village_map.set(village.playerId, []);
    		}
    		player_village_map.get(village.playerId).push(village);
		});
		return player_village_map;
	},

	// Utils: check if string is coord format
	isCoordSet: function (str) {
    		const regex = /^\d+\|\d+$/;
    		return regex.test(str);
	}
}
