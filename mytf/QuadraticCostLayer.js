class QuadraticCostLayer
{
    constructor()
    {
        this.name ="Quadratic cost";
    }

    setValue(v)
    {
        this.value = v;
    }

    forwardPass(input)
    {        
        var err = 0;
       
        this.diff = []
        for(var l=0;l<input.length;l++)
        {
            this.diff[l] = []
            
            for(var k=0;k<input[0].length;k++)
            {
                this.diff[l][k] = []
                for(var j=0;j<input[0][0].length;j++)
                {
                    this.diff[l][k][j] = []
                    for(var i=0;i<input[0][0][0].length;i++)                   
                    {    
                        var diff = input[l][k][j][i] - this.value[l][k][j][i];
                        this.diff[l][k][j][i] = diff
                        err += diff*diff;
                    }
                }    
            }        
        }        
        
        return [[[[err]]]];        
    }

    backPropagation()
    {
        var out = []
        for(var l=0;l<this.diff.length;l++)
        {
            out[l] = []
            
            for(var k=0;k<this.diff[0].length;k++)
            {
                out[l][k] = []
                for(var j=0;j<this.diff[0][0].length;j++)
                {
                    out[l][k][j] = []
                    for(var i=0;i<this.diff[0][0][0].length;i++)                   
                    {    
                        out[l][k][j][i] = 2 * this.diff[l][k][j][i] 
                    }
                }    
            }        
        }        

        return out;
    }

    backpropInput(output)
    {
    }
}

