class CrossEntropyQuadraticCostLayer
{
    constructor()
    {
        this.name ="Cross Entropy cost";        
    }

    setValue(v)
    {
        this.value = v;
    }

    forwardPass(input)
    {
        this.input = input;
        
        var err = 0;
        var n=0
        for(var j=0;j<input.length;j++)
        {    
            for(var i=0;i<input[0].length;i++)
            {
                var _i = this.value[i][j]
                var _o = input[i][j]                 
                
                err -= _i*Math.log(_o) + (1-_i)*Math.log(1-_o);
                n++;
            }
        }    

        return [[err/n]];                
    }

    backPropagation()
    {
        var num = SubMat(this.input, this.value);
        
        var deno = 0;        
        for(var j=0;j<this.input.length;j++)
        {    
            for(var i=0;i<this.input[0].length;i++)
            {
                var _o = this.input[i][j] 
                deno += (1.0-_o)*_o
            }
        }
        
        return MulKMat(1.0/deno,num);
    }

    backpropInput(output)
    {
    }
}
