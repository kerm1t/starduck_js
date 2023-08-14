class vec2{
    /**
     * Initializes a new vector.
     * @param {Number|vector} x Initial value of x (can be number or vector).
     * @param {Number|null} y Initial value of y.
     */
    constructor(x, y){
        if(x instanceof vec2){
            this.x = x.x;
            this.y = x.y
        }else{
            this.x = x;
            this.y = y;
        }
    }
    /**
     * Changes the digit count after the decimal point.
     * @param {Number} digits Number of digits to appear after decimal point.
     * @returns The vector.
     */
    ToFixed(digits){this.x=parseFloat(this.x.toFixed(digits));this.y=parseFloat(this.y.toFixed(digits));return this;}

    /**
     * Floors the vector.
     * @returns The vector.
     */
    Floor(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this;}

    /**
     * Clamps a vector to the given values.
     * @param {Number} min Minimal inclusive number.
     * @param {Number} max Max inclusive number.
     * @returns The vector.
     */
    Clamp(min, max){this.x=Math.min(Math.max(this.x, min), max);this.y=Math.min(Math.max(this.y, min), max);return this;}

    /**
     * Clamps a vector to the given values.
     * @param {Number} xMin Min inclusive number on x axis.
     * @param {Number} xMax Max inclusive number on x axis.
     * @param {Number} yMin Min inclusive number on y axis.
     * @param {Number} yMax Max inclusive number on y axis.
     * @returns The vector.
     */
    ClampXY(xMin, xMax, yMin, yMax){this.x=Math.min(Math.max(this.x, xMin), xMax);this.y=Math.min(Math.max(this.y, yMin), yMax);return this;}

    /**
     * Clamps a vector by another vector.
     * @param {Vector} clampX Vector to clamp x by. (Vector.x will be the Min and Vector.y will be the Max value).
     * @param {Vector} clampY Vector to clamp y by. (Vector.x will be the Min and Vector.y will be the Max value).
     * @returns The vector.
     */
    ClampWithVector(clampX, clampY){this.x=Math.min(Math.max(this.x, clampX.x), clampX.y);this.y=Math.min(Math.max(this.y, clampY.x), clampY.y);return this;}

    /**
     * Adds to vector by given vector.
     * @param {vector} vector Vector values to add to original.
     * @returns The vector.
     */
    AddVector(vector){this.x+=vector.x;this.y+=vector.y;return this;}
    
    /**
     * Adds to vector by given amount.
     * @param {Number} amount Amount to add to original.
     * @returns The vector.
     */
    Add(amount){this.x+=amount;this.y+=amount;return this;}
    
    /**
     * Subtracts vector by given vector.
     * @param {vector} vector Vector to subtract to original.
     * @returns The vector.
     */
    SubtractVector(vector){this.x-=vector.x;this.y-=vector.y;return this;}
    
    /**
     * Subtracts vector by given amount.
     * @param {Number} amount amount to subtracts from original.
     * @returns The vector.
     */
    Subtract(amount){this.x-=amount;this.y-=amount;return this;}
    
    /**
     * Multiplies vector by given vector.
     * @param {vector} vector Vector to Multiply vector by.
     * @returns The vector.
     */
    MultiplyVector(vector){this.x*=vector.x;this.y*=vector.y;return this;}
    
    /**
     * Multiplies vector by given scalar.
     * @param {Number} scalar Scalar to Multiply vector by.
     * @returns The vector.
     */
    Multiply(scalar){this.x*=scalar;this.y*=scalar;return this;}
    
    /**
     * Divides vector by given vector.
     * @param {vector} vector Vector to divide vector by.
     * @returns The vector.
     */
    DivideVector(vector){this.x/=vector.x;this.y/=vector.y;return this;}
    
    /**
     * Divides vector by given scalar.
     * @param {Number} scalar Scalar to divide vector by.
     * @returns The vector.
     */
    Divide(scalar){this.x/=scalar;this.y/=scalar;return this;}
    
    /**
     * Shorthand for writing `new Vector(0, 0)`.
     * @returns The vector.
     */
    Zero(){this.x=0;this.y=0;return this;}

    /**
     * Invert the values of a vector
     * @returns The vector.
     */
    Invert(){this.x=-this.x;this.y=-this.y;return this;}

    static Floor(vector){return vector.Floor();}
    static Clamp(vector, min, max){return vector.Clamp(min, max);}
    static ClampXY(vector, xMin, xMax, yMin, yMax){return vector.ClampXY(xMin, xMax, yMin, yMax);}
    static ClampWithVector(vector, clampX, clampY){return vector.ClampWithVector(clampX, clampY);}
    static AddVector(vector1, vector2){return vector1.AddVector(vector2);}
    static Add(vector, amount){return vector.add(amount);}
    static SubtractVector(vector1, vector2){return vector1.SubtractVector(vector2);}
    static Subtract(vector, amount){return vector.subtract(amount);}
    static MultiplyVector(vector1, vector2){return vector1.MultiplyVector(vector2);}
    static Multiply(vector, scalar){return vector.multiply(scalar);}
    static DivideVector(vector1, vector2){return vector1.DivideVector(vector2);}
    static Divide(vector, scalar){return vector.divide(scalar);}
    static Zero(){return new Vector(0, 0);}
    static Invert(vector){return vector.Invert();}
    static ToFixed(vector, digits){return vector.ToFixed(digits);}
}
