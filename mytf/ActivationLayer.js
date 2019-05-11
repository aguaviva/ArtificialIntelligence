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
          
        var outFM = []
        
        for(var fm=0;fm<this.input.length;fm++)
        {
            var out = []
            for(var i=0;i<this.input[0].length;i++)
            {
                out[i] = funcMat(this.act.Act, input[fm][i]);
            }
            
            outFM[fm] = out;
        }
        return outFM;
    }

    backPropagation(layerDerivative)
    {        
        var outFM = []

        for(var fm=0;fm<this.input.length;fm++)
        {
            var out = []

            for(var i=0;i<this.input[0].length;i++)
            {
                out[i] = SimpleMulMat(funcMat(this.act.DerAct, this.input[fm][i]), layerDerivative[fm][i]);
            }

            outFM[fm] = out;
        }
        return outFM;
    }
    
    computeDeltas(layerDerivative)
    {
    }
        
    train(LearningRate)
    {
    }        

}


function NewActivationLayer(act)
{
    return new ActivationLayer(act);
}

