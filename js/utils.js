// function to format line data
var prepareData = function (data) {

    var keys = Object.keys(data[0]);
    var lines = [];

    for (var key = 1; key < keys.length; key += 1) {

        var line = [];

        for (var idx = 0; idx < data.length; idx += 1) {

            var x = null;
            var y = null;

            if (data[idx][keys[0]] !== "") {
                x = parseFloat(data[idx][keys[0]]);
            }

            if (data[idx][keys[key]] !== "") {
                y = parseFloat(data[idx][keys[key]]);
            }

            var point = {
                'x': x,
                'y': y
            }

            line.push(point);

        }

        lines.push(line);

    }

    return lines;
};


var preparePercentageData = function(data) {

    var percentage_data = []

    for (var line = 0; line < data.length; line += 1) {

        var change = [];

        var point = {
            'x': data[line][0].x,
            'y': null
        };

        change.push(point);

        for (var p = 1; p < data[line].length; p += 1) {

            var point = {
                'x': data[line][p].x,
                'y': null
            };

            if (data[line][p - 1].y !== null && data[line][p].y !== null) {
                var tmp = (data[line][p].y - data[line][p - 1].y) / data[line][p - 1].y;
                point['y'] = tmp * 100;
            }

            change.push(point);

        }

        percentage_data.push(change);

    }

    return percentage_data;

};