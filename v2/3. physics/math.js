export class Point2 {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

export class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    scale(scalar){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    getLength(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize(){
        const length = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    dotProduct(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    clone(){
        return new Vector2(this.x, this.y);
    }
}


