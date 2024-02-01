window.WorldData = {	
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

	// BEGIN Getters
	getVillages: async function() {
		if (this.villages.length !== 0) {return this.villages}
		else {
			this.villages = await this.fetchWorldData('village');
			return this.villages;
		}
	} 
	// END Getters

	// Utils: convert csv + url encoded format to array
	parseCsvToArray: function (csv_data) {
		const rows = csv_data.trim().split('\n');
        	return rows.map(row => {
        		return row.split(',').map(field => decodeURIComponent(field));
        	});
	},

	// Utils: convert villages array format to map searchable by coord set "123|321"
	villageArrayToCoordMap: function (village_array) {
		let village_map = new Map()
		village_array.forEach(village => {
			village_map.set(village.villageCoord, village)
		});
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
	}
}
