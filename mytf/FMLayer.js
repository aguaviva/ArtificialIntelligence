
class FMLayer
{
    constructor(weights, bias, func)
    {
        this.weights = weights;
        this.bias = bias;        
        
        this.conv3D = []
        for(var k=0;k<this.weights.length;k++)
        {            
            this.conv3D[k] = func([this.weights[k]], bias[k]);
            this.bias[k] = this.conv3D[k].bias
            this.name ="FM:" + this.conv3D[k].name;
        }
    }    
    
    forwardPass(input)
    {
        var out = [];
        for(var k=0;k<this.conv3D.length;k++)
            out[k] = this.conv3D[k].forwardPass(input);
        
        return out;
    }
    
    backPropagation(layerDerivative)
    {   
        var out = [];
        
        for(var k=0;k<this.conv3D.length;k++)
            out[k] = this.conv3D[k].backPropagation([layerDerivative[k]]);

        return  out;
    }
    
    computeDeltas(layerDerivative)
    {
        this.weightDeltas = []
        this.biasDeltas = []

        for(var k=0;k<this.conv3D.length;k++)
        {
            this.conv3D[k].computeDeltas(layerDerivative[k])
            
            this.weightDeltas[k] = this.conv3D[k].weightDeltas
            this.biasDeltas[k] = this.conv3D[k].biasDeltas            
        }
    }
        
    train(LearningRate)
    {
        for(var k=0;k<this.conv3D.length;k++)
        {
            this.conv3D[k].train(LearningRate);
            this.bias[k] = this.conv3D[k].bias;
        }
    }        
        
    AddWeight(i,val)
    {
        var aaaa = this.weights[0][0][0].length;   
        var aaa = this.weights[0][0].length*aaaa;   
        var aa = this.weights[0].length*aaa;   
        var a = this.weights.length*aa;   
              
        var b = Math.floor(i/aa);
        var bb = i%aa;
        var c = Math.floor(bb/aaa);
        var cc = bb%aaa;
        var d = Math.floor(cc/aaaa);
        var dd = cc%aaaa;
        
        var t = this.weights.length*this.weights[0].length*this.weights[0][0].length*this.weights[0][0][0].length
        if (i<t)
            this.weights[b][c][d][dd]+=val
        else 
            this.conv3D[i-t].bias+=val;
    }
    
    numericalDerivarive(network, input)
    {
    
        var outA = []
        var outB = []
        for(var i=0;i<this.weights.length*this.weights[0].length*this.weights[0][0].length*this.weights[0][0][0].length+this.bias.length;i++)
        {
            this.AddWeight(i,.000001)
            outA.push(ForwardPropagation(network, (input)))
            this.AddWeight(i,-.000001)
            outB.push(ForwardPropagation(network, (input)))
        }
        var out = MulKMat(1.0/.000001,SubMat(outA, outB));
        
        return out;
    }
}
