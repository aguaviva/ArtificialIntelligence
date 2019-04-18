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
        
        this.diff = SubMat(input, this.value);
        
        var diff = this.diff;
        
        for(var j=0;j<diff[0].length;j++)
        {    
            for(var i=0;i<diff.length;i++)
            {
                err += diff[i][j] * diff[i][j];
            }
        }    
        
        return [[err]];        
    }

    backPropagation()
    {
        return MulKMat(2,this.diff)
    }

    backpropInput(output)
    {
    }
}

class QuadraticCostLayerFM
{
    constructor(fm)
    {
        this.fm = fm
        this.name ="Quadratic cost FM";
        this.layer = []
        for(var i=0;i<this.fm;i++)
            this.layer[i] = new QuadraticCostLayer()
    }

    setValue(v)
    {
        for(var i=0;i<this.fm;i++)
            this.layer[i].setValue(v[i])
    }

    forwardPass(input)
    {
        var err = 0;

        this.input = input;

        for(var i=0;i<this.fm;i++)
            err += this.layer[i].forwardPass(input[i])[0][0]
        
        return [[err]];        
    }

    backPropagation()
    {
        var out = [];
        
        for(var i=0;i<this.fm;i++)
            out[i] = this.layer[i].backPropagation()
        
        return out;
    }

    backpropInput(output)
    {
    }
}