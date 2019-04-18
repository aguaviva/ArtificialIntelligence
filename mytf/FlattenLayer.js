class Flatten
{
    constructor(dimIni)
    {    
        this.dimIni = dimIni;
        this.name ="Flatten";
    }

    forwardPass(input)
    {        
        this.dim = GetDimensions(input)

        var row = []
   
        if (this.dim.length==2)
        {
            for(var y=0;y<this.dim[0];y++)
            {
                for(var x=0;x<this.dim[1];x++)
                {
                    row.push(input[y][x]);
                }
            }        
        }
        else if (this.dim.length==3)
        {
            for(var y=0;y<this.dim[1];y++)
            {
                for(var x=0;x<this.dim[2];x++)    
                {
                    for(var z=0;z<this.dim[0];z++)
                    {
                        row.push(input[z][y][x]);
                    }
                }
            }        
        }
        
        return [row];
    }

    backPropagation(layerDerivative)
    {                       
        var input = layerDerivative[0];

        if (this.dim.length==2)
        {
            var column = [];            
            
            for(var y=0;y<this.dim[0];y++)    
            {
                var row = [];
                for(var x=0;x<this.dim[1];x++)    
                {
                    row.push(input[y*this.dim[1]+ x]);
                }
                column.push(row) 
            }        
            return column;
        }
        else if (this.dim.length==3)
        {
            var fm = [];

            // build dim3 matrix
            for(var z=0;z<this.dim[0];z++)
            {
                var column = [];            
                for(var y=0;y<this.dim[1];y++)
                {
                    var row = [];
                    column.push(row); 
                }
                fm.push(column) 
            }     
            var i = 0;
            
            for(var y=0;y<this.dim[1];y++)
            {
                for(var x=0;x<this.dim[2];x++)
                {
                    for(var z=0;z<this.dim[0];z++)
                    {
                        fm[z][y][x] = input[i++];
                    }
                }
            }   
            return fm;
        }
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
    
    numericalDerivarive(network, input)
    {
        return [];
    }
}
