function quicksin(x) {
    return Math.sin(x)
}

function quickcos(x) {
    return Math.cos(x)
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

function drawPolygon(arr) {
    const width = 1000
    const height = 1000
    let game = document.getElementById("game");
    let clipPath = ""
    for (let item of arr) {
        clipPath += `calc(${item[0]+width/2}px) calc(${item[1]+height/2}px),`
    }
    clipPath = clipPath.slice(0, -1);
    game.innerHTML += `<div style="clip-path: polygon(${clipPath})"></div>`
}

function clear() {
    let game = document.getElementById("game");
    game.innerHTML = "";
}

function showBlock(rot, ele, x, y, z, xw, yw, zw) {
    xr = true
    yr = true
    zr = true
    // Draw x face
    if (!xr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x, y+yw, z, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
            convert3D2D(x, y, z+zw, rot, ele),
        ]);
    } else {
        drawPolygon([
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
        ]);
    }
    // Draw y face
    if (!yr) {
        drawPolygon([
            convert3D2D(x, y, z, rot, ele),
            convert3D2D(x+xw, y, z, rot, ele),
            convert3D2D(x+xw, y, z+zw, rot, ele),
            convert3D2D(x, y, z+zw, rot, ele),
        ]);
    } else {
        drawPolygon([
            convert3D2D(x, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z, rot, ele),
            convert3D2D(x+xw, y+yw, z+zw, rot, ele),
            convert3D2D(x, y+yw, z+zw, rot, ele),
        ]);
    }
}

let rot = 4;
setInterval(function() {
    clear();
    showBlock(rot, rot/6, 0, 0, 0, 20, 100, 300);
    rot += 0.09;
}, 50)