


class Tetris {

    /**
     * @param {string} type  
     * @param {number} x
     * @param {number} y
     * @todo Check if it can be drawn
    */
    constructor(type ,  x , y ){
        this.type = type;
        this.x = x;
        this.y = y;
    }
  

    moveDown() {
        if (this.y <560) {
            this.y += 40;
        }
    }

    moveLeft(){
        if (this.x >0) {
            this.x -= 40;
        }
    }
    moveRight() {
        if (this.x < 240){
            this.x += 40;
        }
    }
}
    
