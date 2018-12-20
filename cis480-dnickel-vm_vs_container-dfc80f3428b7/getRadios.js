var form = document.querySelector("#vmForm");
var log = document.querySelector("#log");
var res = document.querySelector("#results");

$("#submit").click(function() {
    var send = {};

    for (var i=0; i < 10; i++) {
        send[i] = {}
        send[i].critical = getRadios("crit" + (i + 1));
        send[i].value = getRadios("val" + (i + 1));
    }

    var output = defOut(ahp(send));
        
    log.innerHTML = output;
    res.innerText = "Results";
});

function getRadios(rName) {
    var radios = document.getElementsByName(rName);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
    }
    return '';
}

function ahp(m) {
    var matrix = [[],[],[],[],[]];
    var s = 5;

    var sIndex = 0;
    //Assign values to matrix
    matrix = assign(m, s);
        
    //Sum and divide columns
    matrix = sumDiv(matrix, s);

    var avg = [];
    //Find the average of each row
    avg = findAvg(matrix, s);

    var vm = [2,1,1,2,1];
    var c = [1,1,2,1,2];
    var vmScore = 0;
    var cScore = 0;
    var vmArr = [];
    var cArr = [];
    //Multiply averages by weights
    for (var i=0; i < s; i++) {
        vmArr[i] = (vm[i] * avg[i]);
        cArr[i] = (c[i] * avg[i]);
        vmScore = vmScore + vmArr[i];
        cScore = cScore + cArr[i];
    }

    results = {}
    results.vmScore = vmScore;
    results.cScore = cScore;
    results.avg = avg;
    results.vmArr = vmArr;
    results.cArr = cArr;

    return(results);
}

function assign(m, s) {
    var matrix = [[],[],[],[],[]];

    var sIndex = 0;console.log(m[0].critical==1);
    //Assign values to matrix
    for (var i=0; i < s; i++) {
        for (var j=0; j < (s - i); j++) {
            if (j == 0) matrix[i][i+j] = 1;
            else if (m[sIndex].critical-1 == i) {
                matrix[i][j+i] = parseInt(m[sIndex].value);
                matrix[j+i][i] = 1 / parseInt(m[sIndex].value);
                sIndex++;
            }
            else {
                matrix[i][j+i] = 1 / parseInt(m[sIndex].value);
                matrix[j+i][i] = parseInt(m[sIndex].value);
                sIndex++;
            }
        }
    } 

    return matrix;
}

function sumDiv(matrix, s) {
    var sum = 0;
    var mult = [];

    //Find the sum of the columns
    for (var i=0; i < s; i++) {
        for (var j=0; j < s; j++) {
            sum = sum + matrix[j][i];
        }
        mult[i] = sum;
        sum = 0
    }
    //Divide each cell by the sum of its column
    for (var i=0; i < s; i++) {
        for (var j=0; j < s; j++) {
            matrix[j][i] = matrix[j][i] / mult[i];
        }
    }

    return matrix;
}

function findAvg(matrix, s) {
    var sum = 0;
    var avg = [];
    //Find the average of each row
    for (var i=0; i < s; i++) {
        for (var j=0; j < s; j++) {
            sum = sum + matrix[i][j];
        }
        avg[i] = (100 * sum / s).toFixed(0);
        sum = 0;
    } 

    return avg;
}

function defOut(r) {
    var criteria = ["Power Usage", "Learning Curve", "Start & Stop Time", "Security", "Portability"];

    var output = "<tr>"
                    + "<th></th>"
                    + "<th class=\"text-center\">Virtual Machine</th>"
                    + "<th class=\"text-center\">Container</th>"
                    + "<th class=\"text-center\">Priority</th>"
                + "</tr>";

    for (var i=0; i < 5; i++) {
        output = output + "<tr>"
                + "<td>" + criteria[i] + "</td>"
                + "<td class=\"text-center\">" + r.vmArr[i] + "</td>"
                + "<td class=\"text-center\">" + r.cArr[i] + "</td>"
                + "<td class=\"text-center\">" + r.avg[i] + "%</td>"
            + "</tr>";
    }

    output = output + "<tr>"
                + "<th></th>";
    if (r.vmScore > r.cScore) {
        output = output + "<th class=\"text-center\">" + r.vmScore + "</th>"
                        + "<td class=\"text-center\">" + r.cScore + "</th>";
    }
    if (r.vmScore < r.cScore) {
        output = output + "<td class=\"text-center\">" + r.vmScore + "</th>"
                        + "<th class=\"text-center\">" + r.cScore + "</th>";
    }
    if (r.vmScore == r.cScore) {
        output = output + "<th class=\"text-center\">" + r.vmScore + "</th>"
                        + "<th class=\"text-center\">" + r.cScore + "</th>";
    }
    output = output + "</tr>";

    return output;
}