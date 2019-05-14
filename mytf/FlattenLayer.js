function GetMatrix(ll, kk,jj,ii )
{
    var out = []
    for(var l=0;l<ll;l++)
    {           
        out[l]=[] 
        for(var k=0;k<kk;k++)
        {
            out[l][k]=[] 
            for(var j=0;j<jj;j++)        
            {
                out[l][k][j]=[] 
            }
        }        
    }
    return out;
}

class Flatten
{
    constructor(dimIni)
    {    
        this.dimIni = dimIni;
        this.name ="Flatten";
    }

    forwardPass(input)
    {        
        var row = []
   
        this.input = input
   
        for(var z=0;z<input[0].length;z++)
        {            
            for(var y=0;y<input[0][0].length;y++)
            {
                for(var x=0;x<input[0][0][0].length;x++)        
                {
                    for(var f=0;f<input.length;f++)
                    {            
                        row.push(input[f][z][y][x]);
                    }
                }
            }        
        }
        
        return [[[row]]];
    }

    backPropagation(layerDerivative)
    {                       
        var input = layerDerivative[0][0][0];

        var i=0;

        var fm = GetMatrix(this.input.length, this.input[0].length,this.input[0][0].length,this.input[0][0][0].length);
        
        for(var z=0;z<this.input[0].length;z++)
        {
            for(var y=0;y<this.input[0][0].length;y++)
            {
                for(var x=0;x<this.input[0][0][0].length;x++)    
                {
                    for(var f=0;f<this.input.length;f++)
                    {   
                        fm[f][z][y][x] = input[i++];
                    }
                }
            }        
        }
       
        return fm;
    }

    backpropInput(output, net)
    {                
        return output;
    }

    computeDeltas(layerDerivative)
    {
        this.deltas = [];
    }

    train(LearningRate) {};    
}
