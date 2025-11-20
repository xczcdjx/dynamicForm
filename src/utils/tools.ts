const parseValue = (value: string, isArray?: boolean, isNumber?: boolean, splitSym: string = ',') => {
    let d: any
    if (isArray) {
        if (isNumber) {
            d = String(value).split(splitSym).map(Number).filter(it => !Number.isNaN(it))
        } else d = String(value).split(splitSym)
    } else {
        if (isNumber) d = parseInt(value)
        else d = value.toString()
    }
    return d
};
export {
    parseValue
}