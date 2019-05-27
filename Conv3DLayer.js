function ReverseKernel3D(kernel)
{
    var m = [];
    for(var j=0;j<kernel.length;j++)
        m[j] = ReverseKernel2D(kernel[kernel.length-1 - j]);
    return m;
}

/*
function Conv3DInputForward(nonPaddedInput, weights, bias, padding)
{
    var out2=[];
    
    for(var k=0;k<nonPaddedInput.length;k++)
    {
        var out = []

        out = Conv2DInputForward(nonPaddedInput[0+k], weights[0], bias, padding)
        for(var j=1;j<weights.length;j++)
                out = AddMat(out, Conv2DInputForward(nonPaddedInput[j+k], weights[j], 0, padding))
            
        out2.push(out)
    }
    return out2;
}
*/

function Conv3DInputForward(nonPaddedInput, weights, bias, padding)
{
    var input = [ RectangularMat(5, 5), Add2DPaddingMat(nonPaddedInput[0], padding), RectangularMat(5, 5)]

    out = []

    for(var z=0;z<input.length - weights.length + 1; z++)
    {
        out[z]=[]
        for(var y=0;y<input[0].length - weights[0].length + 1; y++)
        {
            out[z][y]=[]
            for(var x=0;x<input[0][0].length - weights[0][0].length + 1; x++)
            {        
                var o=0;
                
                for(var k=0;k<weights.length;k++)
                {
                    for(var j=0;j<weights[0].length;j++)
                    {
                        for(var i=0;i<weights[0][0].length;i++)
                        {
                            o += input[z+k][y+j][x+i] * weights[k][j][i];
                        }
                    }
                }                
                out[z][y][x] = o;
            }
        }
    }    
    
    return out;
}

class Conv3DLayer
{
    constructor(weights, bias)
    {
        this.weights = weights[0];
        this.kernelDim = weights[0][0].length
        this.bias = bias;
        this.padding = (this.weights[0].length-1)/2;
        this.name ="Conv3D";
    }
    
    forwardPass(input)
    {
        this.input = input;
        this.depth = this.weights.length;
        
        return Conv3DInputForward(input, this.weights, this.bias, this.padding)
    }
    
    backPropagation(layerDerivative)
    {   
        var revKernel = ReverseKernel3D(this.weights)
        return Conv3DInputForward(layerDerivative, revKernel, this.bias, this.padding)
    }
    
    
    computeDeltas(layerDerivative)
    {
        var ld = [];
        
        for(var y=0;y<layerDerivative.length;y++)
        {
            for(var x=0;x<layerDerivative[0].length;x++)    
            {
                ld[x+y*layerDerivative[0].length] = [layerDerivative[y][x]];
            }
        }
 
        var weights = this.weights[0];
 
        var deltas = []
        for(var i=0;i<this.depth*weights.length*weights[0].length+1;i++)
        {
            deltas[i]=[]
        }
        
        var input = [];
        for(var k=0;k<this.depth;k++)
        {
            input[k] = Add2DPaddingMat(this.input[k], this.padding)
        }        
        
        var yy = 1 + input[0].length - weights.length;
        var xx = 1 + input[0][0].length - weights[0].length;
        for(var y=0;y<yy;y++)
        {
            for(var x=0;x<xx;x++)
            {
                for(var k=0;k<this.depth;k++)
                {                                       
                    for(var j=0;j<weights.length;j++)
                    {
                        for(var i=0;i<weights[0].length;i++)    
                        {
                            deltas[i + j * weights[0].length + k* weights[0].length*weights.length][x + y * xx] = input[k][y+j][x+i];
                        }
                    }
                }
                deltas[this.depth*weights.length*weights[0].length].push(1);
            }
        }
        
        var deltas = MulMat(deltas,ld);
        this.weightDeltas = []
        for(var k=0;k<this.depth;k++)
            this.weightDeltas[k] = ConvertMat(deltas.slice(k*this.kernelDim*this.kernelDim, (k+1)*this.kernelDim*this.kernelDim), this.kernelDim,this.kernelDim);
        this.biasDeltas   = deltas[deltas.length-1][0]
    }    
        
    train(LearningRate)
    {
        for(var k=0;k<this.depth;k++)
            this.weights[k] = SubMat( this.weights[k], MulKMat(LearningRate,this.weightDeltas[k]));
        this.bias    = this.bias - LearningRate * this.biasDeltas;
    }        
        
