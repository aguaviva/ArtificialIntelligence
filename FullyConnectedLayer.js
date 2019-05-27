class FullyConnectedLayer
{
    constructor(weights, bias)
    {
        this.name ="FullyConnectedLayer";
        this.weights = weights
        this.bias = bias
    }

    forwardPass(input)
    {
        this.input = input;
        var out = [[ AddMat([this.bias], MulMat(input[0][0], this.weights[0][0])) ]];
        return out;
    }

    backPropagation(layerDerivative)
    {
        var t = TransposeMat(this.weights[0][0])
        return [[MulMat(layerDerivative[0][0], t)]];
    }
   
    computeDeltas(layerDerivative)
    {
        // for training
        this.weightDeltas = [[MulMat(TransposeMat(this.input[0][0]), layerDerivative[0][0])]];
        this.biasDeltas   = layerDerivative[0][0];
    }

    train(LearningRate)
    {
        this.weights = [[SubMat( this.weights[0][0], MulKMat(LearningRate,this.weightDeltas[0][0]))]];
        this.bias    = SubMat( [this.bias],    MulKMat(LearningRate,this.biasDeltas))[0];
    }
}
