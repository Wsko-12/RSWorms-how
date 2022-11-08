// const SEED = Math.random() * 1000000;
const SEED = 749836.6979432805;
console.log("seed:", SEED);

export const generateMap = (size = 512) => new Promise(ready => {
    const MATRIX_SIZE = size;


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.imageRendering = 'pixelated';

    canvas.width = MATRIX_SIZE;
    canvas.height = MATRIX_SIZE;

    const atlas = {};

    const loadImages = () => new Promise((res) => {
        const images = ['breath', 'decor', 'grass', 'ground'];
        let index = -1;
        const load = () => {
            index++;
            if(!images[index]){
                res(true);
                return;
            }
            const name = images[index];
            const image = new Image();
            image.src = `../../assets/${name}.png`;
            image.onload = () => {
                atlas[name] = image;
                load();
            }
        }
        load();
    });

    loadImages().then(initMap);

    function initMap(){
        drawMatrix();
        const rawMatrix = getMatrixFromCtx(ctx);
        fillMapImage();
        cropMapImage(rawMatrix);
        drawGrass(rawMatrix);
        placeObjects(rawMatrix);
    }

    function getMatrixFromCtx(ctx){
        const imageData = ctx.getImageData(0, 0, MATRIX_SIZE, MATRIX_SIZE);
        const alphaData = [];
        for(let i = 3; i < imageData.data.length; i += 4){
            const value = imageData.data[i];
            alphaData.push(value === 255 ? 1 : 0);
        }

        const matrix = [];
        for(let i = 0; i < MATRIX_SIZE; i++){
            const row = alphaData.splice(0, MATRIX_SIZE);
            matrix.push(row); 
        }

        return matrix;
    }

    function drawMatrix(){
        const p5Lib = new p5();
        p5Lib.remove();
        p5Lib.noiseSeed(SEED);
        ctx.fillStyle = '#000000';
        for(let y = 0; y < MATRIX_SIZE; y++){
            for(let x = 0; x < MATRIX_SIZE; x++){
                const zoom = 150;
                const random = p5Lib.noise(x / zoom, y / zoom);
                const value = random > 0.5;
                ctx.fillStyle = `rgba(0,0,0,${+value})`;
                ctx.fillRect(x,y,1,1);
            }
        }
    }

    function fillMapImage(){
        const { ground } = atlas;
        const size = ground.naturalWidth;
        
        for(let x = 0; x < MATRIX_SIZE; x += size){
            for(let y = 0; y < MATRIX_SIZE; y += size){
                ctx.drawImage(ground, x, y);
            }
        }
    }

    function cropMapImage(matrix){
        for(let y = 0; y < MATRIX_SIZE; y++){
            for(let x = 0; x < MATRIX_SIZE; x++){
                if(matrix[y][x] === 0){
                    ctx.clearRect(x, y, 1, 1);
                }
            }
        }
    }

    function drawGrass(matrix){
        const { grass } = atlas;
        const size = grass.naturalWidth;

        for(let y = 1; y < MATRIX_SIZE; y++){
            for(let x = 0; x < MATRIX_SIZE; x++){
                const aboveValue = matrix[y - 1][x];
                const value = matrix[y][x];
                if(value === 1 && aboveValue === 0){
                    const shiftedX = x - size / 4;
                    const shiftedY = y - size / 4;
                    ctx.drawImage(grass, shiftedX, shiftedY, size/2, size/2);
                }
            }
        }
    }

    // first without random
    class Random{
        m = 4294967296;
        a = 1664525;
        c = 1013904223;
        constructor(seed) {
            this.x = seed
        }

        get(){
            const {x, m, a, c} = this;
            this.x = (a * x + c) % m;
            return this.x / m;
        }
    }


    function placeObjects(matrix){
        const rand = new Random(SEED);
        const xRand = Math.floor(rand.get() * MATRIX_SIZE);



        const yPlaces = [];
        for(let y = 1; y < MATRIX_SIZE; y++){
            const aboveValue = matrix[y-1][xRand];
            const value = matrix[y][xRand];
            if(value && !aboveValue){
                yPlaces.push(y);
            }
        }

        const { decor } = atlas;

        const { naturalWidth, naturalHeight } = decor;
        const x = xRand - naturalWidth / 2; 
        const y = yPlaces.at(-1) - naturalHeight;

        const url = canvas.toDataURL();
        const mapImage = new Image();
        mapImage.src = url;
        mapImage.onload = () => {
            ctx.drawImage(decor, x, y);
            ctx.drawImage(mapImage, 0, 0);
            final();
        }
    }


    function final(){
        const url = canvas.toDataURL();
        const mapImage = new Image();
        mapImage.src = url;
        const matrix = getMatrixFromCtx(ctx);
        mapImage.onload = () => {
            ready([matrix, mapImage]);
        }
    }
});



