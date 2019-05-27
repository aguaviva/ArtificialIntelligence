class CostCrossEntropyLayer
{
    constructor()
    {
        this.name ="Cross Entropy cost";        
    }

    setValue(idx)
    {
        this.idx = idx;
    }

    forwardPass(input)
    {
        this.input = input;
               
        var err = -Math.log(input[0][0][0][this.idx]);

        return [[[[err]]]];                
    }

    backPropagation()
    {
        var out = TensorZero(1, 1, 1, this.input[0][0][0].length); 
        
        out[0][0][0][this.idx] = -1.0 / this.input[0][0][0][this.idx];
        
        return out;
    }
}
