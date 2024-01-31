window.WorldData = {	
	available_urls: ['/map/village.txt','/map/player.txt','/map/ally.txt'],
	fetchWorldData: async function(target = "") {
		if (target === 'village') {
			try {
				const response = await jQuery.ajax(available_urls[0]);
				const raw_village_data = parseCsvToArray(response);
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
			} catch (e) {throw 'error fetching villages data'}
		}
	},
	
	// Utils: convert csv + url encoded format to array
	parseCsvToArray: function (csvData) {
		const rows = csvData.trim().split('\n');
        	return rows.map(row => {
        		return row.split(',').map(field => decodeURIComponent(field));
        	});
	}
}
