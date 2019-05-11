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
    input = Add2DPaddingMat(nonPaddedInput, padding)

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
    var out = []

    assert(input.length == weights[0].length);
    
    for(var j=0;j<weights.length;j++)
    {
        out[j] = []
        for(var i=0;i<input[0].length;i++)
        {
            
            var o = Conv2DMatrixForward(input[0][i], weights[j][0], bias[0], padding)   
            for(var k=1;k<input.length;k++)
            {
                o = AddMat(o , Conv2DMatrixForward(input[k][i], weights[j][k], bias[j], padding))   
            }
            
            out[j][i] = o
        }
    }

    return out;
}

class Conv2DLayer
{
    constructor(weights, bias)
    {
        this.weights = weights;
        this.bias = bias;
        this.padding = 1;
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
        
        var zeroBias = GetZeroedVector(this.bias.length)
        
        return Conv2DTensorForward(layerDerivative, revKernel, zeroBias, this.padding)
    }   
    
    computeDeltas(layerDerivative)
    {       
        this.biasDeltas = []
        this.weightDeltas = []

        for(var l=0;l<layerDerivative.length;l++)
        {       
            this.weightDeltas[l] = []

            var ld = [];
    
            for(var k=0;k<layerDerivative[0].length;k++)
            {
                for(var j=0;j<layerDerivative[0][0].length;j++)
                {
                    for(var i=0;i<layerDerivative[0][0][0].length;i++)    
                    {
                        ld[i + j*layerDerivative[0][0][0].length] = [layerDerivative[l][k][j][i]];
                    }
                }       
            }                       
            
            
            var k=0;

            var input = Add2DPaddingMat(this.input[l][k], this.padding)
            
            var xx = input[0].length-this.weights[0][0][0].length + 1;
            var yy = input.length-this.weights[0][0].length + 1;

            var deltas = []    
            for(var j=0;j<this.weights[0][0].length;j++)
            {                    
                for(var i=0;i<this.weights[0][0][0].length;i++)    
                {
                    var row = []
                    for(var y=0;y<yy;y++)
                    {
                        for(var x=0;x<xx;x++)    
                        {
                            row.push(input[y+j][x+i]);
                        }
                    }
                    deltas[i + j * this.weights[0][0].length ] = row;
                }
            }

            
            var row = []
            for(var i=0;i<ld.length;i++)                                    
                row.push(1);
            deltas[deltas.length] = row
        
            var deltas = MulMat(deltas,ld);
        
            for(var k=0;k<this.input[l].length;k++)
                this.weightDeltas[l][k] = ConvertMat(deltas.slice(0, 3*3), 3,3);

            
            this.biasDeltas[l]   = deltas[deltas.length-1][0]
        }
        
    }
        
    train(LearningRate)
    {
        for(var w=0;w<this.weights.length;w++)
        {
            for(var z=0;z<this.weights[0].length;z++)
                this.weights[w][z] = SubMat( this.weights[w][z], (MulKMat(LearningRate,this.weightDeltas[w][z])));
            this.bias[w]    = this.bias[w] - LearningRate * this.biasDeltas[w];
        }
    }        
        
}


function NewConv2DLayer(weights, bias)
{
    return new Conv2DLayer(weights, bias);
}