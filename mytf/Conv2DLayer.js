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

    for(var j=0;j<padding;j++)
        b.push(Array(input[0].length+2*padding).fill(0));    

              
    for(var i=0;i<input.length;i++)
    {
        var l = input[i].slice(0);
        for(var j=0;j<padding;j++)
            l.unshift(0);
        for(var j=0;j<padding;j++)
            l.push(0);
        b.push(l);
    }
    
    for(var j=0;j<padding;j++)
        b.push(Array(input[0].length+2*padding).fill(0));
        
    return b;
}

function Conv2DMatrixForward(nonPaddedInput, weights, bias)
{
    var padding = (weights.length-1)/2;

    var input = Add2DPaddingMat(nonPaddedInput, padding)

    var out = []
    for(var y=0;y<input.length - weights.length + 1; y++)
    {
        out[y]=[]
        for(var x=0;x<input[0].length - weights[0].length + 1; x++)
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

function Conv2DTensorForward(input, weights, bias)
{
    assert(input.length == weights[0].length);

    var out = []   
    for(var j=0;j<weights.length;j++)
    {
        out[j] = []
        for(var i=0;i<input[0].length;i++)
        {            
            var o = Conv2DMatrixForward(input[0][i], weights[j][0], bias[j])   
            for(var k=1;k<input.length;k++)
            {
                o = AddMat(o , Conv2DMatrixForward(input[k][i], weights[j][k], 0))   
            }
            
            out[j][i] = o
        }
    }

    return out;
}

function computePartialDeltas(layerDerivative, weights, input)	
{
    var ld = [];	 
    

    var w = 0;
    for(var j=0;j<layerDerivative.length;j++)	    
    {	
        for(var i=0;i<layerDerivative[0].length;i++)
        {
            ld[i + j*layerDerivative[0].length] = [layerDerivative[j][i]];	
        }	
    }       	
    
    var padding = (weights.length-1)/2;
    var input = Add2DPaddingMat(input, padding)	

    var xx = input[0].length-weights[0].length + 1;	
    var yy = input.length-weights.length + 1;	

    var deltas = []    	
    for(var j=0;j<weights.length;j++)	
    {                    	
       for(var i=0;i<weights[0].length;i++)    	
       {	
           var row = []	
           for(var y=0;y<yy;y++)	
           {	
               for(var x=0;x<xx;x++)    	
               {	
                   row.push(input[y+j][x+i]);	
               }	
           }	
           deltas[i + j * weights.length ] = row;	
       }	
    }	

    var w = 0;	
    for(var i=0;i<ld.length;i++)                                    	
       w += ld[i][0];	

    var deltaWeights = MulMat(deltas,ld);	
    
    var dim = weights.length	
    return [ConvertMat(deltaWeights.slice(0, dim*dim), dim,dim), w];
}

class Conv2DLayer
{
    constructor(weights, bias)
    {
        this.weights = weights;
        this.bias = bias;
        this.name ="Conv2D";
    }

    forwardPass(input)
    {
        this.input = input;
        return Conv2DTensorForward(this.input, this.weights, this.bias);
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
        
        return Conv2DTensorForward(layerDerivative, revKernel, zeroBias)
    }   
    
    computeDeltas(layerDerivative)
    {       
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
                var o = computePartialDeltas(layerDerivative[l][0], this.weights[l][0], this.input[k][0]);
                var ww = o[0];
                bb = o[1]
                for(var i=1;i<this.input[0].length;i++)
                {
                    o = computePartialDeltas(layerDerivative[l][i], this.input[k][i]);
                    ww = AddMat(ww, o[0]);                    
                    bb += o[1];
                }
                this.weightDeltas[l][k] = ww;
            }
            
            this.biasDeltas[l] += bb;
        }
        
    }
        
    train(LearningRate)
    {
        for(var w=0;w<this.weights.length;w++)
        {
            assert(this.weightDeltas.length == this.weights.length);
            
            for(var z=0;z<this.weights[0].length;z++)
            {
                assert(this.weightDeltas[0].length == this.weights[0].length);
                
                this.weights[w][z] = SubMat( this.weights[w][z], (MulKMat(LearningRate,this.weightDeltas[w][z])));
            }
            
            this.bias[w]    = this.bias[w] - LearningRate * this.biasDeltas[w];
            
        }
        
    }        
        
}