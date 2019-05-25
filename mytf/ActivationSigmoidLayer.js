function sigmoid(x) { return 1.0/(1.0+Math.exp(-x)); }
function SigmoidAct(x) { return sigmoid(x); }
function SigmoidDerAct(x) { return sigmoid(x)*(1-sigmoid(x)); }

class ActivationSigmoidLayer
{
    constructor(act)
    {
        this.weights = undefined;
        this.name ="ActivationSigmoidLayer";
    }

    forwardPass(input)
    {
        this.input = input;
          
        var output = TensorZero(input.length, input[0].length, input[0][0].length, input[0][0][0].length);        
        
        for(var w=0;w<input.length;w++)
        {        
            for(var z=0;z<input[0].length;z++)
            {        
                for(var y=0;y<input[0][0].length;y++)
                {
                    for(var x=0;x<input[0][0][0].length;x++)
                    {                        
                        output[w][z][y][x] = SigmoidAct(input[w][z][y][x]);
                    }
                }        
            }
        }        
        return output;                
    }

    backPropagation(layerDerivative)
    {        
        var output = TensorZero(layerDerivative.length, layerDerivative[0].length, layerDerivative[0][0].length, layerDerivative[0][0][0].length);        
        
        for(var w=0;w<layerDerivative.length;w++)
        {        
            for(var z=0;z<layerDerivative[0].length;z++)
            {        
                for(var y=0;y<layerDerivative[0][0].length;y++)
                {
                    for(var x=0;x<layerDerivative[0][0][0].length;x++)
                    {                        
                        output[w][z][y][x] = SigmoidDerAct(this.input[w][z][y][x]) * layerDerivative[w][z][y][x];
                    }
                }        
            }
        }        
        return output;                
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

