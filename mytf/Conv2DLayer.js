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

function Conv2DInputForward(nonPaddedInput, weights, bias, padding)
{
    var input = Add2DPaddingMat(nonPaddedInput, padding)

    out = []

    for(var y=0;y<input.length - weights.length + 1; y++)
    {
        out[y]=[]
        for(var x=0;x<input[0].length - weights.length + 1; x++)
        {        
            var o = bias;
            for(var j=0;j<weights.length;j++)
            {
                for(var i=0;i<weights[0].length;i++)
                {
                    o += input[y+j][x+i] * weights[j][i];
                }
            }
            
            out[y].push(o);
        }
    }
    
    return out;
}

class Conv2DLayer
{
    constructor(weights, bias)
    {
        this.weights = weights[0][0];
        this.bias = bias;
        this.padding = 1;
        this.name ="Conv2D";
    }

    forwardPass(input)
    {
        this.input = input;
        return Conv2DInputForward(input, this.weights, this.bias, this.padding)   
    }

    backPropagation(layerDerivative)
    {        
        var revKernel = ReverseKernel2D(this.weights)
        return Conv2DInputForward(layerDerivative, revKernel, 0, this.padding)
    }   
    
    computeDeltas(layerDerivative)
    {
        var ld = [];
        
        for(var y=0;y<layerDerivative.length;y++)
        {
            for(var x=0;x<layerDerivative[0].length;x++)    
            {
                ld[x+y*layerDerivative.length] = [layerDerivative[y][x]];
            }
        }       

        var deltas = []
        for(var i=0;i<this.weights.length*this.weights.length+1;i++)
        {
            deltas[i]=[]
        }

        var input = Add2DPaddingMat(this.input, this.padding)

        var xx = input.length-this.weights.length+ 1;
        var yy = input.length-this.weights.length+ 1;
        for(var y=0;y<yy;y++)
        {
            for(var x=0;x<xx;x++)    
            {
                for(var j=0;j<this.weights.length;j++)
                {
                    for(var i=0;i<this.weights.length;i++)    
                    {
                        deltas[i + j * this.weights.length][x + y * xx] = input[y+j][x+i];
                    }
                }
                deltas[this.weights.length*this.weights.length].push(1);
            }
        }
        
        var deltas = MulMat(deltas,ld);
        this.weightDeltas = ConvertMat(deltas.slice(0, 3*3), 3,3);
        this.biasDeltas   = deltas[deltas.length-1][0]
    }
        
    train(LearningRate)
    {
        this.weights = SubMat( this.weights, (MulKMat(LearningRate,this.weightDeltas)));
        this.bias    = this.bias - LearningRate * this.biasDeltas;
    }        
        
    AddWeight(i,val)
    {
        if (i<this.weights.length*this.weights.length)
            this.weights[Math.floor(i/3)][i%3]+=val
        else
            this.bias+=val
    }

    numericalDerivarive(network, input)
    {
        var outA = []
        var outB = []
        for(var i=0;i<3*3+1;i++)
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


function NewConv2DLayer(weights, bias)
{
    return new Conv2DLayer(weights, bias);
}