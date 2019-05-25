class ActivationReluLayer
{
    constructor()
    {
        this.name ="ActivationReluLayer";
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
                        var v = input[w][z][y][x];
                        output[w][z][y][x] = v>0?v:0;
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
                        var v = this.input[w][z][y][x];
                        output[w][z][y][x] = (v>0?1:0) * layerDerivative[w][z][y][x];
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
