class ActIdentity
{
    Act(x)
    {
        return x;//1.0/(1.0+Math.exp(-x));
    }

    DerAct(x)
    {
        return 1;//Act(x)*(1-Act(x));
    }
}


function sigmoid(x) { return 1.0/(1.0+Math.exp(-x)); }

class ActSigmoid
{
    Act(x)
    {
        return sigmoid(x);
    }

    DerAct(x)
    {
        return sigmoid(x)*(1-sigmoid(x));
    }
}

function NewActSigmoid()
{
    return new ActSigmoid()
}


class ActReLu
{
    Act(x)
    {
        return Math.max(0,x);
    }

    DerAct(x)
    {
        return (x>0)?1:0;
    }
}
/*
//softplus 
function Act(x)
{
    return Math.log( 1 + Math.exp(x));
}

function DerAct(x)
{
    return 1.0/(1.0 + Math.exp(-x));
}
*/
