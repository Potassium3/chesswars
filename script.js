let width = window.innerWidth;
let height = window.innerHeight;

let sintable = [];
for (let i=0; i<360; i++) {
    sintable.push(Math.sin(i*(3.14159*2)/360))
}
console.log(sintable);

function quicksin(x) {
    return sintable[x%360]
}

function quickcos(x) {
    return Math.cos(x*(3.14159*2)/360)
}

function multiplyvector(v, m) {
    return [v[0]*m, v[1]*m]
}

function addvector(v, v2) {
    return [v[0]+v2[0], v[1]+v2[1]]
}

function convert3D2D(x, y, z, rot, ele) {
    let zvector = [0, quicksin(ele)]
    let xvector = [quickcos(rot), quicksin(rot)*quickcos(ele)]
    let yvector = [-quicksin(rot), quickcos(rot)*quickcos(ele)]
    let projectedx = multiplyvector(xvector, x);
    let projectedy = multiplyvector(yvector, y);
    let projectedz = multiplyvector(zvector, z);
    let projected = addvector(addvector(projectedx, projectedy), projectedz)
    return projected
}

function drawPolygon(arr, rgb) {
    let game = document.getElementById("game");
    let clipPath = ""
    for (let item of arr) {
        clipPath += `${item[0]+width/2}px ${item[1]+height/2}px,`
    }
    clipPath = clipPath.slice(0, -1);
    game.innerHTML += `<div style="clip-path: polygon(${clipPath}); background-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]});"></div>`
}

function clear() {
    let game = document.getElementById("game");
    game.innerHTML = "";
}

function showBlock(rot, ele, x, y, z, xw, yw, zw, rgb) {
    let xr = (rot%360) < 180
    let yr = (rot%360) < 90 || (rot%360) >= 270
    let zr = false
    // Draw x face
    if (!xr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x, y+yw, z, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
            convert3D2D(x, y, z+zw, rot, ele),
        ], [rgb[0], rgb[1], rgb[2]]);
    } else {
        drawPolygon([
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
        ], [rgb[0], rgb[1], rgb[2]]);
    }
    // Draw y face
    if (!yr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
            convert3D2D(x, y, z+zw, rot, ele),
        ], [rgb[0]*0.9, rgb[1]*0.9, rgb[2]*0.9]);
    } else {
        drawPolygon([
            convert3D2D(x, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
        ], [rgb[0]*0.9, rgb[1]*0.9, rgb[2]*0.9]);
    }
    // Draw z face
    if (!zr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x, y+yw, z, rot, ele),
        ], [rgb[0]*0.95, rgb[1]*0.95, rgb[2]*0.95]);
    } else {
        drawPolygon([
            convert3D2D(x, y, z+zw, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
        ], [rgb[0]*0.95, rgb[1]*0.95, rgb[2]*0.95]);
    }
}
/*
function interpretLML(data, x, y, z, xw, yw, zw) {
    let xr = (rot%360) < 180
    let yr = (rot%360) < 90 || (rot%360) >= 270
    let zr = false
    if (!data.includes("(")) {
        if (data == "brown") {
            showBlock(rot, ele, x, y, z, xw, yw, zw, [150, 72, 24]);
        } else if (data == "white") {
            showBlock(rot, ele, x, y, z, xw, yw, zw, [237, 197, 179]);
        } else if (data == "grey") {
            showBlock(rot, ele, x, y, z, xw, yw, zw, [200, 200, 200]);
        }
        return
    }
    let split = data[0]

    let bracketdepth = 0;
    let dimension = "";
    let text = "";
    let nexttext = "";
    let next = false;
    let bracketalready = false;
    for (let char of data) {
        if (char == "(") {
            bracketdepth++;
            bracketalready = true;
        } else if (char == ")") {
            bracketdepth--;
        }
        if (bracketdepth == 0 && bracketalready) {
            next = true;
        }
        if (bracketdepth > 0) {
            if (!(char == "(" && bracketdepth == 1)) {
                if (!next) {
                    text += char;
                } else {
                    nexttext += char;
                }
            }
        } else if (char != "(" && char != ")") {
            dimension += char;
        }
    }

    dimension = parseFloat(dimension.substring(1));

    if (split === "x") {
        dimension = (dimension+xw)%xw;
        if (xr) {
            interpretLML(text, x, y, z, dimension, yw, zw);
            interpretLML(nexttext, x+dimension, y, z, xw-dimension, yw, zw);
        } else {
            interpretLML(nexttext, x+dimension, y, z, xw-dimension, yw, zw);
            interpretLML(text, x, y, z, dimension, yw, zw);
        }
    } else if (split === "y") {
        dimension = (dimension+yw)%yw;
        if (yr) {
            interpretLML(text, x, y, z, xw, dimension, zw);
            interpretLML(nexttext, x, y+dimension, z, xw, yw-dimension, zw);
        } else {
            interpretLML(nexttext, x, y+dimension, z, xw, yw-dimension, zw);
            interpretLML(text, x, y, z, xw, dimension, zw);
        }
    } else if (split === "z") {
        dimension = (dimension+zw)%zw;
        if (zr) {
            interpretLML(text, x, y, z, xw, yw, dimension);
            interpretLML(nexttext, x, y, z+dimension, xw, yw, zw-dimension);
        } else {
            interpretLML(nexttext, x, y, z+dimension, xw, yw, zw-dimension);
            interpretLML(text, x, y, z, xw, yw, dimension);
        }
    } 
}*/

const WIDTH = 8; // 8x8 board
let rot = 30
let ele = 45

setInterval(function() {
    clear();
    showBlock(rot, ele, -50, -50, -50, 100, 100, 100, [237, 197, 179])
    rot+=3;
    ele = quicksin(rot*2)*5+70
}, 50)

setInterval(function () {
    width = window.innerWidth;
    height = window.innerHeight;
}, 1000)