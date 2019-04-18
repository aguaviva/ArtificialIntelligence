class FullyConnected
{
    constructor(weights, bias)
    {
        this.name ="Fully";
        this.weights = weights
        this.bias = bias
    }

    forwardPass(input)
    {
        this.input = input;
        return AddMat(this.bias, MulMat(input, this.weights));
    }

    backPropagation(layerDerivative)
    {
        var t = TransposeMat(this.weights)
        return MulMat(layerDerivative, t);
    }
   
    computeDeltas(layerDerivative)
    {
        // for training
        this.weightDeltas = MulMat(TransposeMat(this.input), layerDerivative);
        this.biasDeltas   = layerDerivative;
    }

    train(LearningRate)
    {
        this.weights = SubMat( this.weights, MulKMat(LearningRate,this.weightDeltas));
        this.bias    = SubMat( this.bias,    MulKMat(LearningRate,this.biasDeltas));
    }

    numericalDerivarive(network, input)
    {
        var out = []
        for(var j=0;j<this.weights.length;j++)
        {
            var vA = []
            var vB = []
            for(var i=0;i<this.weights[0].length;i++)
            {
                this.weights[j][i] += .0001
                vA.push(ForwardPropagation(network, input)[0])
                this.weights[j][i] -= .0001
                vB.push(ForwardPropagation(network, input)[0])
            }
            var c = MulKMat(1.0/.0001,TransposeMat(SubMat(vA, vB)));

            out.push(c)
        }

        for(var j=0;j<this.bias.length;j++)
        {
            var vA = []
            var vB = []
            for(var i=0;i<this.bias[0].length;i++)
            {
                this.bias[j][i] += .0001
                vA.push(ForwardPropagation(network, input)[0])
                this.bias[j][i] -= .0001
                vB.push(ForwardPropagation(network, input)[0])
            }
            var c = MulKMat(1.0/.0001,TransposeMat(SubMat(vA, vB)));

            out.push(c)
        }

        return out;
    }
}
