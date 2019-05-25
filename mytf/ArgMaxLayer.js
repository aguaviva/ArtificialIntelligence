class ArgMaxLayer
{
    constructor()
    {
        this.name ="ArgMaxLayer";
    }

    forwardPass(input)
    {
        assert(input.length == 1);
        assert(input[0].length == 1);
        assert(input[0][0].length == 1);
        assert(input[0][0][0].length > 0 );
       
        this.input = input[0][0][0];

        this.s = []
        var total = 0;
        for(var x=0;x<input[0][0][0].length;x++)
        {
            var v = Math.exp(input[0][0][0][x]);
            this.s[x] = v;
            total += v;
        }

        for(var x=0;x<input[0][0][0].length;x++)
        {
            this.s[x] /= total;
        }
            
        return [[[this.s]]];   
    }

    backPropagation(layerDerivative)
    {        
        var J = MatZero(layerDerivative[0][0][0].length, layerDerivative[0][0][0].length);        
        
        for(var y=0;y<layerDerivative[0][0][0].length;y++)
        {
            for(var x=0;x<layerDerivative[0][0][0].length;x++)
            {                                                
                J[y][x] = (x==y)?(this.s[x] * (1-this.s[y])) : -(this.s[x] * this.s[y]);
            }
        }        
        
        return [[MulMat(layerDerivative[0][0], J)]];
    }
}
