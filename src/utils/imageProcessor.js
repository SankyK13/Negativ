/**
 * Negative-to-Positive Image Processing Engine v5
 * Much more aggressive per-channel gamma to eliminate blue cast.
 */

export const FILM_PRESETS = {
  color_negative: {
    label: 'Color Negative (C-41)',
    description: 'Standard color negative film — Kodak Gold, Portra, Fuji Superia, etc.',
    gammaR: 0.70,
    gammaG: 0.88,
    gammaB: 1.40,
    clipLow: 0.006,
    clipHigh: 0.006,
    sCurveStrength: 0.22,
    saturation: 1.25,
    brightness: 1.08,
    sharpenAmount: 0.35,
  },
  bw_negative: {
    label: 'B&W Negative',
    description: 'Black and white negative film — Tri-X, HP5, T-Max, etc.',
    gammaR: 0.95,
    gammaG: 0.95,
    gammaB: 0.95,
    clipLow: 0.008,
    clipHigh: 0.008,
    sCurveStrength: 0.20,
    saturation: 0.0,
    brightness: 1.05,
    sharpenAmount: 0.4,
  },
  slide_film: {
    label: 'Slide / Positive (E-6)',
    description: 'Reversal film — Velvia, Provia, Ektachrome. No inversion — enhance only.',
    gammaR: 1.0,
    gammaG: 1.0,
    gammaB: 1.0,
    clipLow: 0.003,
    clipHigh: 0.003,
    sCurveStrength: 0.15,
    saturation: 1.3,
    brightness: 1.0,
    sharpenAmount: 0.3,
    skipInversion: true,
  },
  auto: {
    label: 'Auto Detect',
    description: 'Automatically detect film type and apply corrections.',
    gammaR: 0.70,
    gammaG: 0.88,
    gammaB: 1.40,
    clipLow: 0.006,
    clipHigh: 0.006,
    sCurveStrength: 0.22,
    saturation: 1.20,
    brightness: 1.05,
    sharpenAmount: 0.35,
  },
};

