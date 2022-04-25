// selecting the canvas element from HTML and setting it to canvas
const canvas = document.querySelector('canvas');
// c = context, uses a 2d API called getContext
const c = canvas.getContext('2d')

//setting canvas width/height - change this later to css
canvas.width = 1024
canvas.height = 576

// setting the color/apperance of the context
c.fillStyle = 'white'
// setting the (x pos, y pos, width, height) of the context
c.fillRect(0, 0, canvas.width, canvas.height)

// setting background to be Lushel Coast
const image = new Image()
image.src = './img/Lushel Coast.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'


image.onload = () => {
    c.drawImage(image, -1175, -350)
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        (canvas.width / 2) - (playerImage.width / 4) / 2,
        (canvas.height / 2) - (playerImage.height / 2),
        playerImage.width / 4,
        playerImage.height
    )
}
