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
                this.diff[l][k] = SubMat(input[l][k], this.value[l][k]);

                for(var j=0;j<this.diff[l][k].length;j++)
                {    
                    for(var i=0;i<this.diff[l][k][0].length;i++)
                    {
                        err += this.diff[l][k][i][j] * this.diff[l][k][i][j];
                    }
                }    
            }        
        }        
        
        return [[err]];        
    }

    backPropagation()
    {
        var out = []
        for(var l=0;l<this.diff.length;l++)
        {
            out[l] = []
            
            for(var k=0;k<this.diff[0].length;k++)
            {            
                out[l][k] = MulKMat(2,this.diff[l][k]);
            }
        }
        return out;
    }

    backpropInput(output)
    {
    }
}