export function getProcessorHTML(base64Image, preset) {
  var p = FILM_PRESETS[preset] || FILM_PRESETS.auto;

  return '<!DOCTYPE html>' +
'<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<style>body{margin:0;background:#000}canvas{display:none}</style></head>' +
'<body><canvas id="canvas"></canvas>' +
'<script>' +
'(function(){' +
'var CONFIG=' + JSON.stringify(p) + ';' +
'var img=new Image();' +
'img.crossOrigin="anonymous";' +
'img.onload=function(){' +
'  try{' +
'    var result=processImage(img,CONFIG);' +
'    window.ReactNativeWebView.postMessage(JSON.stringify({type:"result",data:result}));' +
'  }catch(err){' +
'    window.ReactNativeWebView.postMessage(JSON.stringify({type:"error",message:err.message}));' +
'  }' +
'};' +
'img.onerror=function(){' +
'  window.ReactNativeWebView.postMessage(JSON.stringify({type:"error",message:"Failed to load image"}));' +
'};' +
'img.src="' + base64Image + '";' +

'function processImage(img,cfg){' +
'  var canvas=document.getElementById("canvas");' +
'  var ctx=canvas.getContext("2d");' +
'  canvas.width=img.width;' +
'  canvas.height=img.height;' +
'  ctx.drawImage(img,0,0);' +
'  var imageData=ctx.getImageData(0,0,canvas.width,canvas.height);' +
'  var data=imageData.data;' +
'  var totalPixels=canvas.width*canvas.height;' +

'  if(cfg.skipInversion){' +
'    sendProgress("Enhancing slide film...",20);' +
'    perChannelLevels(data,totalPixels,cfg.clipLow,cfg.clipHigh);' +
'    sendProgress("Adjusting color...",60);' +
'    applySaturation(data,cfg.saturation);' +
'    sendProgress("Sharpening...",85);' +
'    ctx.putImageData(imageData,0,0);' +
'    unsharpMask(canvas,ctx,cfg.sharpenAmount);' +
'    sendProgress("Done",100);' +
'    return canvas.toDataURL("image/jpeg",0.95);' +
'  }' +

// Step 1: Invert
'  sendProgress("Inverting colors...",10);' +
'  for(var i=0;i<data.length;i+=4){' +
'    data[i]=255-data[i];' +
'    data[i+1]=255-data[i+1];' +
'    data[i+2]=255-data[i+2];' +
'  }' +

// Step 2: Per-channel auto-levels
'  sendProgress("Removing orange mask...",25);' +
'  perChannelLevels(data,totalPixels,cfg.clipLow,cfg.clipHigh);' +

// Step 3: Per-channel gamma
'  sendProgress("Color balance correction...",40);' +
'  var lutR=buildGammaLUT(cfg.gammaR);' +
'  var lutG=buildGammaLUT(cfg.gammaG);' +
'  var lutB=buildGammaLUT(cfg.gammaB);' +
'  for(var i=0;i<data.length;i+=4){' +
'    data[i]=lutR[data[i]];' +
'    data[i+1]=lutG[data[i+1]];' +
'    data[i+2]=lutB[data[i+2]];' +
'  }' +

// Step 4: S-curve
'  sendProgress("Applying contrast curve...",55);' +
'  var sCurveLUT=buildSCurveLUT(cfg.sCurveStrength);' +
'  for(var i=0;i<data.length;i+=4){' +
'    data[i]=sCurveLUT[data[i]];' +
'    data[i+1]=sCurveLUT[data[i+1]];' +
'    data[i+2]=sCurveLUT[data[i+2]];' +
'  }' +

// Step 5: Brightness
'  sendProgress("Adjusting brightness...",65);' +
'  if(cfg.brightness&&cfg.brightness!==1.0){' +
'    for(var i=0;i<data.length;i+=4){' +
'      data[i]=clamp(data[i]*cfg.brightness);' +
'      data[i+1]=clamp(data[i+1]*cfg.brightness);' +
'      data[i+2]=clamp(data[i+2]*cfg.brightness);' +
'    }' +
'  }' +

// Step 6: Second levels pass
'  sendProgress("Final levels pass...",73);' +
'  perChannelLevels(data,totalPixels,0.003,0.003);' +

// Step 7: Saturation
'  sendProgress("Enhancing colors...",82);' +
'  if(cfg.saturation!==1.0){' +
'    applySaturation(data,cfg.saturation);' +
'  }' +

// Step 8: Sharpening
'  sendProgress("Sharpening...",90);' +
'  ctx.putImageData(imageData,0,0);' +
'  unsharpMask(canvas,ctx,cfg.sharpenAmount);' +

'  sendProgress("Finalizing...",98);' +
'  return canvas.toDataURL("image/jpeg",0.95);' +
'}' +

'function perChannelLevels(data,totalPixels,clipLow,clipHigh){' +
'  for(var ch=0;ch<3;ch++){' +
'    var hist=new Uint32Array(256);' +
'    for(var i=0;i<totalPixels;i++) hist[data[i*4+ch]]++;' +
'    var lowT=Math.floor(totalPixels*clipLow);' +
'    var highT=Math.floor(totalPixels*clipHigh);' +
'    var cum=0,lo=0;' +
'    for(var v=0;v<256;v++){cum+=hist[v];if(cum>=lowT){lo=v;break;}}' +
'    cum=0;var hi=255;' +
'    for(var v=255;v>=0;v--){cum+=hist[v];if(cum>=highT){hi=v;break;}}' +
'    var span=hi-lo;if(span<1)span=1;' +
'    for(var i=0;i<totalPixels;i++){' +
'      var idx=i*4+ch;' +
'      data[idx]=Math.max(0,Math.min(255,Math.round(((data[idx]-lo)/span)*255)));' +
'    }' +
'  }' +
'}' +

'function buildGammaLUT(gamma){' +
'  var lut=new Uint8Array(256);' +
'  for(var i=0;i<256;i++){' +
'    lut[i]=Math.max(0,Math.min(255,Math.round(Math.pow(i/255,gamma)*255)));' +
'  }' +
'  return lut;' +
'}' +

'function buildSCurveLUT(strength){' +
'  var lut=new Uint8Array(256);' +
'  var twoPi=2*Math.PI;' +
'  for(var i=0;i<256;i++){' +
'    var x=i/255;' +
'    var curved=x+strength*Math.sin(twoPi*x)/twoPi;' +
'    lut[i]=Math.max(0,Math.min(255,Math.round(curved*255)));' +
'  }' +
'  return lut;' +
'}' +

'function applySaturation(data,amount){' +
'  for(var i=0;i<data.length;i+=4){' +
'    var r=data[i],g=data[i+1],b=data[i+2];' +
'    var gray=0.299*r+0.587*g+0.114*b;' +
'    data[i]=clamp(gray+amount*(r-gray));' +
'    data[i+1]=clamp(gray+amount*(g-gray));' +
'    data[i+2]=clamp(gray+amount*(b-gray));' +
'  }' +
'}' +

'function unsharpMask(canvas,ctx,amount){' +
'  var tc=document.createElement("canvas");' +
'  tc.width=canvas.width;tc.height=canvas.height;' +
'  var tctx=tc.getContext("2d");' +
'  tctx.filter="blur(1.2px)";' +
'  tctx.drawImage(canvas,0,0);' +
'  var sd=ctx.getImageData(0,0,canvas.width,canvas.height);' +
'  var bd=tctx.getImageData(0,0,canvas.width,canvas.height);' +
'  var s=sd.data,bl=bd.data;' +
'  for(var i=0;i<s.length;i+=4){' +
'    s[i]=clamp(s[i]+amount*(s[i]-bl[i]));' +
'    s[i+1]=clamp(s[i+1]+amount*(s[i+1]-bl[i+1]));' +
'    s[i+2]=clamp(s[i+2]+amount*(s[i+2]-bl[i+2]));' +
'  }' +
'  ctx.putImageData(sd,0,0);' +
'}' +

'function clamp(v){return Math.max(0,Math.min(255,Math.round(v)));}' +

'function sendProgress(msg,pct){' +
'  window.ReactNativeWebView.postMessage(JSON.stringify({type:"progress",message:msg,percent:pct}));' +
'}' +

'})();' +
'</script></body></html>';
}