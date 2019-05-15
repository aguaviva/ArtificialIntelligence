function ReverseKernel2D(kernel)
{
    var m = [];
    for(var j=0;j<kernel.length;j++)
        m[j] = ReverseKernel1D(kernel[kernel.length-1 - j]);
    return m;
}

function Add2DPaddingMat(input, padding)
{
    var b = [];
              
    for(var i=0;i<input.length;i++)
    {
        var l = input[i].slice(0);
        for(var j=0;j<padding;j++)
            l.unshift(0);
        for(var j=0;j<padding;j++)
            l.push(0);
        b[i+padding] = l;
    }
    
    for(var j=0;j<padding;j++)
        b[j] = Array(b[padding].length).fill(0);    
    for(var j=0;j<padding;j++)
        b[input.length+padding+j] = Array(b[padding].length).fill(0);
        
    return b;
}

function Conv2DMatrixForward(nonPaddedInput, weights, bias, padding)
{
    var input = Add2DPaddingMat(nonPaddedInput, padding)

    var out = []

    for(var y=0;y<input[0].length - weights[0].length + 1; y++)
    {
        out[y]=[]
        for(var x=0;x<input.length - weights.length + 1; x++)
        {        
            var o = bias;
            for(var j=0;j<weights.length;j++)
            {
                for(var i=0;i<weights[0].length;i++)
                {
                    o += input[y+j][x+i] * weights[j][i];
                }
            }
            
            out[y][x] = o;
        }
    }
        
    return out;
}

function Conv2DTensorForward(input, weights, bias, padding)
{
    assert(input.length == weights[0].length);

    var out = []   
    for(var j=0;j<weights.length;j++)
    {
        out[j] = []
        for(var i=0;i<input[0].length;i++)
        {            
            var o = Conv2DMatrixForward(input[0][i], weights[j][0], bias[j], padding)   
            for(var k=1;k<input.length;k++)
            {
                o = AddMat(o , Conv2DMatrixForward(input[k][i], weights[j][k], 0, padding))   
            }
            
            out[j][i] = o
        }
    }

    return out;
}

function computePartialDeltas(layerDerivative, input, padding)
{
    var zeroBias = GetZeroedVector(input.length)
    var out = Conv2DTensorForward([[input]], [[layerDerivative]], zeroBias, padding)[0][0];
    
    var w = 0;
    for(var j=0;j<layerDerivative.length;j++)
        for(var i=0;i<layerDerivative[0].length;i++)    
            w += layerDerivative[j][i];

    return [out, w]
}

class Conv2DLayer
{
    constructor(weights, bias)
    {
        this.weights = weights;
        this.bias = bias;
        this.padding = (weights[0][0].length-1)/2;
        this.name ="Conv2D";
    }

    forwardPass(input)
    {
        this.input = input;
        return Conv2DTensorForward(this.input, this.weights, this.bias, this.padding);
    }

    backPropagation(layerDerivative)
    {        
        var revKernel = []
        for(var z=0;z<this.weights[0].length;z++)
        {
            revKernel[z] = []
            for(var w=0;w<this.weights.length;w++)
            {
                revKernel[z][w] = ReverseKernel2D(this.weights[w][z])
            }
        }
        
        var zeroBias = GetZeroedVector(revKernel.length)
        
        return Conv2DTensorForward(layerDerivative, revKernel, zeroBias, this.padding)
    }   
    
    computeDeltas(layerDerivative)
    {       
        console.log("computeDeltas")
    
        this.biasDeltas = []
        this.weightDeltas = []

        for(var l=0;l<layerDerivative.length;l++)
            this.biasDeltas[l] = 0

        for(var l=0;l<layerDerivative.length;l++)
        {       
            this.weightDeltas[l] = []
    
            var bb = 0;
    
            for(var k=0;k<this.input.length;k++)
            {               
                var o = computePartialDeltas(layerDerivative[l][0], this.input[k][0], this.padding);
                var ww = o[0];
                bb = o[1]
                for(var i=1;i<this.input[0].length;i++)
                {
                    o = computePartialDeltas(layerDerivative[l][i], this.input[k][i], this.padding);
                    ww = AddMat(ww, o[0]);                    
                    bb += o[1];
                }
                console.log(l,k,bb*0.000001)
                this.weightDeltas[l][k] = ww;
            }
            
            this.biasDeltas[l] += bb;
        }
        
    }
        
    train(LearningRate)
    {
        console.log("train")
        for(var w=0;w<this.weights.length;w++)
        {
            for(var z=0;z<this.weights[0].length;z++)
                this.weights[w][z] = SubMat( this.weights[w][z], (MulKMat(LearningRate,this.weightDeltas[w][z])));
            
            console.log(this.bias[w] - LearningRate * this.biasDeltas[w], this.bias[w], -LearningRate*this.biasDeltas[w] )
            this.bias[w]    = this.bias[w] - LearningRate * this.biasDeltas[w];
            
        }
        
    }        
        
}


function NewConv2DLayer(weights, bias)
{
    return new Conv2DLayer(weights, bias);
}