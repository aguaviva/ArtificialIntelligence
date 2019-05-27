class CostQuadraticLayer
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
        assert(input.length == this.value.length);
        assert(input[0].length == this.value[0].length);
        assert(input[0][0].length == this.value[0][0].length);
        assert(input[0][0][0].length == this.value[0][0][0].length);
        
        var err = 0;
        
        this.diff = TensorZero(input.length, input[0].length, input[0][0].length, input[0][0][0].length);        
       
        for(var l=0;l<input.length;l++)
        {            
            for(var k=0;k<input[0].length;k++)
            {
                for(var j=0;j<input[0][0].length;j++)
                {
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
        var out = TensorZero(this.diff.length, this.diff[0].length, this.diff[0][0].length, this.diff[0][0][0].length);        
        for(var l=0;l<this.diff.length;l++)
        {
            for(var k=0;k<this.diff[0].length;k++)
            {
                for(var j=0;j<this.diff[0][0].length;j++)
                {
                    for(var i=0;i<this.diff[0][0][0].length;i++)                   
                    {    
                        out[l][k][j][i] = 2 * this.diff[l][k][j][i] 
                    }
                }    
            }        
        }        

        return out;
    }
}

