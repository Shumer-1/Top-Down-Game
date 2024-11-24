const canvas = document.getElementById("level1")

const ctx = canvas.getContext("2d");

const image = new Image()
image.src = "../tiled/worlds/Tiled_files/water_coasts.png";
image.onload = () => {
    ctx.drawImage(image, 0, 0)
}

