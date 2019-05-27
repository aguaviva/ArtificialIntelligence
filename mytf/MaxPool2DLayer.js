class MaxPool2DLayer
{
    constructor()
    {
        this.name ="MaxPool 2D";
    }

    forwardPass(inputfms)
    {               
        this.routing = TensorZero(inputfms.length, inputfms[0].length, inputfms[0][0].length, inputfms[0][0][0].length);        
        var fmout    = TensorZero(inputfms.length, inputfms[0].length, inputfms[0][0].length/2, inputfms[0][0][0].length/2);        
        
        for(var l=0;l<inputfms.length;l++)
        {        
            for(var k=0;k<inputfms[0].length;k++)
            {        
                for(var y=0;y<inputfms[0][0].length;y+=2)
                {
                    for(var x=0;x<inputfms[0][0][0].length;x+=2)
                    {
                        var ix = -1;
                        var iy = -1;
                        var max = -Infinity;
                        for(var ay = 0;ay<2;ay++)
                        {
                            for(var ax = 0;ax<2;ax++)
                            {
                                var v = inputfms[l][k][y + ay][x + ax];
                                if (v>max)
                                {
                                    ix = ax;
                                    iy = ay;
                                    max = v
                                }
                            }
                        }
                        
                        fmout[l][k][y/2][x/2] = max;

                        // compute routing matrix
                        for(var ay = 0;ay<2;ay++)
                        {
                            for(var ax = 0;ax<2;ax++)
                            {                                
                                this.routing[l][k][y+ay][x+ax] = (ay==iy && ax==ix)?(ix + (iy*2)):-1;
                            }
                        }
                    }
                }        
            }
        }        
        return fmout;
    }

    backPropagation(layerDerivative)    
    {              
        assert(layerDerivative.length == this.routing.length);
        assert(layerDerivative[0].length == this.routing[0].length);
        assert(layerDerivative[0][0].length*2 == this.routing[0][0].length);
        assert(layerDerivative[0][0][0].length*2 == this.routing[0][0][0].length);
    
        var fmout = TensorZero(layerDerivative.length, layerDerivative[0].length, layerDerivative[0][0].length*2, layerDerivative[0][0][0].length*2);        
    
        for(var l=0;l<layerDerivative.length;l++)
        {        
            for(var k=0;k<layerDerivative[0].length;k++)
            {        
                for(var y=0;y<layerDerivative[0][0].length;y++)
                {
                    for(var x=0;x<layerDerivative[0][0][0].length;x++)
                    {                        
                        var v = layerDerivative[l][k][y][x];
                        
                        for(var ay = 0;ay<2;ay++)
                        {
                            for(var ax = 0;ax<2;ax++)
                            {                                
                                var idx = this.routing[l][k][2*y+ay][2*x+ax];
                                if (idx>=0)
                                {
                                    var ix = (idx % 2);
                                    var iy = Math.floor(idx/ 2);
                                    fmout[l][k][2*y + ay][2*x + ax] = v;
                                }
                            }
                        }
                    }
                }                        
            }
        }
        
        return fmout;                
    }

}
