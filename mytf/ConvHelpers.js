function ReverseKernel1D(kernel)
{
    return kernel.slice().reverse();
}

function Add1DPaddingMat(input)
{
    var b = input.slice(0);
    b.unshift(Array(input[0].length).fill(0));
    b.push(Array(input[0].length).fill(0));
    return b;
}

function Conv1DInputForward(nonPaddedInput, weights, bias, padding)
{
    var input = Add1DPaddingMat(nonPaddedInput)

    out = []
    for(var y=0;y<input.length-weights.length+ padding;y++)
    {
        var o = bias;
        for(var i=0;i<weights.length;i++)
        {
            o+= input[y+i][0] * weights[i];
        }
        out[y]=[o];
    }
    return out;
}

//----------------------------------------------------------------






//----------------------------------------------------------------


