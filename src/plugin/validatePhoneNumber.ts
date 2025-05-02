/**
 * 验证手机号是否合法
 * @param {string} phoneNumber 待验证的手机号
 * @returns {boolean} 返回true表示合法，false表示不合法
 */
export default function (phoneNumber: string): boolean {
    // 去除字符串两端空格
    const trimmedPhone = phoneNumber.trim();

    // 中国大陆手机号正则表达式
    // 11位数字，以1开头，第二位通常是3-9
    const phoneRegex = /^1[3-9]\d{9}$/;

    // 验证是否符合正则表达式
    return phoneRegex.test(trimmedPhone);
}
