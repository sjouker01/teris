
const TETRIS_SHAPE_TYPES = {
    'h': [[1,1,1,1]],
    'v': [[1],[1],[1],[1]],
    's': [[1,1],[1,1]],
    'z': [[1,1,0],[0,1,1]],
    's': [[0,1,1],[1,1,0]],
    'l': [[1,0],[1,0],[1,1]]
};

class TetrisGame {

    /** @type {string} */
    containerid;

    /**@type {HTMLElement} */
    container;
    /** @type {HTMLCanvasElement} */
    canvas;
    /**@type {CanvasRenderingContext2D} */
    context;
    /** @type {TetrisBoard | undefined} */
    board;

    constructor(containerid) {
        this.containerid = containerid;
        this.container = document.getElementById(containerid);
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.resize();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    resize(){
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.canvas.width = width;
        this.canvas.height = height;
    }
    /**
     * @param {event} event
     */
    handleUpdate(event){

    }
    /**
     * @param {keyboardEvent} event
     */
    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowLeft':
            case 'A':
                this.moveShape(0, -1);
                break;
            case 'ArrowRight':
            case 'D':
                this.moveShape(0, 1);
                break;
            case 'ArrowDown':
            case 'S':
                this.moveShapeDown();
                break;
            case 'ArrowUp':
            case 'W':
            case 'Space':
                this.rotateShape();
                break;
            default:
                return;
        }

        this.draw();
    }

    rotateShape() {
        if(this.gameOver){
            return false;
        }
        if(this.shape === undefined){
            return false;
        }
        if(!this.shape.canRotateOn(this.grid)){
            return false;
        }
        this.shape.rotate();
        return true;
    }


    /**
     * @return {TetrisShape}
     */

    createShape() {
        const types = Object.keys(TETRIS_SHAPE_TYPES);
        const type = types[Math.floor(Math.random()* types.length)];


        return new TetrisShape(type, 0, 0);
    }

}
class TetrisBoard {
    /** @type {number} */
       rows;

       /** @type {number} */
       columns;
   
       /** @type {HTMLCanvasElement} */
       canvas;
   
       /** @type {CanvasRenderingContext2D} */
       context;
   
       /** @type {boolean} */
       gameOver;
   
       /** @type {TetrisGrid} */
       grid;
   
       /** @type {TetrisShape} */
       shape;

   constructor(rows = 15, columns = 10){
       this.rows = rows;
       this.columns = columns;
       this.blockSize = 40;
       this.gameOver =false;


       this.canvas = document.getElementById("terisBackground1");
       this.context =this.canvas.getContext('2d')

       this.grid = new TetrisGrid(this.rows, this.columns);
       document.addEventListener('keydown', (event) => this.handleKeyDown(event));
       setInterval(() => this.update(), 1000);
   }

   update(){
       this.cleanGrid();
       this.updateShape();
       this.draw();
   }
   updateShape(){
       if(this.gameOver){
           return;
       }
       if(!this.shape){
           const shape = this.createShape();
           if(!this.grid.canPlace(shape.grid)){
               this.gameOver = true;
               return;
           }
           this.shape = shape;
           return;
       }
       this.moveShapeDown();
   }

   draw(){
       this.context.fillStyle = 'white';
       this.context.fillRect(0,0, this.canvas.width, this.canvas.height);

       this.grid.draw(this.context, this.blockSize);

       if(this.shape){
           this.shape.draw(this.context, this.blockSize);
       }

       if(this.gameOver){
           this.context.save();
           this.context.fillStyle = "black";
           this.context.font = '48px serif';
           this.context.textBaseline = 'middle';
           this.context.textAlign = 'center';

           const x = this.canvas.width /2;
           const y = this.canvas.height /2;
           this.context.fillText('game over', x, y);
           this.context.restore();
       }
   }


   moveShapeDown() {
       if(!this.shape){
           return;
       }
       const hasMoved= this.moveShape(1,0);

       if(!hasMoved) {
           this.shape.PlaceOn(this.grid);
           this.shape = undefined;
       }
   }

   cleanGrid(){
       for(let row = 0; row < this.rows; row++){
           let full = true;

           for(let column = 0; column < this.columns; column++){
               if(!this.grid.has(row, column)){
                   full = false;
               }
           }
           if(full){
               this.grid.removeRow(row);
           }

       }
   }


   /**
    * @param {number} rows
    * @param {number} color
    * @returns {boolean}
    */
   moveShape(rows = 0 , columns = 0){
       if(this.gameOver){
           return false;
       }
       if(this.shape === undefined){
           return false;
       }
       if(!this.shape.canPlaceOn(this.grid, rows , columns)) {
           return false;
       }

       this.shape.move(rows, columns);
       return true;
   }

   /**
    * @param {keyboardEvent} event
    */
   handleKeyDown(event){
       switch(event.key){
           case 'ArrowLeft':
           case 'A':
               this.moveShape(0, -1);
               break;
           case 'ArrowRight':
           case 'D':
               this.moveShape(0,1);
               break;
           case 'ArrowDown':
           case 'S':
               this.moveShapeDown();
               break;
           case 'ArrowUp':
           case 'W':
           case 'space':
               this.rotateShape();
               break;
           default:
               return;
       }
       this.draw();
   }

   rotateShape() {
       if(this.gameOver){
           return false;
       }
       if(this.shape === undefined){
           return false;
       }

       if(!this.shape.canRotateOn(this.grid)){
           return false;
       }

       this.shape.rotate();
       return true;
   }


