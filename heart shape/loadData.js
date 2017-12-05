
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//get average score of certain attribute
function getAveragePeerScore(data, gender, attr) {
	pairs_by_iid = d3.nest().key(function(d) { return d['iid'] })
		.entries(data.filter(row => row['gender'] == gender))
	pairs_by_iid_avg_attr = d3.nest().key(function(d) { return d['iid'] })
		.rollup(function(v) { 
			return d3.mean(v, function(d) {
				//skip empty strings, null is ingnored nby defualt
				return isNumeric(d[attr])? +d[attr]: null
			})
		})
		.entries(data)
		.filter(e => isNumeric(e['value']))
	res = {}
	for (var i = 0; i < pairs_by_iid_avg_attr.length; ++i) {
		res[pairs_by_iid_avg_attr[i]['key']] = Math.round(pairs_by_iid_avg_attr[i]['value'])
	}
	return res
}


// { score in left: score array in right site }
// { score in right: score array in left site }
function constructMappingScore(data, gender, avg, opposite_avg) {
	pairs_by_iid = d3.nest().key(function(d) { return d['iid'] })
		.entries(data.filter(row => row['gender'] == gender));
	res = {}
	for (var i = 0; i < pairs_by_iid.length; ++i) {
		var iid = pairs_by_iid[i]["key"]
		if (!(iid in avg)) {
			continue;
		}
		var score = avg[iid];
		if (!(score in res)) res[score] = [];
		var values = pairs_by_iid[i]["values"];
		for (var j = 0; j < values.length; ++j) {
			var pid = values[j]["pid"];
			if (!(pid in opposite_avg)) {
				continue;
			}
			if (!(res[score].includes(opposite_avg[pid]))) {
				res[score].push(opposite_avg[pid]);
			}
		}
	}
	return res;
}