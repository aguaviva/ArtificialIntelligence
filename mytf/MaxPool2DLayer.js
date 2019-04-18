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
        
        for(var fm=0;fm<inputfms.length;fm++)
        {        
            var input = inputfms[fm];
        
            this.routing[fm] = [];
        
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
                
                this.routing[fm].push(rowRouting1);
                this.routing[fm].push(rowRouting2);
            }        
            fmout.push(o);
        }        
        return fmout;
    }

    backPropagation()    
    {              
        var fmout = [];
        for(var fm=0;fm<this.routing.length;fm++)
        {        
            var matout = this.routing[fm];
            
            var cols = []
            for(var y=0;y<matout.length;y++)
            {
                var raw = []
                for(var x=0;x<matout[0].length;x++)
                {
                    var v = this.layerDerivative[fm][Math.floor(y/2)][Math.floor(x/2)];
                
                    raw.push((this.routing[fm][y][x]==1)?v:0);
                }
                cols.push(raw)
            }                        
            fmout.push(cols);
        }
        
        return fmout;                
    }

    train(LearningRate) {};

    backpropInput(output)
    {
        this.layerDerivative  =  output;

        this.deltas = [];
    }

    numericalDerivarive(network, input)
    {
        return [];
    }
}
