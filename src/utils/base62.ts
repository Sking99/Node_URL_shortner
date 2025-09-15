const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: number): string {
    if (num === 0) return base62Chars[0];
    let encoded = '';
    while (num > 0) {
        const remainder = num % 62;
        encoded = base62Chars[remainder] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded;
}

export function decodeBase62(str: string): number {
    let decoded = 0;
    for (let i = 0; i < str.length; i++) {
        const index = base62Chars.indexOf(str[i]);
        if (index === -1) throw new Error('Invalid character in Base62 string');
        decoded = decoded * 62 + index;
    }
    return decoded;
}