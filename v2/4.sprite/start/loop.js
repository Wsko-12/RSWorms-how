export default class Loop {
    constructor(fps, callback) {
        this.oneFrameTime = 1000 / fps;
        this.callback = callback;
        this.msCounter = 0;
    }

    play(delta) {
        this.msCounter += delta;
        if(this.msCounter > this.oneFrameTime){
            this.callback();
            this.msCounter = this.msCounter % this.oneFrameTime;
        }
    }
}