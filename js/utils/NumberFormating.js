
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small, forceShitStandart) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    forceShitStandart = forceShitStandart || options.shitStandart
    if (forceShitStandart) { return formatShitStandart(decimal) }
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    forceShitStandart = forceShitStandart || options.shitStandart
    if (forceShitStandart) return formatShitStandartWhole(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}
function shitStandart(illion) {
    let a = [
        "k M B T q Q s S O N",
        " u d t q Q s S o n",
        " D V Tg qg Qg sg Sg Og Ng",
        " C De Te qe Qe se Se Oe Ne",
        " Mi Dl Tl ql Ql sl Sl Ol Nl",
        " α β γ δ ε ζ η θ ι",
        " κ λ μ ν ξ ο π ρ σ",
        " τ υ φ χ ψ ω ϱ ϸ ϟ",
        " 'α 'β 'γ 'δ 'ε 'ζ 'η 'θ 'ι",
        " а б в г д е ж з и",
        " й к л м н о п р с",
        " т у ф х ц ч ш щ ь",
        " 'а 'б 'в 'г 'д 'е 'ж 'з 'и"
    ];
    function Tier1OnTier2(ill,thr=0) {
        if (ill.gte(thr)) return `${a[4].split(" ")[ill.div(1000).floor().toNumber()]}${a[1].split(" ")[ill.mod(10).toNumber()]}${a[2].split(" ")[ill.div(10).floor().mod(10).toNumber()]}${a[3].split(" ")[ill.div(100).floor().mod(10).toNumber()]}`
        else return ""
    }
    function Tier2(ill) {
        if (ill.eq(0)) return "";
        let st = [];
        let e = ill.log(2).floor().toNumber();
        for (let i = (e>10?e-10:0); i <= e; i++) {
            if (ill.div(new Decimal(2).pow(i)).floor().mod(2).eq(1)) {
                st.push(`${a[5].split(" ")[(i+1)%10]}${a[6].split(" ")[Math.floor((i+1)/10)%10]}${a[7].split(" ")[Math.floor((i+1)/100)%10]}${a[8].split(" ")[Math.floor((i+1)/1000)]}`);
            }
        };
        return st.join("-")
    }
    function Tier3(ill) {
        if (ill.eq(0)) return "";
        let st = [];
        let e = ill.log(2).floor().toNumber();
        for (let i = (e>10?e-10:0); i <= e; i++) {
            if (ill.div(new Decimal(2).pow(i)).floor().mod(2).eq(1)) {
                st.push(`${a[9].split(" ")[(i+1)%10]}${a[10].split(" ")[Math.floor((i+1)/10)%10]}${a[11].split(" ")[Math.floor((i+1)/100)%10]}${a[12].split(" ")[Math.floor((i+1)/1000)]}`);
            }
        };
        return st.join("=")
    }
    function g(number) {
        return illion.div(new Decimal(10000).pow(number)).floor().mod(10000)
    }
    function h(number) {
        return illion.log10().div(4).log(2).div(new Decimal(10000).pow(number)).floor().mod(10000)
    }
    if (illion.lt(10000)) {
        if (illion.lt(10)) {
            return a[0].split(" ")[illion.toNumber()]
        } else {
            return `${a[4].split(" ")[illion.div(1000).floor().toNumber()]}${a[1].split(" ")[illion.mod(10).toNumber()]}${a[2].split(" ")[illion.div(10).floor().mod(10).toNumber()]}${a[3].split(" ")[illion.div(100).floor().mod(10).toNumber()]}`
        }
    } else if (illion.lt(new Decimal(10).pow(new Decimal(4).mul(new Decimal(2).pow(10000))))) {
        let e = illion.log10().div(4).floor();
        let tier2ill = e;
        let s = "";
        if (e.gte(1024)) {
            return Tier2(e)
        };
        for (let i = 0; i < (e.gte(3) ? 3 : e.add(1).toNumber()); i++) {
            if (i === 0) {
                if (!g(tier2ill).eq(0)) s+=`${Tier1OnTier2(g(tier2ill), 2)}${Tier2(tier2ill)}`
            } else {
                if (!g(tier2ill).eq(0)) s+=`${Tier1OnTier2(g(tier2ill))}${Tier2(tier2ill)}`
            }
            tier2ill = tier2ill.sub(1)
        };
        return s
    } else {
        let e = illion.log10().div(4).log(2).log10().div(4).floor();
        let tier3ill = e;
        let s = [];
        if (e.gte(1024)) {
            return Tier3(e)
        };
        for (let i = 0; i < (e.gte(3) ? 3 : e.add(1).toNumber()); i++) {
            if (i === 0) {
                if (!h(tier3ill).eq(0)) s.push(`${h(tier3ill).gte(2)?Tier2(h(tier3ill)):""}${Tier3(tier3ill)}`)
            } else {
                if (!h(tier3ill).eq(0)) s.push(`${Tier2(h(tier3ill))}${Tier3(tier3ill)}`)
            }
            tier3ill = tier3ill.sub(1)
        };
        return s.join("-")
    }
};
function formatShitStandart(number) {
    let s = "";
    if (number.lt(0)) {
        s = `-${formatShitStandart(number.neg())}`
    } else if (number.lt(1000)) {
        s = number.toStringWithDecimalPlaces(2)
    } else if (number.lt(new Decimal(10).pow(3_0000_0003))) {
        s = `${number.div(new Decimal(1000).pow(number.log(1000).floor())).toStringWithDecimalPlaces(2)}${shitStandart(number.log(1000).sub(1).floor())}`
    } else {
        s = shitStandart(number.log(1000).sub(1).floor())
    };
    return s
};
function formatShitStandartWhole(number) {
    let s = "";
    if (number.lt(0)) {
        s = `-${formatShitStandartWhole(number.neg().floor())}`
    } else if (number.lt(1000)) {
        s = number.floor()
    } else if (number.lt(new Decimal(10).pow(3_0000_0003))) {
        s = `${number.div(new Decimal(1000).pow(number.log(1000).floor())).toStringWithDecimalPlaces(2)}${shitStandart(number.log(1000).sub(1).floor())}`
    } else {
        s = shitStandart(number.log(1000).sub(1).floor())
    };
    return s
};

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}