    AddWeight(i,val)
    {
        if (i<this.weights.length*this.weights[0].length*this.weights[1].length)
            this.weights[Math.floor(i/9)][Math.floor((i%9)/3)][(i%9)%3]+=val
        else
            this.bias+=val
    }
    numericalDerivarive(network, input)
    {
        var outA = []
        var outB = []
        for(var i=0;i<this.weights.length*this.weights[0].length*this.weights[1].length+1;i++)
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

//----------------------------------------------------------------

class Conv3DFM
{
    constructor(weights, bias)
    {
        this.weights = weights;
        this.kernelDim = weights[0][0][0].length
        this.bias = bias;
        this.padding = (this.weights[0][0].length-1)/2;
        this.name ="Conv3DFM";
    }
    
    forwardPass(input)
    {
        this.input = input;
        this.depth = this.weights[0].length;
        
        var out = []
        var net = []
        
        for(var fm=0;fm<this.weights.length;fm++)
        {        
            out[fm] = Conv3DInputForward(input, this.weights[fm], this.bias[fm], this.padding)
        }        
        return out;
    }
    
    backPropagation(layerDerivative)
    {   
        var out = []
        var revKernel = ReverseKernel3D(this.weights)            
        for(var fm=0;fm<this.weights.length;fm++)
        {                    
            out[fm] = Conv3DInputForward(layerDerivative, revKernel[fm], this.bias[fm], this.padding);
        }
        return out;
    }
    
    computeDeltas(layerDerivative)
    {
        this.weightDeltas = []
        this.biasDeltas = []
       
        var ld = [];
        for(var z=0;z<layerDerivative.length;z++)
        {
            for(var y=0;y<layerDerivative[0].length;y++)
            {
                for(var x=0;x<layerDerivative[0][0].length;x++)    
                {
                    ld[x+y*layerDerivative[0][0].length + z*layerDerivative[0][0].length * layerDerivative[0].length] = [layerDerivative[z][y][x]];
                }
            }
        }
               
        var deltas = []
        for(var i=0;i<this.weights.length*this.weights[0].length*this.weights[0][0].length*this.weights[0][0][0].length+1;i++)
        {
            deltas[i]=[]
        }
        
        var input = [];
        for(var k=0;k<this.weights.length;k++)
        {
            input[k] = Add2DPaddingMat(this.input[k], this.padding)
        }        
        
        var yy = 1 + input[0].length    - this.weights[0][0].length;
        var xx = 1 + input[0][0].length - this.weights[0][0][0].length;
        for(var z=0;z<input.length;z++)
        {
            for(var y=0;y<yy;y++)
            {
                for(var x=0;x<xx;x++)
                {
                    for(var fm=0;fm<this.weights.length;fm++)
                    {                                       
                        for(var k=0;k<this.weights[0].length;k++)
                        {                                       
                            for(var j=0;j<this.weights[0][0].length;j++)
                            {
                                for(var i=0;i<this.weights[0][0][0].length;i++)    
                                {
                                    deltas[i + j * this.weights[0][0][0].length + k* this.weights[0][0][0].length*this.weights[0][0].length + fm*this.weights[0][0][0].length*this.weights[0][0].length*this.weights[0].length][x + y * xx + z*xx*yy] = input[k][y+j][x+i];
                                }
                            }
                        }
                    }
                    deltas[this.weights.length*this.weights[0].length*this.weights[0][0].length*this.weights[0][0][0].length].push(1);
                }
            }
        }        
        
        var deltas2 = MulMat(deltas,ld);
        
        for(var fm=0;fm<this.weights.length;fm++)
        {                                       
            this.weightDeltas[fm] = []
            for(var k=0;k<this.weights[0].length;k++)
            {                
                var a = (k + fm* this.weights[0].length);
                var b = a+1;//((fm+1) + k * this.weights.length);
                this.weightDeltas[fm][k] = ConvertMat(deltas2.slice(a*this.kernelDim*this.kernelDim, b*this.kernelDim*this.kernelDim), this.kernelDim,this.kernelDim);
            }
        }        
        
        for(var fm=0;fm<this.weights.length;fm++)
            this.biasDeltas[fm]   = deltas2[deltas2.length-1][0]    
    }
        
    train(LearningRate)
    {
        for(var fm=0;fm<this.weights.length;fm++)
        {        
            for(var k=0;k<this.depth;k++)
                this.weights[fm][k] = SubMat( this.weights[fm][k], MulKMat(LearningRate,this.weightDeltas[fm][k]));
            this.bias[fm]    = this.bias[fm] - LearningRate * this.biasDeltas[fm];
        }
    }        
}