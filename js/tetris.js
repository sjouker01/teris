
class  TetrisBlock {
    /** @type {number}  */
    row;

    /**@type {number} */
    column;


    /**@type {string} */
    color;

    /**
     * 
     * @param {number} row
     * @param {number} column
     * @param {string} color
     */
    constructor(row, column , color){
        this.row = row;
        this.column = column;
        this.color = color;
    }

    /**
     * @param {CanvasRenderingContext2D}  context
     * @param {number} width
     * @param {number} height
     */
    draw(context ,width , height = width){
        let x = this.column * width;
        let y = this.row * height;

        context.fillStyle = this.color;
        context.strokeStyle =  "black";

        context.fillRect(x, y, width , height);
        context.strokeRect(x, y , width , height);
    }
    /** 
     * @returns {TetrisBlock}
     */
    copy(){
        return new TetrisBlock(this.row, this.column, this.color);
    }
}

// dit moet ik later aan zetten 
// const game = new TetrisBoard('tetris-speelveld');