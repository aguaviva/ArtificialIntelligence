

function EvalNetwork(network, input)
{
    var res = input
    for(var i=0;i<network.length-1;i++)
    {
        res = network[i].forwardPass(res);
    }
    
    return res;
}

function ForwardPropagation(network, input)
{
    var res = input
    for(var i=0;i<network.length;i++)
    {
       res = network[i].forwardPass(res);            
    }
    
    return res;
}



function BackwardPropagation(network)
{
    var layerDerivative = network[network.length-1].backPropagation()

    for(var i=network.length-2;i>0;i--)
    {   
        layerDerivative = network[i + 1].backPropagation(layerDerivative);
        if (network[i].computeDeltas!=undefined)
            network[i].computeDeltas(layerDerivative);
    }
}

function ApplyDeltas(network, LearningRate)
{
    for(var i=1;i<network.length-1;i++)
    {
        if (network[i].train!=undefined)
            network[i].train(LearningRate);
    }
}

function CalcError(network, input, output)
{
    var totalErr = 0;
    for(var i=0;i<input.length;i++)
    {
        var err = SubMat(ForwardPropagation(network, input[i]), output[i]);
        totalErr += MulMat(err, TransposeMat(err))[0][0];
    }
    return totalErr;
}

//--------------------------------------------------------------------

function Print(str)
{
    document.getElementById("text").innerHTML += str;
}

function PrintTensor(t)
{
    var out = "";
    if (t==undefined)
        out = "[]";
    else
    {
        var pad1 = "    "
        var pad2 = pad1+pad1
        var pad3 = pad2+pad1
        var pad4 = pad2+pad2
            
        
        var dims = GetArrayDimensions(t)
        if (dims == 4)
        {
            out += "[\n"
            for(var i=0;i<t.length;i++)
            {
                out += pad1+"[\n"
                for(var j=0;j<t[i].length;j++)
                {
                    out += pad2+"[\n"
                    out += PrintMat(pad3, t[i][j]);            
                    out += pad2+"[\n"
                }
                out += pad1+"]\n"
            }
            out += "]\n"
        }        
        else if (dims == 3)
        {
            for(var i=0;i<t.length;i++)
            {
                out += pad1 + PrintMat(t[i]);            
            }
        }
        else if (dims == 2)
        {
            out += PrintMat(t);            
        }
        else if (dims == 1)
        {
            out += "[" + t.join(",") + "]";            
        }
        else if (dims == 0)
        {
            out += t;            
        }
        else
        {
            out += "none"
        }
    }
    return "<pre>" + out + "</pre>";
}
   
function DumpWeights(network, input)
{    
    var res = input
        
    for(var i=0;i<network.length;i++)
    {
        var n = network[i];
        
        res = n.forwardPass(res);
    
        out = ""
        out +="<table>";
        ////////
        out += "<tr>";
        out += "<td><pre>name</pre></td>";
        out += "<td><pre>weights+bias</td>";
        out += "<td><pre>output</pre></td>";        
        out += "</tr>";
        ////////
        out += "<tr>";
        out += "<td>" + n.name + "</td>";
        out += "<td>" + PrintTensor(n.weights) +  PrintTensor(n.bias) + "</td>";                        
        out += "<td>" + PrintTensor(res) + "</td>";        
        out += "<tr>";
        out +="</table>";
        ////////
        Print(out)            
    }     
}

function numericalDerivarive(network, input, stage)
{
    var step = .0000001
    
    var ref = ForwardPropagation(network, input);

    var weigths = []
    
   for(var l=0;l<stage.weights.length;l++)
   {
        weigths[l] = []
        
        for(var k=0;k<stage.weights[0].length;k++)
        {
            weigths[l][k] = []

            for(var j=0;j<stage.weights[0][0].length;j++)
            {    
                weigths[l][k][j] = []
                for(var i=0;i<stage.weights[0][0][0].length;i++)
                {
                    var w = stage.weights[l][k][j][i];
                    stage.weights[l][k][j][i]+=step;
                   
                    
                    weigths[l][k][j][i] = (ForwardPropagation(network, input) - ref)/step;
                    stage.weights[l][k][j][i] = w;
                }
            }    
        }        
    }          
    
    var bias = []
    for(var l=0;l<stage.bias.length;l++)
    {
        var w = stage.bias[l];
        stage.bias[l] += step;
        bias[l] = (ForwardPropagation(network, input) - ref)/step;
        stage.bias[l] = w;
    }
    
    return [weigths, bias];
}


function TestNetwork(network, input, output)
{
    network[network.length-1].setValue(output);

    var nets = ForwardPropagation(network, input)
    for(var i=1;i<network.length-1;i++)
    {
        Print("<pre>"+i+") Forward pass: "+network[i].name+"</pre>");
    }

    Print("<pre>---------------------------------</pre>");

    var str = "<table><tr><td>analytical</td><td>numerical</td></tr><tr><td>";

    BackwardPropagation(network, nets);

    // analytical derivative
    for(var i=1;i<network.length;i++)
    {
        str += "<pre>"+i+" '" + network[i].name + "'</pre>";
        if (network[i].weights!=undefined)
        {
            str += "<pre>weights: "+PrintTensor(network[i].weightDeltas)+"</pre>";
            str += "<pre>bias: "+network[i].biasDeltas+"</pre>";
        }
    }

    str += "</td><td>";

    //numerical derivative
    for(var i=1;i<network.length;i++)
    {
        str += "<pre>"+i+" '" + network[i].name + "'</pre>";
        if (network[i].weights!=undefined)
        {
            var c = numericalDerivarive(network, input, network[i]);
            str += "<pre>weights: "+PrintTensor(c[0])+"</pre>";
            str += "<pre>bias: "+c[1]+"</pre>";
        }
    }

    str += "</td></tr></table>";

    Print(str);
}

function TestResult(name, network, input, output, learningRate, expected)
{
    for(var i=0;i<3;i++)
    {
        network[network.length-1].setValue(output);
        var nets = ForwardPropagation(network, input);
        //DumpWeights(network, input);
        BackwardPropagation(network);
        ApplyDeltas(network, learningRate);
    }

    var res = ForwardPropagation(network, input)
    
    var error = (res[0] - expected);
    
    return [name, error]
}

function DebugResult(name, network, input, output, learningRate, expected)
{
    Print(name)    
    
    for(var i=0;i<3;i++)
    {
        network[network.length-1].setValue(output);
        var nets = ForwardPropagation(network, input);
        DumpWeights(network, input);
        BackwardPropagation(network);
        ApplyDeltas(network, learningRate);
    }

    var res = ForwardPropagation(network, input)
    var out = " " + (res[0] - expected) + "</br>";        
    Print(out)       
    
    TestNetwork(network, input, output)
}
