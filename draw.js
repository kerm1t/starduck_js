// https://stackoverflow.com/questions/58482163/how-to-improve-html-canvas-performance-drawing-pixels

var ctx = cnv.getContext("2d");
var data = ctx.createImageData(600,600);
var buf = new Uint32Array(data.data.buffer);

function draw(x1,y1,x2,y2){
  var i=0;
  for(var y=0;y<600;y++)
    for(var x=0;x<600;x++){
      var d1=(Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))/10) & 1;
      var d2=(Math.sqrt((x-x2)*(x-x2)+(y-y2)*(y-y2))/10) & 1;
      buf[i++]=d1==d2?0xFF000000:0xFFFFFFFF;
    }
  ctx.putImageData(data,0,0);
}

var cnt=0;
setInterval(function(){
//  cnt++;
  cnt = parseInt(slider.value);
  var start=Date.now();
  draw(300+300*Math.sin(cnt*Math.PI/180),
       300+300*Math.cos(cnt*Math.PI/180),
       500+100*Math.sin(cnt*Math.PI/100),
       500+100*Math.cos(cnt*Math.PI/100));
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
},20);
