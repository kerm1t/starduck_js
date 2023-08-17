//import { vec2 } from "./vec2.js";

var ctx = cnv.getContext("2d");
var data = ctx.createImageData(600,600);
var buf = new Uint32Array(data.data.buffer);

// https://stackoverflow.com/questions/39213661/canvas-using-uint32array-wrong-colors-are-being-rendered
function reverseUint32 (uint32) {
    var s32 = new Uint32Array(4);
    var s8 = new Uint8Array(s32.buffer);
    var t32 = new Uint32Array(4);
    var t8 = new Uint8Array(t32.buffer);        
    reverseUint32 = function (x) {
        s32[0] = x;
        t8[0] = s8[3];
        t8[1] = s8[2];
        t8[2] = s8[1];
        t8[3] = s8[0];
        return t32[0];
    }
    return reverseUint32(uint32);
};

function bresenham(x0, y0, x1, y1, col) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
    var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
    var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
    var err = dx+dy, e2; // error value e_xy

    while (true)
    {
        buf[y0*600+x0]=col;

        if (x0==x1 && y0==y1) break;
        e2 = 2*err;
        if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
        if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
    }
}

function bresenham_arr(x0, y0, x1, y1, xarr, col) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
  var dx = Math.abs(x1 - x0), sx = x0<x1 ? 1 : -1;
  var dy = -Math.abs(y1 - y0), sy = y0<y1 ? 1 : -1;
  var err = dx + dy, e2; // error value e_xy

  while (true)
  {
    buf[y0*600+x0]=col;
    xarr[y0] = x0; // <-- wichtig! x-pos merken!

    if (x0 == x1 && y0 == y1) break;
    e2 = 2 * err;
    if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
    if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
  }
}

function triangle_filled(x0,y0,x1,y1,x2,y2, col)
{
  var p0 = vec2(x0,y0);
  var p1 = vec2(x1,y1);
  var p2 = vec2(x2,y2);
  // sortiere nach y
  var top, middle, bottom, tmp;
  if (p1.y < p0.y)
  {
    top = p1;
    middle = p0;
  }
  else
  {
    top = p0;
    middle = p1;
  }
  if (p2.y < middle.y)
  {
    if (p2.y < top.y)
    {
      bottom = middle;
      middle = top;
      top = p2;
    }
    else
    {
      bottom = middle;
      middle = p2;
    }
  }
  else
  {
    bottom = p2;
  }

  // 2do: vector instead of fixed array (depends on screen dimensions)
  const xarr = new Array(1000);
  const xarr2 = new Array(1000);
  bresenham_arr(top.x, top.y, middle.x, middle.y, xarr, col);
  bresenham_arr(top.x, top.y, bottom.x, bottom.y, xarr2, col);
  bresenham_arr(middle.x, middle.y, bottom.x, bottom.y, xarr, col);
  for (var y = top.y; y < bottom.y; y++)
  {
    bresenham(xarr[y], y, xarr2[y], y, col); // man kann sogar noch einfacher mit x-Schleife schreiben
  }
}


const max_bars = 30
bars = 3;
barwdth = 10;
const piano_up = new Array(max_bars);
//const piano_low = new Array(10);
for (i=0;i<=bars;i++)
{
  piano_up[i] = i*barwdth;
//  piano_low[i] = i*15;
}
bufidx = 0;

function draw_bar(x1,x2,col) {
  var p0 = vec2(x1,10);
  var p1 = vec2(x2,10);
  var p2 = vec2(x2,100); // 2do: low
  var p3 = vec2(x1,100); // 2do: low
  buf[p0.y*600+p0.x]=col;
  buf[p1.y*600+p1.x]=col;
  buf[p2.y*600+p2.x]=col;
  buf[p3.y*600+p3.x]=col;
  triangle_filled(p0.x,p0.y, p1.x,p1.y,p2.x,p2.y, col); // r
  triangle_filled(p2.x,p2.y, p3.x,p3.y,p0.x,p0.y, col); // r
}

setInterval(function(){
  var start=Date.now();
  
  sl = parseInt(slider.value);

/*  for (i=0;i<=bars;i++) {
  //  piano_up[i] = (i+sl)*10;
    piano_up[i] = (i*10)+sl;
  }
*/
  for (j=0;j<bars;j++) {
    x1 = piano_up[j]+sl;
    x2 = piano_up[j+1]+sl;
    if (j%2==1) col = reverseUint32(0x0000ffff); else col = reverseUint32(0xff00ffff);
//    col = reverseUint32(Math.random()*16777215);
    if (x2 > (bars*barwdth)) {
      xtmp = (bars*barwdth);
      draw_bar(x1,xtmp,col);
      xtmp = 0;
      draw_bar(xtmp,piano_up[0]+sl,col);
    }
    draw_bar(x1, x2, col);
  }
/*
for (i=0;i<bars;i++)
{
  piano_up[i]+=1;
//  piano_low[i]+=2;
  if (piano_up[i]>(bars*barwdth)) {
    piano_up[i]=(piano_up[0]%(bars*barwdth));
    bufidx = i;
  }
//  if (piano_low[i]>200) piano_low[i]=piano_low[0]-20;
}
*/
    ctx.putImageData(data,0,0);
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
},20);

