// import yuv from './YUVFrag';
// const { ccclass, property } = cc._decorator;

// @ccclass
// export default class YUVEffect extends cc.Component {

//     program: cc.GLProgram;
//     startTime:number = Date.now();
//     time: number = 0;

//     resolution={ x:0.0, y:0.0};

//     onLoad() {
//         // this.defaultTex.initWithData(this.node.getComponent(cc.Sprite).spriteFrame.set);
//         // this.defaultTex. = cc.textureCache.addImage("background.png");
//         // cc.loader.loadRes('Images/test.jpg', function (error, texture) {
//         //     console.log(error);
//         //     this.defaultTex = texture;

//             this.resolution.x = ( this.node.getContentSize().width );
//             this.resolution.y = ( this.node.getContentSize().height );
//             this.useWater();
            
//             this.loadYUV();

//         // }.bind(this));

//     }

//     start() {
//     }

//     useWater() {
//         this.program = new cc.GLProgram();
//         if (cc.sys.isNative) {
//             this.program.initWithString(yuv.yuv_vert, yuv.yuv_frag);
//         } else {
//             this.program.initWithVertexShaderByteArray(yuv.yuv_vert, yuv.yuv_frag);
//             this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
//             this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
//         }
//         this.program.link();
//         this.program.updateUniforms();
//         this.program.use();

//         if (cc.sys.isNative) {
//             var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
//         } else {

//         }
//         this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
//     }

//     setProgram(node: any, program: any) {
//         if (cc.sys.isNative) {
//             var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
//             node.setGLProgramState(glProgram_state);
//         } else {
//             node.setShaderProgram(program);
//         }
//     }

//     setTexture(y:cc.Texture2D, u:cc.Texture2D, v:cc.Texture2D)
//     {
//         let texY = this.program.getUniformLocationForName("SamplerY");
//         let texU = this.program.getUniformLocationForName("SamplerU");
//         let texV = this.program.getUniformLocationForName("SamplerV");
//         // cc.gl.bindTexture2DN(texY, y);
//         // cc.gl.bindTexture2DN(texU, u);
//         // cc.gl.bindTexture2DN(texV, v);

//         this.program.setUniformLocationWith1i(texY, y);
//         this.program.setUniformLocationWith1i(texU, u);
//         this.program.setUniformLocationWith1i(texV, v);
//     }

//     defaultTex:cc.Texture2D = new cc.Texture2D();
//     textureY:cc.Texture2D = new cc.Texture2D();
//     textureU:cc.Texture2D = new cc.Texture2D();
//     textureV:cc.Texture2D = new cc.Texture2D();

//     loadYUV()
//     {
//         cc.loader.loadRes("Yuv/strY.txt",function(err, y) {
//             dataY = new Uint8Array(this.toUTF8Array(y.text));

//             cc.loader.loadRes("Yuv/strU.txt",function(err, u) {
//                 dataU = new Uint8Array( this.toUTF8Array(u.text));

//                 cc.loader.loadRes("Yuv/strV.txt",function(err, v) {
//                     dataV = new Uint8Array(this.toUTF8Array(v.text));

//                     console.log(dataY);
//                     console.log(dataU);
//                     console.log(dataV);

//                     // this.textureY.initWithData(dataY);
//                     // this.textureU.initWithData(dataU);
//                     // this.textureV.initWithData(dataV);

//                     this.setTexture(this.textureY,this.textureU,this.textureV);
//                     // this.setTexture(this.defaultTex, this.defaultTex, this.defaultTex);

//                 }.bind(this));
//             }.bind(this));
//         }.bind(this));
//         return;


//         cc.loader.load("http://192.168.0.246/test-1280x720-1.yuv", function(err, data){
//             console.log(data.length);
//             console.log(ArrayBuffer.isView(data)); 
//             var w = 1280;
//             var h = 720;
//             // var bufferY = new ArrayBuffer(w*h);
//             // var bufferU = new ArrayBuffer(w*h/4);
//             // var bufferV = new ArrayBuffer(w*h/4);

