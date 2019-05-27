class FlattenLayer
{
    constructor(dimIni)
    {    
        this.dimIni = dimIni;
        this.name ="FlattenLayer";
    }

    forwardPass(input)
    {        
        var row = []
   
        this.input = input
   
        for(var z=0;z<input[0].length;z++)
        {            
            for(var y=0;y<input[0][0].length;y++)
            {
                for(var x=0;x<input[0][0][0].length;x++)        
                {
                    for(var f=0;f<input.length;f++)
                    {            
                        row.push(input[f][z][y][x]);
                    }
                }
            }        
        }
        
        return [[[row]]];
    }

    backPropagation(layerDerivative)
    {                       
        var input = layerDerivative[0][0][0];

        var i=0;

        var fm = TensorZero(this.input.length, this.input[0].length,this.input[0][0].length,this.input[0][0][0].length);
        
        for(var z=0;z<this.input[0].length;z++)
        {
            for(var y=0;y<this.input[0][0].length;y++)
            {
                for(var x=0;x<this.input[0][0][0].length;x++)    
                {
                    for(var f=0;f<this.input.length;f++)
                    {   
                        fm[f][z][y][x] = input[i++];
                    }
                }
            }        
        }
       
        return fm;
    }  
}