   /**
    * @returns {TetrisShape}
    */
   createShape(){
       const types = Object.keys(TETRIS_SHAPE_TYPES);
       const type =  types[Math.floor(Math.random() * types.length)];
       return new TetrisShape(type , 0 , 0);   
   }
   
}
class TetrisGrid {
    /**@type {TetrisBlock[]} */
    blocks;

    constructor(rows , columns){
        this.rows = rows;
        this.columns = columns;
        this.blocks = Array.from(Array(this.rows), () => Array(this.columns));
    }

    /**
     * @returns {IterableIterator<TetrisBlock>}
     */
    *[Symbol.iterator]() {
        for (let column = 0; column < this.columns; column++){
            const block = this.get(row, column);
            if(block === undefined) continue;
            yield block;
        }
    }
    /**
     * @param {number} row
     * @param {number} column
     * @returns {boolean}
     */
    has(row, column){
        return this.get(row,column) !==undefined;
    }

    /**
     * @param {number} rows
     * @param {number} column
     * @returns {TetrisBlock|undefined}
     */
    get(row , column){
       if (row < 0 || row >= this.columns) {
            return undefined;
       } 
       if (column <0 || column >= this.columns){
            return undefined;
       }
       return this.blocks[row][column];
    }

    /**
     *  @param {TetrisBlock} block
     *  @returns {boolean}
     */
    set(block) {
        if(this.has(block.row, block.column)){
            return false;
        }
        this.blocks[block.row][block.column] = block;
        return true;
    }



    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @param {string} color 
     * @returns {TetrisBlock}
     */
    create(row, column, color) {
        const block = new TetrisBlock(row, column, color);
        this.set(block);
        return block;
    }

    /**
     * @param {TetrisBlock} block
     * @returns {boolean}
     */
    unset(block) {
        this.blocks[block.row][block.column] = undefined;
        return true;
    }


    /**
     * @param {TetrisGrid} grid
     * @param {number} row
     * @param {number} column
     */
    place(grid, row= 0, column = 0 ){
        for(let oldBlock of grid){
            const block = oldBlock.copy();
            block.row += row;
            block.column += column;
            this.set(block);
        }
    }

    /**
     * @param {TetrisGrid} grid
     * @param {number} row
     * @param {number} column
     * @returns {boolean}
     */


    canPlace(grid, row = 0 , column = 0) {
        for(const block of grid){
            const placeRow = block.row + row;
            const placeColumn = block.column + column;
            if(placeRow < 0 || placeRow >= this.rows) {
                return undefined;
            }

            if(placeColumn <0 || placeColumn >= this.columns){
                return undefined;
            }

            if(this.has(placeRow, placeColumn)) {
                return false;
            }
           
        }
        return true;

    }
    draw(context , width , height = width) {
        for(let block of this) {
            block.draw(context, width, height);
        }
    }

    /**
     * @returns {TetrisGrid}
     */
    rotate() {
        const grid = new TetrisGrid(this.columns, this.rows);

        for(let block of this) {
            const row = block.column;
            const column = this.row - block.row -1;
            grid.create(row , column ,block.color);
        }
        return grid;
    }

    /**
     * @param {number} row
     * 
     */
    removeRow(row) {
        this.blocks.splice(row, 1);
        this.blocks.unshift(Array(this.columns));
        for(const block of this) {
            if (block.row < row){
                block.row += 1;
            }
        }
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
    create() {
    // Kies een willekeurig type blok
    const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const type = types[Math.floor(Math.random() * types.length)];

    // Maak een nieuw blok van het gekozen type
    this.block = new Block(type);

    // Plaats het blok aan de top van het speelveld
    this.block.row = 0;
    this.block.column = Math.floor(this.grid.columns / 2);

    // Controleer of het blok op deze positie kan worden geplaatst
    if (!this.block.canPlaceOn(this.grid)) {
        // Het blok kan niet worden geplaatst, dus het spel is voorbij
        this.gameOver = true;
    }
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
class  Block {
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

/**
 * 
 */
// class TetrisBlock {
//     // ...

//     /**
//      * 
//      * @param {string} type
//      * @param {number} row
//      * @param {number} column
//      * @param {string} color
//      */
//     constructor(type, row, column, color) {
//         this.type = type;
//         this.row = row;
//         this.column = column;
//         this.color = color;

//         // Definieer de vorm van het blok op basis van het type
//         switch (type) {
//             case 'I':
//                 this.grid = this.createGrid(4, 4);
//                 // Vul de grid voor het 'I' blok
//                 break;
//             case 'J':
//                 this.grid = this.createGrid(3, 3);
//                 // Vul de grid voor het 'J' blok
//                 break;
//             // Vul hier de rest van de bloktypen in...
//         }
//     }

//     /**
//      * 
//      * @param {number} rows
//      * @param {number} columns
//      * @returns {Array<Array<boolean>>}
//      */
//     createGrid(rows, columns) {
//         let grid = [];
//         for (let r = 0; r < rows; r++) {
//             let row = [];
//             for (let c = 0; c < columns; c++) {
//                 row.push(false);
//             }
//             grid.push(row);
//         }
//         return grid;
//     }

//     // ...
// }

//  dat moet ik verwerken in class block





// dit moet ik later aan zetten 
const game = new TetrisBoard('tetris-speelveld');