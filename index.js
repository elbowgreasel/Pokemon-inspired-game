// selecting the canvas element from HTML and setting it to canvas
const canvas = document.querySelector('canvas');
// c = context, uses a 2d API called getContext
const c = canvas.getContext('2d')

//setting canvas width/height - change this later to css
canvas.width = 1024
canvas.height = 576


//Takes the width of the map from Tiled, and sets it to the the gain of I
//Then adds an array of arrays that contain the collision tiles relative position.
const collisionsMap = []
console.log(collisions)
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}



const boundaries = []

const offset = {
    x: -1700,
    y: -710
}

collisionsMap.forEach((row, i) => {
    row.forEach((index, j) => {
        if(index === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x + 22,
                        y: i * Boundary.height + offset.y - 4
                    }
                })
            )
        }
    })
})

console.log(boundaries)

// setting background to be Lushel Coast
const image = new Image()
image.src = './img/Lushel Coast.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'




const player = new Sprite({
    position: {
        x: (canvas.width / 2) - (192 / 4) / 2,
        y: (canvas.height / 2) - (68 / 2)
    },
    image: playerImage,
    frames: {
        max: 4  
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()
    foreground.draw()
    let moving = true
    if (keys.w.pressed && lastKey === 'w'){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(moveable => {
            moveable.position.y += 3
        })
    }
    else if(keys.a.pressed && lastKey === 'a'){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(moveable => {
            moveable.position.x += 3
        })
    }
    else if(keys.s.pressed && lastKey === 's'){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(moveable => {
            moveable.position.y -= 3
        })
    }
    else if(keys.d.pressed && lastKey === 'd'){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(moveable => {
            moveable.position.x -= 3
        })
    }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break;
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break;
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
    }
})
