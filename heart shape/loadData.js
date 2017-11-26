function getAveragePeerScore(data, gender, attr, match) {
	pairs = data.filter(row => row['match'] == match)
	pairs_by_iid = d3.nest().key(function(d) { return d['iid'] })
		.entries(pairs.filter(row => row['gender'] == gender))
	pairs_by_iid_avg_attr = d3.nest().key(function(d) { return d['iid'] })
		.rollup(function(v) { 
			return d3.mean(v, function(d) {
				//skip empty strings, null is ingnored nby defualt
				return d[attr] == ''? null: +d[attr]
			})
		})
		.entries(pairs.filter(row => row['gender'] == gender))
	res = {}
	for (var i = 0; i < pairs_by_iid_avg_attr.length; ++i) {
		res[pairs_by_iid_avg_attr[i]['key']] = pairs_by_iid_avg_attr[i]['value']
	}
	return res
}