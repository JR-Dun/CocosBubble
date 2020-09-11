export default class YUVFrag {
    static yuv_vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 tc;
    void main() 
    {
        gl_Position = a_position;
        tc = a_texCoord;
    }
    `;
       
    static yuv_frag = `
    varying lowp vec2 tc;
    uniform sampler2D SamplerY;
    uniform sampler2D SamplerU;
    uniform sampler2D SamplerV;

    void main()
    {
        mediump vec3 yuv;
        lowp vec3 rgb;
        yuv.x = texture2D(SamplerY, tc).r;
        yuv.y = texture2D(SamplerU, tc).r - 0.5;
        yuv.z = texture2D(SamplerV, tc).r - 0.5;
        rgb = mat3(1, 1, 1, 0, -0.39465,  2.03211, 1.13983, -0.58060, 0) * yuv;
        gl_FragColor = vec4(rgb, 1);
    }
    `;
}