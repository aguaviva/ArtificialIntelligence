class Flatten
{
    constructor(dimIni)
    {    
        this.dimIni = dimIni;
        this.name ="Flatten";
    }

    forwardPass(input)
    {        
        var row = []
   
        this.input = input
   
        for(var f=0;f<input.length;f++)
        {
            for(var z=0;z<input[0].length;z++)
            {
                for(var y=0;y<input[0][0].length;y++)
                {
                    for(var x=0;x<input[0][0][0].length;x++)    
                    {
                        row.push(input[f][z][y][x]);
                    }
                }
            }        
        }
        
        return [row];
    }

    backPropagation(layerDerivative)
    {                       
        var input = layerDerivative;

        var fm = [];

        for(var f=0;f<this.input.length;f++)
        {   
            fm[f]=[];
            for(var z=0;z<this.input[0].length;z++)
            {
                fm[f][z]=[];
                for(var y=0;y<this.input[0][0].length;y++)
                {
                    fm[f][z][y]=[];
                    for(var x=0;x<this.input[0][0][0].length;x++)    
                    {
                        fm[f][z][y][x] = input[i++];
                    }
                }
            }        
        }
       
        return fm;
    }

    backpropInput(output, net)
    {                
        return output;
    }

    computeDeltas(layerDerivative)
    {
        this.deltas = [];
    }

    train(LearningRate) {};    
}
