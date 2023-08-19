//import { vec2 } from "./vec2.js";

var ctx = cnv.getContext("2d");
ctx.font = "12px Arial";
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
bars = 8; // multiple of 2
barwdth = 10;
const piano_init = new Array(max_bars+1);
const piano_init_low = new Array(max_bars+1);
const piano_col = new Array(max_bars+1)
var piano_up = new Array(max_bars+1);
var piano_low = new Array(max_bars+1);
for (i=0;i<=bars;i++)
{
  piano_init[i] = i*barwdth;
  piano_init_low[i] = -30+i*barwdth+5;
  if (i%2==1) piano_col[i] = reverseUint32(0x0000ffff); else piano_col[i] = reverseUint32(0xff00ffff);
}
bufidx = 0;
var x1 = new Array(max_bars+1);
var x2 = new Array(max_bars+1);

function draw_bar(x1,x2,x3,x4,col) {
  var p0 = vec2(x1,10);
  var p1 = vec2(x2,10);
  var p2 = vec2(x4,100); // low
  var p3 = vec2(x3,100); // low
  buf[p0.y*600+p0.x]=col;
  buf[p1.y*600+p1.x]=col;
  buf[p2.y*600+p2.x]=col;
  buf[p3.y*600+p3.x]=col;
  triangle_filled(p0.x,p0.y, p1.x,p1.y,p2.x,p2.y, col); // r
  triangle_filled(p2.x,p2.y, p3.x,p3.y,p0.x,p0.y, col); // r
}
var chg = 0;
setInterval(function(){
  var t_start=Date.now();
  
  sl = parseInt(slider.value);
  var start = 0;
  for (j=0;j<=bars;j++) {
    piano_up[j]=(piano_init[j]+sl) % (bars*barwdth+1);
    piano_low[j]=(piano_init_low[j]+sl*2) % (bars*barwdth+5+1);
    if (piano_up[j] < piano_up[start]) start = j; // start with smallest x-value
  }

  for (i=0;i<bars;i++) {
    j = start+i;
    x1 = piano_up[j%(bars+1)];
    x2 = piano_up[(j+1)%(bars+1)];
    x3 = piano_low[j%(bars+1)];
    x4 = piano_low[(j+1)%(bars+1)];
    col = piano_col[j%(bars+1)];
    if (x2 > (bars*barwdth+1)) {
      xtmp = (bars*barwdth+1);
      draw_bar(x1,xtmp,col);
      xtmp = 0;
      draw_bar(xtmp,piano_up[0]+sl,col);
    }
    draw_bar(x1, x2, x3,x4,col);
  }
  ctx.putImageData(data,0,0);

  t.innerText="Frame time:"+(Date.now()-t_start)+"ms";
  for (j=0;j<=bars;j++) {
    ctx.fillText(piano_up[j], 100, 100+j*12);
  }
  ctx.fillText("start: "+start, 100, 88);

  },20);
