const width = window.innerWidth;
const height = window.innerHeight;

function quicksin(x) {
    return Math.sin(x*(3.14159*2)/360)
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
        clipPath += `calc(${item[0]+width/2}px) calc(${item[1]+height/2}px),`
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
        ], [rgb[0]-15, rgb[1]-15, rgb[2]-15]);
    } else {
        drawPolygon([
            convert3D2D(x, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
        ], [rgb[0]-15, rgb[1]-15, rgb[2]-15]);
    }
    // Draw z face
    if (!zr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x, y+yw, z, rot, ele),
        ], [rgb[0]-8, rgb[1]-8, rgb[2]-8]);
    } else {
        drawPolygon([
            convert3D2D(x, y, z+zw, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
        ], [rgb[0]-8, rgb[1]-8, rgb[2]-8]);
    }
}

function interpretLML(data, x, y, z, xw, yw, zw) {
    let xr = (rot%360) < 180
    let yr = (rot%360) < 90 || (rot%360) >= 270
    let zr = false
    if (!data.includes("(")) {
        if (data == "green") {
            showBlock(30, 60, x, y, z, xw, yw, zw, [127, 255, 127]);

        } else if (data == "blue") {
            showBlock(30, 60, x, y, z, xw, yw, zw, [255, 255, 127]);

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
        if (bracketdepth > 0 && char != "(") {
            if (!next) {
                text += char;
            } else {
                nexttext += char;
            }
        } else if (char != "(" && char != ")") {
            dimension += char;
        }
    }

    dimension = parseFloat(dimension.substring(1));

    if (split === "x") {
        if (xr) {
            interpretLML(text, x, y, z, dimension, yw, zw);
            interpretLML(nexttext, x+dimension, y, z, xw-dimension, yw, zw);
        } else {
            interpretLML(nexttext, x+dimension, y, z, xw-dimension, yw, zw);
            interpretLML(text, x, y, z, dimension, yw, zw);
        }
    } else if (split === "y") {
        if (yr) {
            interpretLML(text, x, y, z, xw, yw-dimension, zw);
            interpretLML(nexttext, x, y+dimension, z, xw, dimension, zw);
        } else {
            interpretLML(nexttext, x, y, z, xw, yw, zw);
            interpretLML(text, x, y, z, xw, yw, zw);
        }
    } else if (split === "z") {
        interpretLML(text, x, y, z, dimension, yw, zw);
        interpretLML(nexttext, x, y, z+dimension, xw, yw, zw-dimension);
    }
}

const WORLD = `
x(
green
)
30
(
blue
)
`.replaceAll("\n", "").replaceAll(" ", "")

let rot = 30
let ele = 45
setInterval(function() {
    clear();
    interpretLML(WORLD, -250, -250, -250, 500, 500, 500);
}, 50)