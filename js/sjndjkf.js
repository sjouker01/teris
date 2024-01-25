 class TetrisBlock {
     // ...

     /**
      * 
      * @param {string} type
      * @param {number} row
      * @param {number} column
      * @param {string} color
      */
     constructor(type, row, column, color) {
         this.type = type;
         this.row = row;
         this.column = column;
         this.color = color;

// Definieer de vorm van het blok op basis van het type
         switch (type) {
             case 'I':
                 this.grid = this.createGrid(4, 4);
                 // Vul de grid voor het 'I' blok
                 break;
             case 'J':
                 this.grid = this.createGrid(3, 3);
                 // Vul de grid voor het 'J' blok
                 break;
             // Vul hier de rest van de bloktypen in...
         }
     }

     /**
      * 
      * @param {number} rows
      * @param {number} columns
      * @returns {Array<Array<boolean>>}
      */
    createGrid(rows, columns) {
       let grid = [];
         for (let r = 0; r < rows; r++) {
             let row = [];
           for (let c = 0; c < columns; c++) {
               row.push(false);
             }
             grid.push(row);
        }
      return grid;
    }

     // ...
 }

//   dat moet ik verwerken in class block
class  TetrisBlock {
    /** @type {number}  */
    row;
    /**@type {number} */
    column;
    /**@type {string} */
    color;

    /**
     * @param {string} type
     * @param {number} row
     * @param {number} column
     * @param {string} color
     */
    constructor(type ,row, column , color){
        this.type =  type;
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