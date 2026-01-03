export const textTruncate = (str:any, length:any, ending:any) => {
    if (length == null) {
        length = 50;
    }
    if (ending == null) {
        ending = "...";
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};