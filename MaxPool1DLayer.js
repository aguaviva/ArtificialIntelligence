class MaxPool1D
{
    constructor()
    {
        this.name ="MaxPool 1D";
    }

    forwardPass(inputfms)
    {               
        this.routing = [];        
        var fmout = []        
        for(var l=0;l<inputfms.length;l++)
        {        
            fmout[l] = [] 
            this.routing[l] = []        
            for(var k=0;k<inputfms[0].length;k++)
            {        
                this.routing[l][k] = []
                var input = inputfms[l][k];
                var routing = this.routing[l][k];
            
                var o = []                    
                for(var y=0;y<input.length;y++)
                {
                    var row = [];
                    var rowRouting1 = [];
                    for(var x=0;x<input[0].length/2;x++)
                    {
                        var a = input[y][x*2];   var b = input[y][x*2+1];
                        
                        var res = Math.max(a,b);
                        
                        row.push(res);
                                                           
                        rowRouting1.push( (a==res)?1:0 ); rowRouting1.push( (b==res)?1:0 );
                    }
                    
                    o.push(row);
                    
                    routing.push(rowRouting1);
                }        
                fmout[l][k] = o;
                this.routing[l][k] = routing;
            }
        }        
        return fmout;
    }

    backPropagation(layerDerivative)    
    {              
        var fmout = [];
        for(var l=0;l<this.routing.length;l++)
        {        
            fmout[l] = []
            for(var k=0;k<this.routing[0].length;k++)
            {        
                fmout[l][k] = []
                
                for(var y=0;y<this.routing[0][0].length;y++)
                {
                    fmout[l][k][y] = []
                    for(var x=0;x<this.routing[0][0][0].length;x++)
                    {                        
                        var v = layerDerivative[l][k][y][Math.floor(x/2)];
                    
                        fmout[l][k][y][x] = ((this.routing[l][k][y][x]>0)?v:0);
                    }
                }                        
            }
        }
        
        return fmout;                
    }
}
