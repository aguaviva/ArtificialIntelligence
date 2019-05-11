

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
        try 
        {
            res = network[i].forwardPass(res);            
        }
        catch(err) {
            Print( err.message + " at step: " + i + " " + network[i].name)
            return 
        }
    }
    
    return res;
}



function BackwardPropagation(network)
{
    var layerDerivative = network[network.length-1].backPropagation()

    for(var i=network.length-2;i>0;i--)
    {   
        layerDerivative = network[i + 1].backPropagation(layerDerivative);
        network[i].computeDeltas(layerDerivative);
    }
}

function ApplyDeltas(network, LearningRate)
{
    for(var i=1;i<network.length-1;i++)
    {
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

function SimpleTrain(network, input, output, LearningRate, epocsCount, iters)
{
    var t0 = performance.now();
    
    for(var l=0;l<iters;l++)
    {
        for(var epocs=0;epocs<epocsCount;epocs++)
        {
            for(var i=0;i<input.length;i++)
            {
                network[network.length-1].setValue(output[i]);
                
                ForwardPropagation(network, input[i])
                BackwardPropagation(network.getDerivative());
                
                ApplyDeltas(network, LearningRate);
            }
        }
    
        Print(CalcError(network, input, output).toFixed(4) + " : ");
        Print("  cost"+network[network.length-1].name+network[network.length-1].o + " : ");
        
        /*
        for(var i=0;i<input.length;i++)
            Print(PrintMat(ForwardPropagation(network, input[i])));
        */
        Print("<br>");
    }
    
    var t1 = performance.now();
    Print("time: " + (t1 - t0) + " milliseconds.<br>");
}



//--------------------------------------------------------------------

function Print(str)
{
    document.getElementById("text").innerHTML += str;
}

function PrintTensor(t)
{
    out = "";
    var dims = GetArrayDimensions(t)
    if (dims == 4)
    {
        for(var i=0;i<t.length;i++)
            for(var j=0;j<t[i].length;j++)
                out += PrintMat(t[i][j]);            
    }
    else if (dims == 3)
    {
        for(var i=0;i<t.length;i++)
            out += PrintMat(t[i]);            
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
    return out;
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
        out +="<tr>";
        out +="<td>name</td>";
        if (n.weights!=undefined)
            out +="<td>weights</td>";
        if (n.bias!=undefined)
            out +="<td>bias</td>";
        out +="<td>output</td>";        
        out +="</tr>";
        ////////
        out +="<tr>";
        out +="<td>"+n.name+"</td>";
        if (n.weights!=undefined)
        {
            out += "<td>" + PrintTensor(n.weights) + "</td>";            
        }
        
        if (n.bias!=undefined)
            out += "<td>" + PrintTensor(n.bias) + "</td>";            
            
        out += "<td>" + PrintTensor(res) + "</td>";        
        out +="<tr>";
            
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
    
    for(var l=0;l<stage.bias.length;l++)
    {
        var bias = []
        
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

    nets = ForwardPropagation(network, input)
    for(var i=1;i<network.length-1;i++)
    {
        Print("<pre>"+i+") Forward pass: "+network[i].name+"</pre>");
    }

    Print("<pre>---------------------------------</pre>");

    var str = "<table><tr><td>analytical</td><td>numerical</td></tr><tr><td>";

    BackwardPropagation(network, nets);

    // analytical derivative
    for(var i=1;i<network.length-1;i++)
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
    for(var i=1;i<network.length-1;i++)
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
    Print(name)    
    var out = " [";
    for(var i=0;i<3;i++)
    {
        out += i+" "
        network[network.length-1].setValue(output);
        nets = ForwardPropagation(network, input);
        //DumpWeights(network, input);
        BackwardPropagation(network);
        ApplyDeltas(network, learningRate);
    }

    var res = ForwardPropagation(network, input)
    out += "] " + (res[0] - expected) + "/// " + expected + "</br>";        
    Print(out)    
}

function DebugResult(name, network, input, output, learningRate, expected)
{
    Print(name)    
    for(var i=0;i<3;i++)
    {
        network[network.length-1].setValue(output);
        nets = ForwardPropagation(network, input);
        DumpWeights(network, input);
        BackwardPropagation(network);
        ApplyDeltas(network, learningRate);
    }

    var res = ForwardPropagation(network, input)
    var out = " " + (res[0] - expected) + "</br>";        
    Print(out)       
    
    TestNetwork(network, input, output)
}
