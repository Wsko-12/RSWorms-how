
import p5Func from './perlin.js';
export default (matrixSize) => {
    return new Promise(res => {
        const p5 = new p5Func();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MATRIX_SIZE = matrixSize;

        canvas.height = MATRIX_SIZE;
        canvas.width = MATRIX_SIZE;


        ctx.fillStyle = '#000000';
        const seed = Math.random() * 10000000000;
        console.log('Seed:', seed);
        const RESOLUTION = 100;
        const random = p5.noiseSeed(seed);

        for(let y = 0; y < MATRIX_SIZE; y++){
            for(let x = 0; x < MATRIX_SIZE; x++){
                const rand = p5.noise(x/RESOLUTION,y/RESOLUTION);
                if(rand > 0.5){
                    ctx.fillRect(x,y,1,1);
                }
            }
        }
        canvas.style.imageRendering = 'pixelated';

        const imageData = ctx.getImageData(0,0,MATRIX_SIZE,MATRIX_SIZE);

        const alphaData = []
        for(let i = 3; i < imageData.data.length; i += 4){
            alphaData.push(imageData.data[i] === 255 ? 1 : 0);
        }

        const maskMatrix = [];
        for(let i = 0; i < MATRIX_SIZE; i ++){
            const row = alphaData.splice(0, MATRIX_SIZE);
            maskMatrix.push(row);
        }

        const loadedImages = {};
        function loadImages(){
            const images = ['ground', 'grass', 'decor'];
            let index = -1;
            return new Promise((res) => {
                function load(){
                    index++;
                    const imageName = images[index];
                    if(!imageName){
                        res(true);
                        return;
                    }
                    const path = `./map/assets/${imageName}.png`;
                    const image = new Image();
                    loadedImages[imageName] = image;
                    image.src = path;
                    image.onload = load; 
                }
                load();
            });
        };



        loadImages().then(() => {
            drawGroundTexture()
        });

        function drawGroundTexture(){
            const { ground } = loadedImages;
            const width = ground.naturalWidth;
            for(let y = 0; y < MATRIX_SIZE; y += width){
                for(let x = 0; x < MATRIX_SIZE; x += width){
                    ctx.drawImage(ground, x, y);
                }
            }

            cropGroundTexture();
        }

        function cropGroundTexture(){
            for(let y = 0; y < MATRIX_SIZE; y++){
                for(let x = 0; x < MATRIX_SIZE; x++){
                    const value = maskMatrix[y][x];
                    // I know about !value
                    if(value === 0){
                        ctx.clearRect(x,y,1,1);
                    }
                }
            }
            drawGrass();
        }

        function drawGrass(){
            const { grass } = loadedImages;
            const width = grass.naturalWidth;
            for(let y = 0; y < MATRIX_SIZE; y++){
                if(!maskMatrix[y - 1]) continue;
                for(let x = 0; x < MATRIX_SIZE; x++){
                    const value = maskMatrix[y][x];
                    const aboveValue = maskMatrix[y - 1][x];
                    if(value === 1 && aboveValue === 0){
                        const shiftedX = x - width /2;
                        const shiftedY = y - width /2;
                        ctx.drawImage(grass, shiftedX, shiftedY);
                    }
                }
            }

            drawObjects();
        }

        function drawObjects(){
            const renderedGroundUrlData = canvas.toDataURL();
            ctx.clearRect(0,0, MATRIX_SIZE, MATRIX_SIZE); //optional
            const renderedGroundImage = new Image();
            renderedGroundImage.src = renderedGroundUrlData;
            renderedGroundImage.onload = () => {
                ctx.drawImage(renderedGroundImage,0,0);

                final();
            }

            const randomX = Math.floor(random.rand() * MATRIX_SIZE);
            const suitableYs = [];
            for(let y = 1; y < MATRIX_SIZE; y++){
                const aboveValue = maskMatrix[y - 1][randomX];
                const value = maskMatrix[y][randomX];
                if(value === 1 && aboveValue === 0){
                    suitableYs.push(y);
                }
            }
            
            const lowestY = suitableYs.at(-1); 
            if(lowestY){
                const { decor } = loadedImages;
                const width = decor.naturalWidth;
                const height = decor.naturalHeight;
                const x = randomX - width/2;
                const y = lowestY - height;
                ctx.drawImage(decor, x, y);
            }
        }

        function final(){
            console.log('final')
            const image = new Image();
            const url = canvas.toDataURL();
            image.src = url;
            image.onload = () => {
                res([canvas, ctx, image]);
            }
        }
    });
};