//             var arrayBuffer = this.toArrayBuffer(data);
//             var y = new Uint8Array(arrayBuffer,0,w*h);
//             var u = new Uint8Array(arrayBuffer,w*h, w*h/4);
//             var v = new Uint8Array(arrayBuffer,w * h * 5 / 4,  w*h/4 - (1382400-data.length));
//             // bufferY.copy(data, 0,0, w*h);
//             // bufferU.copy(data, 0,w*h, w*h/4);
//             // bufferV.copy(data, 0,w * h * 5 / 4, w*h/4);

//             console.log(y.length);
//             console.log(u.length);
//             console.log(v.length);

//             this.textureY.initWithData(y);
//             this.textureU.initWithData(u);
//             this.textureV.initWithData(v);

//             console.log("textureY " + this.textureY.width);
//             console.log("textureU " + this.textureU);
//             console.log("textureV " + this.textureV);

//             this.setTexture(this.textureY,this.textureU,this.textureV);
//         }.bind(this));
//         return;

//         var dataY,dataU,dataV;
//         cc.loader.loadRes("Yuv/y.txt",function(err, y) {
//             dataY = new Uint8Array(this.toBytes(y.text));

//             cc.loader.loadRes("Yuv/u.txt",function(err, u) {
//                 dataU = new Uint8Array( this.toBytes(u.text));

//                 cc.loader.loadRes("Yuv/v.txt",function(err, v) {
//                     dataV = new Uint8Array(this.toBytes(v.text));

//                     console.log(dataY);
//                     console.log(dataU);
//                     console.log(dataV);

//                     // this.textureY.initWithData(dataY);
//                     // this.textureU.initWithData(dataU);
//                     // this.textureV.initWithData(dataV);

//                     this.setTexture(this.textureY,this.textureU,this.textureV);
//                     // this.setTexture(this.defaultTex, this.defaultTex, this.defaultTex);

//                 }.bind(this));
//             }.bind(this));
//         }.bind(this));
//     }

//     toArrayBuffer(buf)
//     {
//         var ab = new ArrayBuffer(buf.length);
//         var view = new Uint8Array(ab);
//         for (var i = 0; i < buf.length; ++i) {
//             view[i] = buf[i];
//         }
//         return ab;
//     }

//     toBytes(str) {
//         var bytes = [];
//         for(var i = 0; i < str.length; i++)
//         {
//             var charcode = str.charCodeAt(i);
//             var byte = charcode & 0xff;
//             bytes.push(byte);
//         }

//         return bytes;
//     }

//     toUTF8Array(str) {
//         var utf8 = [];
//         for (var i=0; i < str.length; i++) {
//             var charcode = str.charCodeAt(i);
//             if (charcode < 0x80) utf8.push(charcode);
//             else if (charcode < 0x800) {
//                 utf8.push(0xc0 | (charcode >> 6), 
//                         0x80 | (charcode & 0x3f));
//             }
//             else if (charcode < 0xd800 || charcode >= 0xe000) {
//                 utf8.push(0xe0 | (charcode >> 12), 
//                         0x80 | ((charcode>>6) & 0x3f), 
//                         0x80 | (charcode & 0x3f));
//             }
//             // surrogate pair
//             else {
//                 i++;
//                 // UTF-16 encodes 0x10000-0x10FFFF by
//                 // subtracting 0x10000 and splitting the
//                 // 20 bits of 0x0-0xFFFFF into two halves
//                 charcode = 0x10000 + (((charcode & 0x3ff)<<10)
//                         | (str.charCodeAt(i) & 0x3ff));
//                 utf8.push(0xf0 | (charcode >>18), 
//                         0x80 | ((charcode>>12) & 0x3f), 
//                         0x80 | ((charcode>>6) & 0x3f), 
//                         0x80 | (charcode & 0x3f));
//             }
//         }
//         return utf8;
//     }
// }
