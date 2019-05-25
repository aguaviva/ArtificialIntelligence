class RegDropoutLayer
{
    constructor(dropoutRate)
    {
        this.dropoutRate = dropoutRate;
        this.name ="Reg Dropout";
    }

    forwardPass(input)
    {               
        var fmout    = TensorZero(input.length, input[0].length, input[0][0].length, input[0][0][0].length);        
        
        var scaling = 1.0 / (1.0 - this.dropoutRate);
        
        for(var l=0;l<input.length;l++)
        {        
            for(var k=0;k<input[0].length;k++)
            {        
                for(var y=0;y<input[0][0].length;y++)
                {
                    for(var x=0;x<input[0][0][0].length;x++)
                    {
                        fmout[l][k][y][x] = (Math.random() < 0) ? 0 : (input[l][k][y][x] * scaling);
                    }
                }        
            }
        }        
        return fmout;
    }

    backPropagation(layerDerivative)    
    {                      
        return layerDerivative;                
    }
}
