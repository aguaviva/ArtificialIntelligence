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
        this.input = [input];
        var out = [[ AddMat([this.bias], MulMat(input, this.weights[0][0])) ]];
        return out;
    }

    backPropagation(layerDerivative)
    {
        var t = TransposeMat(this.weights[0][0])
        return [[[MulMat(layerDerivative[0][0], t)]]];
    }
   
    computeDeltas(layerDerivative)
    {
        // for training
        this.weightDeltas = MulMat(TransposeMat(this.input), layerDerivative[0][0]);
        this.biasDeltas   = [layerDerivative[0][0]];
    }

    train(LearningRate)
    {
        this.weights = [[SubMat( this.weights[0][0], MulKMat(LearningRate,this.weightDeltas))]];
        this.bias    = SubMat( [this.bias],    MulKMat(LearningRate,this.biasDeltas))[0];
    }
}
