class AveragePool1D
{
    constructor()
    {
        this.name ="AveragePool 1D";
    }

    forwardPass(inputfms)
    {               
        var fmout = []        
        for(var l=0;l<inputfms.length;l++)
        {        
            fmout[l] = [] 
            for(var k=0;k<inputfms[0].length;k++)
            {        
                var input = inputfms[l][k];
            
                fmout[l][k] = [] 
                for(var y=0;y<input.length;y++)
                {
                    fmout[l][k][y] = [] 
                    for(var x=0;x<input[0].length/2;x++)
                    {
                        var a = input[y][x*2];   var b = input[y][x*2+1];
                        
                        fmout[l][k][y][x] = (a+b)/2.0;     
                    }
                }        
            }
        }        
        return fmout;
    }

    backPropagation(layerDerivative)    
    {              
        var fmout = [];
        for(var l=0;l<layerDerivative.length;l++)
        {        
            fmout[l] = []
            for(var k=0;k<layerDerivative[0].length;k++)
            {        
                fmout[l][k] = []
                
                for(var y=0;y<layerDerivative[0][0].length;y++)
                {
                    fmout[l][k][y] = []
                    for(var x=0;x<layerDerivative[0][0][0].length*2;x++)
                    {                        
                        var v = layerDerivative[l][k][y][Math.floor(x/2)];
                    
                        fmout[l][k][y][x] = v / 2.0;
                    }
                }                        
            }
        }

        return  fmout;       
    }
   
}
