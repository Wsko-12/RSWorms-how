export class Point2 {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

export class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    scale(value) {
        this.x *= value;
        this.y *= value;

        return this;
    }

    getLength() {
       const {x, y} = this;
       return Math.sqrt( x**2 + y**2 );
    }

    clone(){
       const {x, y} = this;
        return new Vector2(x, y);
    }

    normalize(){
        const length = this.getLength();
        this.x /= length;
        this.y /= length;
        return this;
    }

    dotProduct(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
}