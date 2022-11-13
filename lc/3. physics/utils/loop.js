export default class Loop {
    constructor(fps, callback) {
        this.oneFrameTime = 1000 / fps;
        this.msCounter = 0;
        this.subscribers = [];
    }

    play(delta) {
        this.msCounter += delta;
        if(this.msCounter > this.oneFrameTime){
            this.subscribers.forEach((cb) => cb());
            this.msCounter = this.msCounter % this.oneFrameTime;
        }
    }

    subscribe(cb){
        this.subscribers.push(cb)
    }
}