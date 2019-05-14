class MaxPool2D
{
    constructor()
    {
        this.name ="MaxPool 2D";
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
                for(var y=0;y<input.length/2;y++)
                {
                    var row = [];
                    var rowRouting1 = [];
                    var rowRouting2 = [];
                    for(var x=0;x<input[0].length/2;x++)
                    {
                        var a = input[y*2  ][x*2];   var b = input[y*2  ][x*2+1];
                        var c = input[y*2+1][x*2];   var d = input[y*2+1][x*2+1];
                        
                        var res = Math.max(a,Math.max(b,Math.max(c,d)));
                        
                        row.push(res);
                                                           
                        rowRouting1.push( (a==res)?1:0 ); rowRouting1.push( (b==res)?1:0 );
                        rowRouting2.push( (c==res)?1:0 ); rowRouting2.push( (d==res)?1:0 );
                    }
                    
                    o.push(row);
                    
                    routing.push(rowRouting1);
                    routing.push(rowRouting2);
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

                var matout = this.routing[l][k];
                for(var y=0;y<matout.length;y++)
                {
                    fmout[l][k][y] = []
                    for(var x=0;x<matout[0].length;x++)
                    {
                        
                        var v = layerDerivative[l][k][Math.floor(y/2)][Math.floor(x/2)];
                    
                        fmout[l][k][y][x] = ((this.routing[l][k][y][x]==1)?v:0);
                    }
                }                        
            }
        }
        
        return fmout;                
    }

    train(LearningRate) {};

    
    computeDeltas(layerDerivative)
    {
        this.deltas = [];
    }
    
}
