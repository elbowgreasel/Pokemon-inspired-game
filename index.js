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
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+= 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

console.log(battleZonesMap)


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
                        y: i * Boundary.height + offset.y + 2
                    },
                    width: 12,
                    height: 2
                })
            )
        }
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((index, j) => {
        if(index === 1026){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y - 17
                    }
                })
            )
        }
    })
})

// setting background to be Lushel Coast
const image = new Image()
image.src = './img/Lushel Coast.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'




const player = new Sprite({
    position: {
        x: (canvas.width / 2) - (192 / 4) / 2,
        y: (canvas.height / 2) - (68 / 2)
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage
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

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
    )
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    // sets player movement, needed before battle initiation to stop movement
    let moving = true
    player.animate = false

    //if battle is initiated stop all the below code
    if(battle.initiated) return

    // Activate a battle-----------------------------------
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed ){
        for (let i = 0; i < battleZones.length; i++){
            const battleZone = battleZones[i]
            // detect collision overlap
            const overLappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overLappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01
            ) {
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId)

                // Swap to battle-screen
                battle.initiated = true
                gsap.to('#battle-screen', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.35,
                    onComplete(){
                        gsap.to(`#battle-screen`, {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // activate a new animation loop
                                animateBattle()
                                gsap.to(`#battle-screen`, {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    // Movement--------------------------------------------
    if (keys.w.pressed && lastKey === 'w'){
        player.animate = true
        player.image = player.sprites.up

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
        player.animate = true
        player.image = player.sprites.left
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
        player.animate = true
        player.image = player.sprites.down
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
        player.animate = true
        player.image = player.sprites.right
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

const battleBackgroundImage = new Image()
battleBackgroundImage.src = `./img/battleBackground.png`
const battleBackground = new Sprite({
    position: {
    x: 0,
    y: 0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image()
draggleImage.src = `./img/draggleSprite.png`
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
})

const embyImage = new Image()
embyImage.src = `./img/embySprite.png`
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 18
    },
    animate: true
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()
}

//animate()

animateBattle()

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
