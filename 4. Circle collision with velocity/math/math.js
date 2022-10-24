export class Point2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }


    draw(ctx, yShift = 0, color = '#ff0000', size=2){
        const {x, y} = this;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, yShift - y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
        
        this.start = new Point2();
        this.end = new Point2(x, y);
    }
}