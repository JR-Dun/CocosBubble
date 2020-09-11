
export class StringHelper {

    public static isEmpty(str: string): boolean {
        if(!str) {
            return true;
        }
        if(str.trim().length === 0){
            return true;
        }

        return false;
    }

    public static isAccount(account: string): boolean {
        if(this.isEmpty(account)) {
            return false;
        }
        
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if(reg.test(account)) {
            return true;
        }

        return false;
    }

    public static isPassword(password: string): boolean {
        if(this.isEmpty(password)) {
            return false;
        }
        
        // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\.\@\!\#\$\%\^\&\*\(\)]{6,20}$/;
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if(reg.test(password)) {
            return true;
        }

        return false;
    }

    public static isPhone(phoneNumber: string): boolean {
        if(this.isEmpty(phoneNumber)) {
            return false;
        }
        
        //通过正则表达式判断手机号码格式是否正确,根据电信，联通、移动手机号码规则可以到以下正则
        // 手机号码第一位是[1]开头，第二位[3,4,5,7,8]中的一位，第三位到第十一位则是[0-9]中的数字；
        //^1表示开头为1
        //[3|4|5|7|8] 表示3、4、5、7、8中的一位数值
        //[0-9]{9} 匹配包含0-9的数字
        let reg = /^1[3|4|5|7|8][0-9]{9}/;
        if(reg.test(phoneNumber)) {
            return true;//手机号码正确
        }

        return false;
    }

    public static isNumber(number:string): boolean {
        let reg = /^[\d]+$/;
        if(reg.test(number)) {
            return true;
        }
        return false;
    }

    public static hasHtml(str:string): boolean{
        let reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
        let array = str.match(reg);
        if(array)
        {
            return str.match(reg).length > 0;
        }
        else
        {
            return false;
        }
    }

    public static fixString(str:string): string {
        let result = "";  
		if (str) {  
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            str = str.replace(/[\r\n]/g, ""); 
            
            result = str;
		}  
		return result; 
    }


    public static isEmail(email: string): boolean {
        if(this.isEmpty(email)) {
            return false;
        }
        
        let reg = /([-a-zA-Z_0-9.]+)@([-a-zA-Z0-9_]+(\.[a-zA-Z]+)+)/;
        if(reg.test(email)) {
            return true;
        }

        return false;
    }
}
