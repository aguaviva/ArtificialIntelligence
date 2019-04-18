class ActivationLayer
{
    constructor(act)
    {
        this.act = act
        this.weights = undefined;
        this.name ="ActivationLayer";
    }

    forwardPass(input)
    {
        this.input = input;
        
        this.dim = GetDimensions(input)
  
        if (this.dim.length==3)
        {        
            var out = []
            
            for(var i=0;i<this.input.length;i++)
            {
                out[i] = funcMat(this.act.Act, input[i]);
            }
            
            return out;
        }
        else
        {
            return funcMat(this.act.Act, input);
        }
    }

    backPropagation(layerDerivative)
    {        
        if (this.dim.length==3)
        {        
            var out = []

            for(var i=0;i<this.input.length;i++)
            {
                out[i] = SimpleMulMat(funcMat(this.act.DerAct, this.input[i]), layerDerivative[i]);
            }

            return out;
        }
        else
        {
            return SimpleMulMat(funcMat(this.act.DerAct, this.input), layerDerivative);
        }
    }
    
    computeDeltas(layerDerivative)
    {
    }
        
    train(LearningRate)
    {
    }        
        
    AddWeight(i,val)
    {
    }

    numericalDerivarive(network, input)
    {
        return;
    }
}


function NewActivationLayer(act)
{
    return new ActivationLayer(act);
}

