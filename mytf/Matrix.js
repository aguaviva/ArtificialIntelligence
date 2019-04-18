function RandomMat(inp,neurons)
{
    var L = []
    for(var i=0;i<neurons;i++)
    {
        L[i] = [];7
        for(var j=0;j<inp;j++)
        {
            L[i].push(2*Math.random()-1);
        }
    }
    return L;
}

function GetDimensions(m)
{
    o = []
    
    for(;;)
    {
        if (Array.isArray(m)==false)
            break;
            
        o.push(m.length);
        m=m[0];
    }
    return o;
}

function GetArrayDimensions(m)
{
    var mm=m;
    for(var i=0;i<5;i++)
    {
        if (Array.isArray(mm)==false) 
            return i;
        mm=mm[0]
    }
    
}

function PrintMat2D(m)
{
    var str = "<pre><table>";
    for(var j=0;j<m.length;j++)
    {
        str += "<tr><td>[</td>";
        for(var i=0;i<m[j].length;i++)
        {            
            str += "<td>" + m[j][i].toFixed(10) + "</td>";
        }
        str += "<td>]</td></tr>";
    }
    str += "</table></pre>";

    return str;
}

function PrintMat(mm)
{
    var d = GetDimensions(mm);
    var dim = d.length
    
    if (dim==2)
    {
        return PrintMat2D(mm)
    }
    else if (dim==3)
    {
        var str = ""
        for(var k=0; k<d[0];k++)
        {
            str += PrintMat(mm[k])
        }
    }    
    return str;
}

function RectangularMat(dimX, dimY)
{
    var O = [];
    for(var i=0;i<dimY;i++)
    {
        O[i] = Array(dimX).fill(0);
    }
    return O;
}

function MatId(dimX, value)
{
    var v = RectangularMat(dimX, dimX, value);
    
    for(var i=0;i<dimY;i++)
    {
        v[i][i]=value;
    }    
}

function MulMat(m1, m2)
{
    assert(m1[0].length == m2.length);

    var O = [];
    for(var j=0;j<m1.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m2[0].length;i++)
        {
            var tmp=0;
            for(var k=0;k<m1[0].length;k++)
            {                
                var v = (m1[j][k] * m2[k][i]);
                
                tmp += v;
            }
            O[j].push( tmp);
        }
    }
    return O;
}

function CheckMat(m, msg)
{
    var l = m[0].length;
    for(var j=0;j<m.length;j++)
    {
        if (l!=m[j].length)
            alert("caca");
            
        for(var i=0;i<m[j].length;i++)
        {
            if (typeof m[j][i] !="number")
            {
                console.log(msg+"\n "+  m[j][i]);        
                debugger;
            }
        }        
    }
}

function TransposeMat(m)
{
    var O = [];
    for(var j=0;j<m[0].length;j++)
    {
        O[j]=[];
        for(var i=0;i<m.length;i++)
        {
            O[j][i] = m[i][j];
        }
    }
    return O;
}

function AddMat(m1, m2)
{
    assert(m1.length == m2.length);
    assert(m1[0].length == m2[0].length);

    var O = [];
    for(var j=0;j<m1.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m1[0].length;i++)
        {
            O[j][i] = m1[j][i] + m2[j][i];
        }
    }
    return O;
}

function SimpleMulMat(m1, m2)
{
    assert(m1.length == m2.length);
    assert(m1[0].length == m2[0].length);

    var O = [];
    for(var j=0;j<m1.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m1[0].length;i++)
        {
            O[j][i] = m1[j][i] * m2[j][i];
        }
    }
    return O;
}

function MulKMat(k, m)
{
    var O = [];
    for(var j=0;j<m.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m[0].length;i++)
        {
            O[j][i] = m[j][i] * k;
        }
    }
    return O;
}

function SubMat(m1, m2)
{
    assert(m1.length == m2.length);
    assert(m1[0].length == m2[0].length);

    var O = [];
    for(var j=0;j<m1.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m1[0].length;i++)
        {
            O[j][i] = m1[j][i] - m2[j][i];
        }
    }
    return O;
}

function Square(v)
{
    return MulMat(v, TransposeMat(v))
}

function ConvertMat(m, x,y)
{
    var O = [];
    var n = 0;
    
    for(var j=0;j<y;j++)
        O[j]=[];
    
    for(var j=0;j<m.length;j++)
    {        
        for(var i=0;i<m[0].length;i++)
        {    
            O[Math.floor(n/x)][n % x] = m[j][i];
            n++;
        }    
    }
    
    return O;
}

function funcMat(func, m )
{
    var O = [];
    for(var j=0;j<m.length;j++)
    {
        O[j]=[];
        for(var i=0;i<m[0].length;i++)
        {
            O[j][i] = func(m[j][i]);
        }
    }
    return O;
}
