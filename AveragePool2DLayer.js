class AveragePool2D
{
    constructor()
    {
        this.name ="AveragePool 2D";
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
            
                var o = []                    
                for(var y=0;y<input.length/2;y++)
                {
                    var row = [];
                    for(var x=0;x<input[0].length/2;x++)
                    {
                        var a = input[y*2  ][x*2];   var b = input[y*2  ][x*2+1];
                        var c = input[y*2+1][x*2];   var d = input[y*2+1][x*2+1];
                        
                        var res = (a+b+c+d) / 4.0;
                        
                        row.push(res);                                                           
                    }
                    
                    o.push(row);                    
                }        
                fmout[l][k] = o;
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
                
                for(var y=0;y<layerDerivative[0][0].length*2;y++)
                {
                    fmout[l][k][y] = []
                    for(var x=0;x<layerDerivative[0][0][0].length*2;x++)
                    {                        
                        var v = layerDerivative[l][k][Math.floor(y/2)][Math.floor(x/2)];
                    
                        fmout[l][k][y][x] = v / 4.0;
                    }
                }                        
            }
        }

        return  fmout;       
    }
   
}
