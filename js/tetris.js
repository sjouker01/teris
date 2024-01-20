
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

class TetrisShape {
    /**@type {string} */
    type; 
    /**@type {number} */
    column;


    /** @type {TetrisGrid} */
    grid; 



    constructor(type,  row , column , color) {
        this.type = type; 
        this.row = row; 
        this.column = column;
        this.color || this.getRandomColor();

        this.resetGrid();
    }


    /**
     * @param {TetrisGrid} grid
     * @param {number} rows
     * @param {number} columns
     * @returns
     */
    canPlaceOn(grid, rows = 0 , columns =0 ){
        return grid.canPlace(this.grid, this.row + rows, this.column + columns);
    }

    /**
     * @param {TetrisGrid} grid
     */
    PlaceOn(grid){
        return grid.place(this.grid , this.row, this.column);
    }

    /**
     * @param {TetrisGrid} grid
     * @returns
     */
    canRotateOn(grid){
        const rotated = this.grid.rotate();

        let row = this.row;
        let column = this.column;

        switch(this.type) {
            case ' h' :
                row -= 1; 
                column += 1;
                break; 
            case 'v':
                row += 1;
                column -= 1;
                break;
        }
        return grid.canPlace(rotated, row , column);
    }

    rotate(){
        const rotated = this.grid.rotate();
        this.grid = rotated;

        switch(this.type){
            case 'h':
                this.row -= 1;
                this.column += 1;
                this.type = 'v';
                break;

            case 'v':
                this.row += 1;
                this.column -= 1;
                this.type = 'h';
                break;
        
        }
    }


    resetGrid(){
        const template = TETRIS_SHAPE_TYPES[this.type];

        if(template === undefined || template.length === 0 ){
            this.grid =new TetrisGrid(0,0);
            return;
        }
        this.grid = new TetrisGrid(template.length, template[0].length);

        for(let row = 0; row < template.length; row++ ){
            for(let column = 0; column < template[row].length; column++){
                if(template[row][column] === 1){
                    this.create(row, column , this.color);
                }
            }
        }
    }


    /**
     * @param {CanvasRenderingContext2D} context
     */
    draw(context , width , height = width){
        context.save();
        context.translate(this.column * width, this.row * height);
        this.grid.draw(context, width ,height);
        context.restore();
    }
    /**
     * @param {number} rows
     * @param {number} columns
     */
    move(rows = 0 , columns = 0){
        this.row += rows;
        this.column += columns;
    }

    /**
     * @returns  {string}
     */
    getRandomColor(){
        const [r, g, b] = [
        Math.floor(Math.random()* 230),
        Math.floor(Math.random()* 230),
        Math.floor(Math.random()* 230)
        ];

        return `rgb(${r}, ${g}, ${b})`;
    }
    
}

// dit moet ik later aan zetten 
// const game = new TetrisBoard('tetris-speelveld');